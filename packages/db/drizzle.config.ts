import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config({ path: "./.env" });

export default {
  driver: "pg",
  schema: "./src/schema.ts",
  dbCredentials: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  out: "./.drizzle",
} satisfies Config;
