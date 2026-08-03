import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

async function migrateCustomers() {
  try {
    console.log("Applying manual DDL for customers and debts...");

    await sql`
      CREATE TABLE IF NOT EXISTS customers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
          name VARCHAR(100) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS customer_tenant_phone_idx ON customers(tenant_id, phone);
    `;

    // Drop the old debts table to recreate it with the foreign key
    await sql`DROP TABLE IF EXISTS debts CASCADE;`;

    await sql`
      CREATE TABLE IF NOT EXISTS debts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
          customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
          amount NUMERIC(12, 2) NOT NULL,
          description VARCHAR(200),
          status debt_status NOT NULL DEFAULT 'PENDING',
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS debt_tenant_created_idx ON debts(tenant_id, created_at);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS debt_customer_idx ON debts(customer_id);
    `;

    console.log("Migration successful.");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await sql.end();
  }
}

migrateCustomers();
