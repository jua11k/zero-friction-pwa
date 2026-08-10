import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { businessTypes } from "./business_types";
import { transactionTypeEnum } from "./enums";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessTypeId: uuid("business_type_id")
    .notNull()
    .references(() => businessTypes.id, { onDelete: "cascade" }),
  description: varchar("description", { length: 255 }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
