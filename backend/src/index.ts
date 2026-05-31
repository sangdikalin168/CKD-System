require("dotenv").config();
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import express from "express";
import { DataSource } from "typeorm";
import { createServer } from "http";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { buildSchema } from "type-graphql";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "./permissions";

import refreshTokenRouter from "./Routes/refreshTokenRouter";
import { entities } from "./Entities";
import { Facility } from "./Entities/Facility";
import { Context } from "./Context/Context";
import path from "path";

// Production toggles — NODE_ENV=production disables dev-only conveniences.
const isProd = process.env.NODE_ENV === "production";

/** Ensure the default access places exist (idempotent; runs on every boot). */
async function ensureDefaultFacilities() {
  const defaults = [
    { code: "SWIM", name: "Swimming" },
    { code: "GYM", name: "Gym" },
    { code: "STEAM", name: "Steam / Sauna" },
  ];
  for (const d of defaults) {
    const exists = await Facility.findOne({ where: { code: d.code } });
    if (!exists) {
      await Facility.create({ code: d.code, name: d.name, requires_door_access: true }).save();
    }
  }
}


export const MysqlDataSource = new DataSource({
  type: "mysql",
  connectorPackage: "mysql2",
  port: 3306,
  connectTimeout: 24 * 3600,
  acquireTimeout: 60 * 60 * 1000,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false,
  // Auto-sync schema in dev only. In production a stray entity change must never
  // auto-alter the live DB — use migrations (and ensure prod schema exists first).
  synchronize: !isProd,
  entities: [...entities],
});

const main = async () => {
  MysqlDataSource.initialize()
    .then(async () => {
      console.log("Database Connected");
      await ensureDefaultFacilities();
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });

  const app = express();
  app.use(express.static(path.resolve(__dirname, "../../client/dist")));
  
  // Serve uploaded files
  app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/refresh_token", refreshTokenRouter);

  const httpServer = createServer(app);

  const apolloServer = new ApolloServer({
    schema: applyMiddleware(
      await buildSchema({
        validate: false,
        resolvers: [`${__dirname}/Resolvers/*.{ts,js}`],
      }),
      permissions
    ),
    cache: "bounded",
    // Schema introspection + Playground only outside production.
    introspection: !isProd,
    // Don't leak internal error details (stack traces, SQL) to clients in prod.
    formatError: (formattedError) => {
      if (isProd && formattedError.extensions?.code === "INTERNAL_SERVER_ERROR") {
        return { message: "Internal server error", extensions: { code: "INTERNAL_SERVER_ERROR" } };
      }
      return formattedError;
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ...(isProd ? [] : [ApolloServerPluginLandingPageGraphQLPlayground]),
    ],
    context: ({ req, res }): Context => <Context>({
      req,
      res,
    }),
  });

  await apolloServer.start();

  const defaultOrigins = [
    "https://studio.apollographql.com",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://192.168.100.30:5173",
    "http://192.168.100.30:5174",
    "http://110.235.252.175:5173",
    "http://110.235.252.175:5174",
  ];
  const corsOriginEnv = process.env.CORS_ORIGIN;
  const corsOrigin = corsOriginEnv === "*"
    ? true
    : corsOriginEnv
      ? corsOriginEnv.split(",").map((o) => o.trim())
      : defaultOrigins;

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: corsOrigin,
      credentials: true,
    },
  });

  const PORT = process.env.PORT || 4000;

  await new Promise((resolve) =>
    httpServer.listen({ port: PORT }, resolve as () => void)
  );

  // Typically, http://localhost:4000/graphql
  console.log(
    `SERVER STARTED And PORT ${PORT}`
  );
};

main().catch((err) => {
  console.log(err);
});
