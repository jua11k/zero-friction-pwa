import dotenv from "dotenv";
dotenv.config();

import { db } from "./src/db/index";
import { transactions } from "./src/db/schema/transactions";
import { categories } from "./src/db/schema/categories";
import { eq, desc } from "drizzle-orm";

async function run() {
  try {
    const data = await db.select({
      id: transactions.id,
      tenantId: transactions.tenantId,
      type: transactions.type,
      amount: transactions.amount,
      description: transactions.description,
      categoryId: transactions.categoryId,
      status: transactions.status,
      createdAt: transactions.createdAt,
      categoryName: categories.description
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .orderBy(desc(transactions.createdAt))
    .limit(1);
    
    console.log(data);
    
    if (data.length > 0) {
       console.log("createdAt is instance of Date?", data[0].createdAt instanceof Date);
    }
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

run();
