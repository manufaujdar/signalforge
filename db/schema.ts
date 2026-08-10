import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const evaluations = sqliteTable("evaluations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // Nullable only to quarantine pre-auth prototype rows during migration. The
  // application always writes an authenticated owner and never reads null rows.
  ownerId: text("owner_id"),
  platform: text("platform").notNull(),
  content: text("content").notNull(),
  score: integer("score").notNull(),
  risk: integer("risk").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
