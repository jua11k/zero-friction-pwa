import dotenv from "dotenv";
dotenv.config();
import { db } from "./src/db/index";
import { transactions } from "./src/db/schema/transactions";

async function clearTransactions() {
  console.log("Deleteting all transactions...");
  await db.delete(transactions);
  console.log("All transactions deleted.");
  process.exit(0);
}

clearTransactions().catch(console.error);
