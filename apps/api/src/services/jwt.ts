import { env } from "../env";
import { UnauthorizedError } from "../utils/errors";

import { jwt } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";

type DeriveToken = {
  token: string;
  type: "access" | "refresh";
};

const jwtSerivce = new Elysia({ name: "jwt" })
  .use(
    jwt({
      name: "access_token",
      secret: env.ACCESS_TOKEN_SECRET,
      exp: new Date(Date.now() + 15 * 60000).getTime(),
      schema: t.Object({
        id: t.String(),
      }),
    }),
  )
  .use(
    jwt({
      name: "refresh_token",
      secret: env.REFRESH_TOKEN_SECRET,
      exp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).getTime(),
      schema: t.Object({
        id: t.String(),
      }),
    }),
  )
  .derive(({ access_token, refresh_token }) => ({
    generateTokens: async ({ id }: { id: string }) => {
      const [accessToken, refreshToken] = await Promise.all([
        await access_token.sign({ id }),
        await refresh_token.sign({ id }),
      ]);

      return { accessToken, refreshToken };
    },
    verify: async ({ token, type }: DeriveToken) => {
      const result = await (type === "access"
        ? access_token
        : refresh_token
      ).verify(token);

      if (typeof result === "boolean")
        throw new UnauthorizedError("Invalid token");

      const { exp } = result;

      if (!exp) throw new Error("Invalid token");

      if (exp * 1000 < Date.now()) throw new UnauthorizedError("Token expired");

      return true;
    },
    decode: async ({ token, type }: DeriveToken) => {
      const result = await (type === "access"
        ? access_token
        : refresh_token
      ).verify(token);

      if (typeof result === "boolean")
        throw new UnauthorizedError("Invalid token");

      const { id, exp } = result;

      if (!exp) throw new Error("Invalid token");

      if (exp < Date.now()) throw new UnauthorizedError("Token expired");

      return { id };
    },
  }));

export { jwtSerivce as jwt };
