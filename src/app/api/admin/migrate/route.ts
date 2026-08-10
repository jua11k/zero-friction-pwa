import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS analytics_filters_idx ON transactions(tenant_id, type, category_id, created_at);`);
    return NextResponse.json({ success: true, message: "Index created." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
