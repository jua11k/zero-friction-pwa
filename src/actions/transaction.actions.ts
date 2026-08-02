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

    // Fire-and-Forget Webhook n8n (No awaited)
    const webhookUrl = process.env.N8N_AI_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: tx.id,
          tenant_id: tx.tenantId,
          description: tx.description,
          amount: tx.amount,
          type: tx.type
        })
      }).catch(err => console.error("Webhook error (Ignorado):", err));
    }

    revalidatePath("/");
    revalidatePath("/reportes");

    return { success: true, data: tx };
  } catch (error: any) {
    console.error("[Action Error]:", error);
    return { success: false, error: error.message || "Error de validación" };
  }
}
