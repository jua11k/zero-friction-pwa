"use server";

import { db } from "@/db";
import { tenants } from "@/db/schema/tenants";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/../auth";
import { getOrCreateTenant } from "@/lib/auth-helpers";

export async function setupTenantProfile(name: string, businessTypeId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("No estás autenticado");
  }

  // Get tenant id to be secure
  const tenantId = await getOrCreateTenant(session.user.email);

  if (!name || name.trim() === "") {
    throw new Error("El nombre del negocio es obligatorio.");
  }

  if (!businessTypeId) {
    throw new Error("El tipo de negocio es obligatorio.");
  }

  await db.update(tenants)
    .set({
      name: name.trim(),
      businessTypeId: businessTypeId,
      updatedAt: new Date(),
    })
    .where(eq(tenants.id, tenantId));

  redirect("/");
}
