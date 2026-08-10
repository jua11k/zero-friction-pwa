import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

async function migrate() {
  try {
    console.log("Applying manual DDL for onboarding...");
    
    await sql`
      CREATE TABLE IF NOT EXISTS business_types (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL,
          description TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      ALTER TABLE tenants ADD COLUMN IF NOT EXISTS business_type_id UUID REFERENCES business_types(id);
    `;

    // Seed data
    await sql`
      INSERT INTO business_types (name, description) VALUES 
      ('Restaurante', 'Restaurante, Cafetería, Bar'),
      ('Tienda', 'Tienda de ropa, Bodega, Supermercado'),
      ('Servicios', 'Peluquería, Taller, Consultoría')
      ON CONFLICT DO NOTHING;
    `;

    console.log("Migration and Seed successful.");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await sql.end();
  }
}

migrate();
