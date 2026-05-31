import { shield, rule, allow, deny } from "graphql-shield";
import { verify } from "jsonwebtoken";
import { Context } from "./Context/Context";

const isAuthenticated = rule({ cache: "contextual" })(
  (_parent, _args, ctx: Context) => {
    try {
      const authHeader = ctx.req.header("Authorization");
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) return new Error("Not authenticated");
      verify(token, process.env.ACCESS_TOKEN_SECRET as string);
      return true;
    } catch {
      return new Error("Not authenticated");
    }
  }
);

export const permissions = shield(
  {
    Query: {
      "*": isAuthenticated,
    },
    Mutation: {
      "*": isAuthenticated,
      // Public — no token needed
      login: allow,
      logout: allow,
    },
  },
  {
    allowExternalErrors: true,
    fallbackRule: isAuthenticated,
  }
);
