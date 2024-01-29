import { t } from "elysia";

export const UserRegistrationPayload = t.Object({
  email: t.String(),
  password: t.String(),
  name: t.String(),
  profilePictureUrl: t.Optional(t.String()),
});

export type UserRegistrationPayloadType = typeof UserRegistrationPayload["static"];

export const LoginPayload = t.Object({
  email: t.String(),
  password: t.String(),
});

export type LoginPayloadType = typeof LoginPayload["static"];