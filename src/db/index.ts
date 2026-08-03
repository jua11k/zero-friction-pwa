import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as tenantsSchema from './schema/tenants';
import * as transactionsSchema from './schema/transactions';
import * as customersSchema from './schema/customers';
import * as debtsSchema from './schema/debts';

const connectionString = process.env.DATABASE_URL || "";

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { 
  schema: { 
    ...tenantsSchema, 
    ...transactionsSchema, 
    ...customersSchema, 
    ...debtsSchema 
  } 
});
