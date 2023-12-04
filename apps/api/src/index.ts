import { env } from "./env";
import { UsersController } from "./routes";
import { AuthController } from "./routes/auth";
import { errors } from "./utils/errors";

import cors from "@elysiajs/cors";
import { Elysia } from "elysia";

const api = new Elysia()
  .use(cors())
  .use(errors)
  .use(AuthController)
  .use(UsersController)
  .get("/status", () => ({ status: "ok" }))
  .listen(env.PORT, () =>
    console.log(`Server running on 127.0.0.1:${env.PORT}`),
  );

for (const route of api.routes) {
  console.log(route.method, route.path);
}

export type Api = typeof api;
