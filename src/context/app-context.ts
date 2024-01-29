import jwt, { type JWTOption } from "@elysiajs/jwt";
import { PrismaClient } from "@prisma/client";
import { Elysia } from "elysia";

export type AppContext = {
  database: PrismaClient;
  jwtConfig: JWTOption;
};

export function createAppContext(): AppContext {
  return {
    database: new PrismaClient(),
    jwtConfig: {
      name: "jwt",
      secret: btoa("OLOQUINHOMEUESSAFERAAIBICHO"),
    },
  };
}

export function routeConfig(appContext: AppContext) {
  return new Elysia()
    .decorate("appContext", appContext)
    .use(jwt(appContext.jwtConfig));
}
