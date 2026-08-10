import { db } from "@/db";
import { tenants } from "@/db/schema/tenants";
import { eq } from "drizzle-orm";

export async function getOrCreateTenant(email: string | null | undefined): Promise<string> {
  if (!email) {
    throw new Error("No hay email en la sesión");
  }

  // Buscar tenant por email
  const existingTenant = await db.query.tenants.findFirst({
    where: eq(tenants.email, email),
  });

  if (existingTenant) {
    return existingTenant.id;
  }

  // Crear si no existe
  const [newTenant] = await db.insert(tenants).values({
    name: "",
    slug: crypto.randomUUID(), // El slug es obligatorio en tu BD
    email: email,
  }).returning();

  return newTenant.id;
}

export async function getTenantProfile(email: string | null | undefined) {
  if (!email) return null;
  const existingTenant = await db.query.tenants.findFirst({
    where: eq(tenants.email, email),
  });
  return existingTenant || null;
}
