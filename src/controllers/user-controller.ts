import { Cookie, Elysia } from "elysia";
import type { AppContext } from "../context/app-context";
import type {
  LoginPayloadType,
  UserRegistrationPayloadType,
} from "../types/user.types";
import { AuthService } from "../services/auth-service";

export class UserController {
  static async register(
    { database }: AppContext,
    body: UserRegistrationPayloadType,
    jwt: any,
    auth: Cookie<string>
  ) {
    const user = await database.user.create({
      data: body,
      select: {
        id: true,
        name: true,
        email: true,
        profilePictureUrl: true,
      },
    });

    auth.set(await AuthService.getCookieToken(jwt, user));

    return user;
  }

  static async login(
    { database }: AppContext,
    body: LoginPayloadType,
    jwt: any,
    set: any,
    auth: Cookie<string>
  ) {
    try {
      const user = await database.user.findUnique({
        where: {
          email: body.email,
        },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });

      if (!user || !Bun.password.verifySync(body.password, user.password)) {
        throw "Incorrect email/password";
      }

      auth.set(await AuthService.getCookieToken(jwt, user));

      return {
        message: "Authenticated",
      };
    } catch (error) {
      set.status = 404;
      return {
        message: error,
      };
    }
  }

  static async getUserInformation({
    userId,
    appContext: { database },
  }: {
    userId: string;
    appContext: AppContext;
  }) {
    const me = await database.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePictureUrl: true,
      },
    });

    return me;
  }
}
