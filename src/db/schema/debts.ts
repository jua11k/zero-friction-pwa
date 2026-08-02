import { pgTable, uuid, varchar, decimal, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const debtStatusEnum = pgEnum("debt_status", ["PENDING", "PAID"]);

export const debts = pgTable("debts", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  debtorName: varchar("debtor_name", { length: 100 }).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: varchar("description", { length: 200 }),
  status: debtStatusEnum("status").default("PENDING").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return [
    index("debt_tenant_created_idx").on(table.tenantId, table.createdAt)
  ];
});

export const insertDebtSchema = createInsertSchema(debts, {
  debtorName: z.string().trim().min(1, "El nombre es requerido"),
  amount: z.coerce.number().positive("El monto debe ser positivo"),
  description: z.string().trim().max(200).optional(),
});
