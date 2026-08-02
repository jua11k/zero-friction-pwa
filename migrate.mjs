import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

async function migrate() {
  try {
    console.log("Applying manual DDL for debts...");
    await sql`
      DO $$ BEGIN
          CREATE TYPE debt_status AS ENUM ('PENDING', 'PAID');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS debts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
          debtor_name VARCHAR(100) NOT NULL,
          amount NUMERIC(12, 2) NOT NULL,
          description VARCHAR(200),
          status debt_status NOT NULL DEFAULT 'PENDING',
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS debt_tenant_created_idx ON debts(tenant_id, created_at);
    `;
    console.log("Manual migration successful.");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await sql.end();
  }
}

migrate();
