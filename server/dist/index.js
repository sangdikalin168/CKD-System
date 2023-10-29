"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const apollo_server_express_1 = require("apollo-server-express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const http_1 = require("http");
const apollo_server_core_1 = require("apollo-server-core");
const type_graphql_1 = require("type-graphql");
const refreshTokenRouter_1 = __importDefault(require("./Routes/refreshTokenRouter"));
const Entities_1 = require("./Entities");
const MysqlDataSource = new typeorm_1.DataSource({
    type: "mysql",
    port: 3306,
    connectTimeout: 24 * 3600,
    acquireTimeout: 60 * 60 * 1000,
    host: process.env.NODE_ENV === "development" ? process.env.DEV_SERVER : process.env.PROD_SERVER,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: false,
    synchronize: true,
    entities: [...Entities_1.entities],
});
const main = async () => {
    MysqlDataSource.initialize()
        .then(() => {
        console.log("Database Connected");
    })
        .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });
    const app = (0, express_1.default)();
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use("/refresh_token", refreshTokenRouter_1.default);
    const httpServer = (0, http_1.createServer)(app);
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            validate: false,
            resolvers: [`${__dirname}/Resolvers/*.{ts,js}`],
        }),
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground,
        ],
        context: ({ req, res }) => ({
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
                "http://110.235.249.118:5173",
                "http://110.235.249.118:4000",
            ],
            credentials: true,
        },
    });
    const PORT = process.env.PORT || 4000;
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`SERVER STARTED In ${process.env.NODE_ENV} Mode, And PORT ${PORT}`);
};
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map