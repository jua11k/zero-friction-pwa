"use server";

import { db } from "@/db";
import { debts, insertDebtSchema } from "@/db/schema/debts";
import { revalidatePath } from "next/cache";

export async function createDebtAction(formData: FormData) {
  try {
    const MOCK_TENANT_ID = "00000000-0000-0000-0000-000000000000";

    const payload = {
      amount: formData.get("amount"),
      debtorName: formData.get("debtorName"),
      description: formData.get("description"),
      tenantId: MOCK_TENANT_ID,
    };

    const validatedData = insertDebtSchema.parse(payload);

    await db.insert(debts).values({
      tenantId: validatedData.tenantId as string,
      debtorName: validatedData.debtorName as string,
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
