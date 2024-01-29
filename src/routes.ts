import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { routeConfig, createAppContext } from "./context/app-context";
import { LoginPayload, UserRegistrationPayload } from "./types/user.types";
import { UserController } from "./controllers/user-controller";
import { AuthService } from "./services/auth-service";

const appContext = createAppContext();

const publicRoutes = new Elysia()
  .use(routeConfig(appContext))
  .post(
    "/register",
    async ({ body, jwt, cookie: { auth }, appContext }) => {
      return UserController.register(appContext, body, jwt, auth);
    },
    {
      body: UserRegistrationPayload,
    }
  )
  .post(
    "/login",
    async ({ body, set, jwt, cookie: { auth } }) => {
      return UserController.login(appContext, body, jwt, set, auth);
    },
    {
      body: LoginPayload,
    }
  );

const protectedRoutes = new Elysia().use(routeConfig(appContext)).guard(
  {
    beforeHandle: async ({ cookie: { auth }, jwt, set }) => {
      try {
        await AuthService.validateToken(auth, jwt);
      } catch (error) {
        set.status = 401;
        return {
          message: error,
        };
      }
    },
  },
  (app) => {
    return app
      .resolve(async ({ jwt, cookie: { auth } }) => {
        const token = await AuthService.validateToken(auth, jwt);
        return {
          userId: token.id as string,
        };
      })
      .get("/me", UserController.getUserInformation);
  }
);

export const app = new Elysia().use(publicRoutes).use(protectedRoutes);
export type App = typeof app;
