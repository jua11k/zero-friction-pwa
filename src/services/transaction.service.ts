import { transactions } from "@/db/schema/transactions";
import { db } from "@/db";

export class TransactionService {
  static async create(data: typeof transactions.$inferInsert) {
    // Para el MVP mockeamos la respuesta simulando inserción
    // const [tx] = await db.insert(transactions).values({...data, status: "PENDING_AI"}).returning();
    
    const tx = {
      id: crypto.randomUUID(),
      tenantId: data.tenantId,
      type: data.type,
      amount: data.amount,
      description: data.description,
      status: "PENDING_AI"
    };

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
