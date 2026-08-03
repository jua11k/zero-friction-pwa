"use server";

import { db } from "@/db";
import { debts, insertDebtSchema } from "@/db/schema/debts";
import { customers } from "@/db/schema/customers";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createDebtAction(formData: FormData) {
  try {
    const MOCK_TENANT_ID = "00000000-0000-0000-0000-000000000000";
    
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
        eq(customers.tenantId, MOCK_TENANT_ID),
        eq(customers.phone, phone)
      ),
    });

    if (!customer) {
      const [newCustomer] = await db.insert(customers).values({
        tenantId: MOCK_TENANT_ID,
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
      tenantId: MOCK_TENANT_ID,
    };

    const validatedData = insertDebtSchema.parse(payload);

    await db.insert(debts).values({
      tenantId: validatedData.tenantId as string,
      customerId: customer.id,
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

