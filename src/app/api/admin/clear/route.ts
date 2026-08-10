import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema/transactions";

export async function GET() {
  try {
    await db.delete(transactions);
    return NextResponse.json({ success: true, message: "All transactions deleted." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
