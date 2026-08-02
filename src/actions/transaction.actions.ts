"use server";

import { insertTransactionSchema } from "@/db/schema/transactions";
import { TransactionService } from "@/services/transaction.service";

export async function createTransactionAction(formData: FormData) {
  try {
    // Regla 04: Aislamiento Tenant (mocked temporal para MVP sin auth)
    const MOCK_TENANT_ID = "00000000-0000-0000-0000-000000000000";

    const payload = {
      amount: formData.get("amount"),
      description: formData.get("description"),
      type: formData.get("type"),
      tenantId: MOCK_TENANT_ID,
    };

    // Validación Zod
    const validatedData = insertTransactionSchema.parse(payload);

    // Llamado al servicio
    const tx = await TransactionService.create(validatedData);

    return { success: true, data: tx };
  } catch (error: any) {
    console.error("[Action Error]:", error);
    return { success: false, error: error.message || "Error de validación" };
  }
}
