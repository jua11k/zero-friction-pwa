"use server";

import { insertTransactionSchema } from "@/db/schema/transactions";
import { TransactionService } from "@/services/transaction.service";
import { revalidatePath } from "next/cache";
import { auth } from "@/../auth";
import { getOrCreateTenant } from "@/lib/auth-helpers";

export async function createTransactionAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("No autenticado");
    const tenantId = await getOrCreateTenant(session.user.email);

    const payload = {
      amount: formData.get("amount"),
      description: formData.get("description"),
      type: formData.get("type"),
      tenantId: tenantId,
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
