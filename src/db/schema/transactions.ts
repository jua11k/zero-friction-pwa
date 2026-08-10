import { pgTable, uuid, varchar, decimal, timestamp, index } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { categories } from "./categories";
import { transactionTypeEnum, transactionStatusEnum } from "./enums";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: varchar("description", { length: 50 }).notNull(),
  categoryId: uuid("category_id").references(() => categories.id),
  status: transactionStatusEnum("status").default("PENDING_AI").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return [
    index("tenant_created_idx").on(table.tenantId, table.createdAt)
  ];
});

// Zod Schema overriding
export const insertTransactionSchema = createInsertSchema(transactions, {
  description: z.string().trim().min(1, "La descripción es requerida").max(50, "Máximo 50 caracteres"),
  amount: z.coerce.number().positive("El monto debe ser positivo"),
});
