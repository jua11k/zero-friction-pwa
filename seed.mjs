import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

async function seed() {
  try {
    console.log("Seeding mock tenant...");
    await sql`
      INSERT INTO tenants (id, name, slug)
      VALUES ('00000000-0000-0000-0000-000000000000', 'Mock Tenant MVP', 'mock-tenant-mvp')
      ON CONFLICT (id) DO NOTHING;
    `;
    console.log("Mock tenant seeded successfully.");
  } catch (error) {
    console.error("Error seeding:", error);
  } finally {
    await sql.end();
  }
}

seed();
