import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema/transactions";
import { categories } from "@/db/schema/categories";
import { tenants } from "@/db/schema/tenants";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    // Básica validación de seguridad (puedes agregar un API KEY si lo deseas)
    const apiKey = req.headers.get("x-api-key");
    // if (apiKey !== process.env.N8N_API_KEY) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { transaction_id, category_description, tenant_id } = body;

    if (!transaction_id || !category_description || !tenant_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Obtener el businessTypeId del tenant
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, tenant_id)
    });

    if (!tenant || !tenant.businessTypeId) {
      return NextResponse.json({ error: "Tenant or BusinessType not found" }, { status: 404 });
    }

    // 2. Buscar la categoría que haga match con la descripción y el tipo de negocio
    const category = await db.query.categories.findFirst({
      where: and(
        eq(categories.businessTypeId, tenant.businessTypeId),
        eq(categories.description, category_description)
      )
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found for this description" }, { status: 404 });
    }

    // 3. Actualizar la transacción
    await db.update(transactions)
      .set({
        categoryId: category.id,
        status: "CATEGORIZED"
      })
      .where(eq(transactions.id, transaction_id));

    return NextResponse.json({ success: true, category_id: category.id });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
