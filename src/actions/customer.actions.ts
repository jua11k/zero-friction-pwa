"use server";

import { db } from "@/db";
import { customers } from "@/db/schema/customers";
import { eq, and } from "drizzle-orm";

const MOCK_TENANT_ID = "00000000-0000-0000-0000-000000000000";

export async function searchCustomerByPhone(phone: string) {
  try {
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) return { success: false, data: null };

    const customer = await db.query.customers.findFirst({
      where: and(
        eq(customers.tenantId, MOCK_TENANT_ID),
        eq(customers.phone, trimmedPhone)
      ),
    });

    return { success: true, data: customer || null };
  } catch (error) {
    console.error("Error searching customer:", error);
    return { success: false, data: null };
  }
}
