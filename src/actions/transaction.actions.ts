"use server";

import { insertTransactionSchema } from "@/db/schema/transactions";
import { TransactionService } from "@/services/transaction.service";
import { revalidatePath } from "next/cache";

export async function createTransactionAction(formData: FormData) {
  try {
    const MOCK_TENANT_ID = "00000000-0000-0000-0000-000000000000";

    const payload = {
      amount: formData.get("amount"),
      description: formData.get("description"),
      type: formData.get("type"),
      tenantId: MOCK_TENANT_ID,
    };

    const validatedData = insertTransactionSchema.parse(payload);

    // Llamado al servicio
    const tx = await TransactionService.create({
      tenantId: validatedData.tenantId as string,
      type: validatedData.type as "INCOME" | "EXPENSE",
      amount: validatedData.amount.toString(),
      description: payload.description as string,
    });



    revalidatePath("/");
    revalidatePath("/reportes");

    return { success: true, data: tx };
  } catch (error: any) {
    console.error("[Action Error]:", error);
    return { success: false, error: error.message || "Error de validación" };
  }
}
