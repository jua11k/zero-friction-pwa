import { pgTable, uuid, varchar, decimal, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transactionTypeEnum = pgEnum("transaction_type", ["INCOME", "EXPENSE"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["PENDING_AI", "CATEGORIZED"]);

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: varchar("description", { length: 50 }).notNull(),
  aiCategory: varchar("ai_category", { length: 50 }),
  status: transactionStatusEnum("status").default("PENDING_AI").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return [
    index("tenant_created_idx").on(table.tenantId, table.createdAt)
  ];
});

// Zod Schema overriding
export const insertTransactionSchema = createInsertSchema(transactions, {
  description: (schema) => schema.description.trim().min(1, "La descripción es requerida").max(50, "Máximo 50 caracteres"),
  amount: z.coerce.number().positive("El monto debe ser positivo"),
});
