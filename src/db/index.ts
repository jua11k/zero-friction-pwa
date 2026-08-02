import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || "";

// Configuración del cliente con prepare: false para mayor compatibilidad con poolers
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client);
