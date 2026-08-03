import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

async function migrateAuth() {
  try {
    console.log("Adding email column to tenants...");
    await sql`ALTER TABLE tenants ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;`;
    console.log("Migration auth successful.");
  } catch (error) {
    console.error("Migration auth error:", error);
  } finally {
    await sql.end();
  }
}

migrateAuth();
