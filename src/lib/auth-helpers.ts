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
    name: `Negocio de ${email.split("@")[0]}`,
    slug: crypto.randomUUID(), // El slug es obligatorio en tu BD
    email: email,
  }).returning();

  return newTenant.id;
}
