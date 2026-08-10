"use server";

import { db } from "@/db";
import { debts, insertDebtSchema } from "@/db/schema/debts";
import { customers } from "@/db/schema/customers";
import { eq, and } from "drizzle-orm";
import { tenants } from "@/db/schema/tenants";
import { revalidatePath } from "next/cache";
import { auth } from "@/../auth";
import { getOrCreateTenant } from "@/lib/auth-helpers";

export async function createDebtAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("No autenticado");
    const tenantId = await getOrCreateTenant(session.user.email);
    
    const phone = formData.get("phone")?.toString().trim();
    const name = formData.get("name")?.toString().trim();
    const amount = formData.get("amount");
    const description = formData.get("description");

    if (!phone || !name) {
      throw new Error("El celular y el nombre son requeridos");
    }

    // Upsert Customer logic
    let customer = await db.query.customers.findFirst({
      where: and(
        eq(customers.tenantId, tenantId),
        eq(customers.phone, phone)
      ),
    });

    if (!customer) {
      const [newCustomer] = await db.insert(customers).values({
        tenantId: tenantId,
        phone,
        name,
      }).returning();
      customer = newCustomer;
    } else if (customer.name !== name) {
      // Opcional: Actualizar el nombre si cambió
      const [updatedCustomer] = await db.update(customers)
        .set({ name })
        .where(eq(customers.id, customer.id))
        .returning();
      customer = updatedCustomer;
    }

    const payload = {
      amount,
      description,
      tenantId: tenantId,
      customerId: customer.id,
    };

    const validatedData = insertDebtSchema.parse(payload);

    await db.insert(debts).values({
      tenantId: validatedData.tenantId as string,
      customerId: validatedData.customerId as string,
      amount: validatedData.amount.toString(),
      description: validatedData.description as string,
      status: "PENDING",
    });

    revalidatePath("/pendientes");
    return { success: true };
  } catch (error: any) {
    console.error("[Debt Action Error]:", error);
    return { success: false, error: error.message || "Error al registrar pendiente" };
  }
}

import { TransactionService } from "@/services/transaction.service";
import { categories } from "@/db/schema/categories";

export async function markDebtAsPaidAction(debtId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("No autenticado");
    const tenantId = await getOrCreateTenant(session.user.email);

    // Get the debt
    const [debt] = await db.select()
      .from(debts)
      .where(and(
        eq(debts.id, debtId),
        eq(debts.tenantId, tenantId)
      ));

    if (!debt) throw new Error("Deuda no encontrada");
    if (debt.status === "PAID") throw new Error("La deuda ya está pagada");

    // Get the customer manually to avoid relations type error
    const [customer] = await db.select()
      .from(customers)
      .where(eq(customers.id, debt.customerId));

    // Update debt status
    await db.update(debts)
      .set({ status: "PAID" })
      .where(eq(debts.id, debtId));

    // Get tenant business type for categories
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, tenantId)
    });

    let allowedCategories: string[] = [];
    if (tenant?.businessTypeId) {
      const allowedCategoriesRows = await db.select({ description: categories.description })
        .from(categories)
        .where(and(
          eq(categories.businessTypeId, tenant.businessTypeId),
          eq(categories.type, "INCOME")
        ));
      allowedCategories = allowedCategoriesRows.map(row => row.description);
    }

    // Create the income transaction
    await TransactionService.create({
      tenantId: tenantId,
      type: "INCOME",
      amount: debt.amount,
      description: `Pago deuda: ${customer?.name || "Desconocido"} - ${debt.description || "Sin detalle"}`,
    }, allowedCategories);

    revalidatePath("/pendientes");
    revalidatePath("/");
    revalidatePath("/reportes");

    return { success: true };
  } catch (error: any) {
    console.error("[Debt Action Error]:", error);
    return { success: false, error: error.message || "Error al marcar como pagado" };
  }
}

