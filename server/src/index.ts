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

import refreshTokenRouter from "./Routes/refreshTokenRouter";
import { entities } from "./Entities";
import { Context } from "./Context/Context";
import path from "path";


export const MysqlDataSource = new DataSource({
  type: "mysql",
  port: 3306,
  connectTimeout: 24 * 3600,
  acquireTimeout: 60 * 60 * 1000,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false,
  synchronize: true,
  entities: [...entities],
});

const main = async () => {
  MysqlDataSource.initialize()
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });

  const app = express();
  app.use(express.static(path.resolve(__dirname, "../../client/dist")));

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/refresh_token", refreshTokenRouter);

  const httpServer = createServer(app);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      //import multiple resolvers
      resolvers: [`${__dirname}/Resolvers/*.{ts,js}`],
    }),
    cache: "bounded",
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground,
    ],
    context: ({ req, res }): Context => <Context>({
      req,
      res,
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: [
        "https://studio.apollographql.com",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://192.168.100.30:5173",
        "http://192.168.100.30:5174",
        "http://110.235.252.175:5173",
        "http://110.235.252.175:5174",
      ],
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
