import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { char, text, timestamp } from "drizzle-orm/pg-core/columns";
import { nanoid } from "nanoid";

const ID_LENGTH = 16;

export const users = pgTable("users", {
  id: char("id", { length: ID_LENGTH })
    .primaryKey()
    .$defaultFn(() => nanoid(ID_LENGTH)),
  name: text("name"),
  email: text("email").unique(),
  password: text("password"),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  deletedAt: timestamp("deleted_at"),
});
