import { pgTable, uuid, varchar, decimal, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { customers } from "./customers";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const debtStatusEnum = pgEnum("debt_status", ["PENDING", "PAID"]);

export const debts = pgTable("debts", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: varchar("description", { length: 200 }),
  status: debtStatusEnum("status").default("PENDING").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return [
    index("debt_tenant_created_idx").on(table.tenantId, table.createdAt),
    index("debt_customer_idx").on(table.customerId)
  ];
});

export const insertDebtSchema = createInsertSchema(debts, {
  amount: z.coerce.number().positive("El monto debe ser positivo"),
  description: z.string().trim().max(200).optional(),
});
