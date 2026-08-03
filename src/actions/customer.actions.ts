"use server";

import { db } from "@/db";
import { customers } from "@/db/schema/customers";
import { eq, and } from "drizzle-orm";
import { auth } from "@/../auth";
import { getOrCreateTenant } from "@/lib/auth-helpers";

export async function searchCustomerByPhone(phone: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { success: false, data: null };
    const tenantId = await getOrCreateTenant(session.user.email);

    const trimmedPhone = phone.trim();
    if (!trimmedPhone) return { success: false, data: null };

    const customer = await db.query.customers.findFirst({
      where: and(
        eq(customers.tenantId, tenantId),
        eq(customers.phone, trimmedPhone)
      ),
    });

    return { success: true, data: customer || null };
  } catch (error) {
    console.error("Error searching customer:", error);
    return { success: false, data: null };
  }
}
