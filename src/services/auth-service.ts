import type { JWTPayloadSpec } from "@elysiajs/jwt";
import type { User } from "@prisma/client";
import type { Cookie } from "elysia";

export class AuthService {
  static async getCookieToken(jwt: any, user: { id: string, email: string }) {
    return {
      value: await jwt.sign({
        id: user.id,
        email: user.email,
      }),
      httpOnly: true,
      maxAge: 3600,
    };
  }

  static async validateToken(
    auth: Cookie<string>,
    jwt: any
  ): Promise<Record<string, string | number> & JWTPayloadSpec> {
    const token = await jwt.verify(auth.value);

    if (token === false) {
      throw "Invalid token";
    }

    return token;
  }
}
