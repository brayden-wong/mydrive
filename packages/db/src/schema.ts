import { relations, sql } from "drizzle-orm";
import { index, pgTable } from "drizzle-orm/pg-core";
import { char, text, timestamp, varchar } from "drizzle-orm/pg-core/columns";
import { nanoid } from "nanoid";

const ID_LENGTH = 16;

export const profile = pgTable(
  "profile",
  {
    id: char("id", { length: ID_LENGTH })
      .primaryKey()
      .$defaultFn(() => nanoid(ID_LENGTH)),
    userId: char("user_id", { length: ID_LENGTH })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    primaryEmail: text("primary_email").notNull().unique(),
    secondaryEmail: text("secondary_email").unique(),
    avatar: text("avatar"),
  },
  (t) => ({
    index: index("email_index").on(t.primaryEmail, t.secondaryEmail),
  })
);

export const sessions = pgTable("sessions", {
  id: char("id", { length: ID_LENGTH })
    .primaryKey()
    .$defaultFn(() => nanoid(ID_LENGTH)),
  userId: char("user_id", { length: ID_LENGTH })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const users = pgTable(
  "users",
  {
    id: char("id", { length: ID_LENGTH })
      .primaryKey()
      .$defaultFn(() => nanoid(ID_LENGTH)),
    username: varchar("username", { length: 24 }).notNull().unique(),
    password: text("password").notNull(),

    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => ({
    index: index("username_index").on(t.username),
  })
);

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const userRelations = relations(users, ({ one, many }) => ({
  profile: one(profile, {
    fields: [users.id],
    references: [profile.userId],
  }),
  session: one(sessions, {
    fields: [users.id],
    references: [sessions.userId],
  }),
}));
