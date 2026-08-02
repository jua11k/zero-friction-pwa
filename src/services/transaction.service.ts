import { transactions } from "@/db/schema/transactions";
import { db } from "@/db";

export class TransactionService {
  static async create(data: typeof transactions.$inferInsert) {
    // Inserción real en base de datos PostgreSQL
    const [tx] = await db.insert(transactions).values({
      ...data, 
      status: "PENDING_AI"
    }).returning();

    // FASE 4: Integración IA Asíncrona (Fire-and-Forget) - Regla 06
    if (process.env.N8N_AI_WEBHOOK_URL) {
      fetch(process.env.N8N_AI_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: tx.tenantId,
          transaction_id: tx.id,
          type: tx.type,
          amount: tx.amount,
          description: tx.description
        }),
      }).catch(err => console.error("Webhook Error:", err)); // Asíncrono puro sin await
    }

    return tx;
  }
}
