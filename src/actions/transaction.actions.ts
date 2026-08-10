"use server";

import { insertTransactionSchema } from "@/db/schema/transactions";
import { TransactionService } from "@/services/transaction.service";
import { revalidatePath } from "next/cache";
import { auth } from "@/../auth";
import { getTenantProfile } from "@/lib/auth-helpers";
import { db } from "@/db";
import { categories } from "@/db/schema/categories";
import { eq, and } from "drizzle-orm";

export async function createTransactionAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("No autenticado");
    const tenant = await getTenantProfile(session.user.email);
    if (!tenant) throw new Error("Tenant no encontrado");

    const payload = {
      amount: formData.get("amount"),
      description: formData.get("description"),
      type: formData.get("type"),
      tenantId: tenant.id,
    };

    const validatedData = insertTransactionSchema.parse(payload);
    
    // Obtener allowed_categories para la IA
    const allowedCategoriesRows = await db.select({ description: categories.description })
      .from(categories)
      .where(and(
        eq(categories.businessTypeId, tenant.businessTypeId as string),
        eq(categories.type, validatedData.type as "INCOME" | "EXPENSE")
      ));
      
    const allowedCategories = allowedCategoriesRows.map(row => row.description);

    // Llamado al servicio
    const tx = await TransactionService.create({
      tenantId: validatedData.tenantId as string,
      type: validatedData.type as "INCOME" | "EXPENSE",
      amount: validatedData.amount.toString(),
      description: payload.description as string,
    }, allowedCategories);

    revalidatePath("/");
    revalidatePath("/reportes");

    return { success: true, data: tx };
  } catch (error: any) {
    console.error("[Action Error]:", error);
    return { success: false, error: error.message || "Error de validación" };
  }
}

