import { database } from "../services/database";
import { jwt } from "../services/jwt";
import { NotFoundError, UnauthorizedError } from "../utils/errors";
import { response } from "../utils/response";

import { schema } from "@mydrive/db";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";

const users = schema.users;

const models = new Elysia({ name: "user_models" }).model({
  user: t.Object({}),
});

const UsersController = new Elysia({ prefix: "/users" })
  .use(models)
  .use(database)
  .use(jwt)
  .guard(
    {
      beforeHandle: async ({ verify, headers }) => {
        const token = headers["authorization"]?.split(" ")[1];

        if (!token) throw new UnauthorizedError("No token provided");

        const isVerified = await verify({ token, type: "access" });

        if (!isVerified) throw new UnauthorizedError("Invalid token");
      },
    },
    (app) =>
      app
        .get("/me", async ({ headers, db, decode }) => {
          const { id } = await decode({
            token: headers["authorization"]!.split(" ")[1],
            type: "access",
          });

          const user = await db.query.users.findFirst({
            columns: {
              id: true,
              username: true,
            },
            with: {
              profile: {
                columns: {
                  id: true,
                  avatar: true,
                  name: true,
                },
              },
            },
            where: eq(users.id, id),
          });

          if (!user) throw new NotFoundError("User not found");

          return response({ user });
        })
        .get("/data", async ({ headers, db, decode }) => {
          const { id } = await decode({
            token: headers["authorization"]!.split(" ")[1],
            type: "access",
          });

          const user = await db.query.users.findFirst({
            columns: {
              id: true,
              username: true,
            },
            with: {
              profile: true,
            },
            where: eq(users.id, id),
          });

          if (!user) throw new NotFoundError("User not found");

          return response({ user });
        }),
  );

export { UsersController };
