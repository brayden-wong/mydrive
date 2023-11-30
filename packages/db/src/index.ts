import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "dotenv";
import * as schema from "./schema";

config({ path: "../.env" });

export const db = drizzle(postgres(process.env.DATABASE_URL, { max: 1 }), {
  schema,
});

export { schema };
