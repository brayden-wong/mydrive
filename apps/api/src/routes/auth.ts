import { database } from "../services/database";
import { jwt } from "../services/jwt";
import { BadRequestError, UnauthorizedError, errors } from "../utils/errors";
import { response } from "../utils/response";

import { schema } from "@mydrive/db";
import { password as bunPassword } from "bun";
import { and, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

const users = schema.users;
const profiles = schema.profile;
const sessions = schema.sessions;

const models = new Elysia({ name: "models" }).model({
  sign_in: t.Object({
    username: t.String({
      pattern: "^[a-zA-Z0-9_.-]*$",
      error: "Invalid username",
    }),
    password: t.String({
      minLength: 8,
      error: "Password must be 8 or more characters",
    }),
  }),
  sign_up: t.Object({
    name: t.String({ minLength: 3, pattern: "[a-zA-Z]" }),
    email: t.String({ format: "email", error: "Invalid email format" }),
    username: t.String({
      pattern: "^[a-zA-Z0-9_.-]*$",
      error: "Invalid username",
    }),
    password: t.String({
      minLength: 8,
      error: "Password must be 8 or more characters",
    }),
  }),
  verify: t.Object({
    accessToken: t.String({ minLength: 1 }),
    refreshToken: t.String({ minLength: 1 }),
  }),
  refreshTokens: t.Object({
    refreshToken: t.String({ minLength: 1 }),
  }),
});

const AuthController = new Elysia({ prefix: "/auth" })
  .use(errors)
  .use(database)
  .use(jwt)
  .use(models)
  .post(
    "/login",
    async ({ body, db, generateTokens }) => {
      const { username, password } = body;

      const result = await db.transaction(async (tx) => {
        const user = await tx.query.users.findFirst({
          where: eq(users.username, username),
        });

        if (!user) return "User not found";

        const { accessToken, refreshToken } = await generateTokens({
          id: user.id,
        });

        const session = await tx.query.sessions.findFirst({
          where: eq(sessions.userId, user.id),
        });

        if (!(await bunPassword.verify(password, user.password)))
          return "Invalid Credentails";

        if (!session) {
          await db.insert(sessions).values({
            userId: user.id,
            refreshToken: await bunPassword.hash(refreshToken),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          });

          return { accessToken, refreshToken };
        }

        await tx.update(sessions).set({
          refreshToken: await bunPassword.hash(refreshToken),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        });

        return { accessToken, refreshToken };
      });

      if (result === "User not found") throw new BadRequestError(result);

      if (result === "Invalid Credentails") throw new UnauthorizedError(result);

      return response(result);
    },
    {
      body: "sign_in",
    },
  )
  .post(
    "/register",
    async ({ body, db }) => {
      const { password, username, name, email } = body;

      const result = await db.transaction(async (tx) => {
        const user = await tx.query.users.findFirst({
          where: eq(users.username, username),
        });

        if (user) return "User already exists";

        const hashedPassword = await bunPassword.hash(password);

        const [newUser] = await tx
          .insert(users)
          .values({
            username,
            password: hashedPassword,
          })
          .returning({ id: users.id });

        await tx.insert(profiles).values({
          userId: newUser.id,
          name,
          primaryEmail: email,
        });

        return { id: newUser.id };
      });

      if (typeof result === "string") throw new BadRequestError(result);

      return response({ id: result.id });
    },
    {
      body: "sign_up",
      transform: ({ body }) => void { email: body.email.toLowerCase() },
    },
  )
  .post(
    "/verify",
    async ({ body, verify }) => {
      const { accessToken, refreshToken } = body;

      const verifyAccessToken = await verify({
        token: accessToken,
        type: "access",
      });

      if (!verifyAccessToken) throw new UnauthorizedError("Invalid Token");

      const verifyRefreshToken = await verify({
        token: refreshToken,
        type: "refresh",
      });

      if (!verifyRefreshToken) throw new UnauthorizedError("Invalid Token");

      return response({ message: "verifed tokens" });
    },
    { body: "verify" },
  )
  .post(
    "/refresh",
    async ({ body, headers, db, decode, generateTokens }) => {
      const { id } = await decode({
        token: headers["authorization"]!.split(" ")[1],
        type: "access",
      });
      const { refreshToken } = body;

      const result = await db.transaction(async (tx) => {
        const [session] = await tx
          .select()
          .from(sessions)
          .where(eq(sessions.userId, id));

        if (!session) return "Session not found";

        const { refreshToken: hashedRefreshToken } = session;

        if (!(await bunPassword.verify(refreshToken, hashedRefreshToken)))
          return "Not Authorized";

        const { accessToken, refreshToken: newRefreshToken } =
          await generateTokens({ id });

        const newHash = await bunPassword.hash(newRefreshToken);

        await tx
          .update(sessions)
          .set({ refreshToken: newHash })
          .where(eq(users.id, id));

        return { accessToken, refreshToken: newRefreshToken };
      });

      switch (typeof result) {
        case "object":
          return response(result);
        case "string":
          throw new UnauthorizedError("Not Authorized");
        default:
          throw new BadRequestError("Something went wrong");
      }
    },
    { body: "refreshTokens" },
  );

export { AuthController };
