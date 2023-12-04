import { db } from "@mydrive/db";
import { Elysia } from "elysia";

const database = new Elysia({ name: "database service" }).decorate("db", db);

export { database };
