import { pgTable, uuid, varchar, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return [
    uniqueIndex("customer_tenant_phone_idx").on(table.tenantId, table.phone)
  ];
});

export const insertCustomerSchema = createInsertSchema(customers, {
  name: z.string().trim().min(1, "El nombre es requerido"),
  phone: z.string().trim().min(5, "Número inválido"),
});
