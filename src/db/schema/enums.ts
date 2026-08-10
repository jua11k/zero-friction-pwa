import { pgEnum } from "drizzle-orm/pg-core";

export const transactionTypeEnum = pgEnum("transaction_type", ["INCOME", "EXPENSE"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["PENDING_AI", "CATEGORIZED"]);
