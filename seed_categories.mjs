import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

async function migrateAndSeed() {
  try {
    console.log("Applying manual DDL for categories...");
    
    // Create categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          business_type_id UUID NOT NULL REFERENCES business_types(id) ON DELETE CASCADE,
          description VARCHAR(255) NOT NULL,
          type transaction_type NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    // Modify transactions table
    await sql`
      ALTER TABLE transactions DROP COLUMN IF EXISTS ai_category;
    `;
    
    await sql`
      ALTER TABLE transactions ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id);
    `;

    console.log("DDL applied successfully. Starting Seed...");

    // Find the business types inserted previously
    let businesses = await sql`SELECT id, name FROM business_types`;
    
    let negocioId = businesses.find(b => b.name === 'Negocio de barrio')?.id;
    let emprendimientoId = businesses.find(b => b.name === 'Emprendimiento')?.id;

    if (!negocioId || !emprendimientoId) {
       await sql`
        INSERT INTO business_types (name, description) VALUES 
        ('Negocio de barrio', 'Tienda - Estanquillo - Miscelanea'),
        ('Emprendimiento', 'Ventas online - Revistas');
      `;
      businesses = await sql`SELECT id, name FROM business_types`;
      negocioId = businesses.find(b => b.name === 'Negocio de barrio')?.id;
      emprendimientoId = businesses.find(b => b.name === 'Emprendimiento')?.id;
    }

    if (!negocioId || !emprendimientoId) {
       throw new Error("Business types not found even after insert attempt.");
    }

    // Seed Categories
    const incomeCategories = [
      'Bebidas (bebidas sin licor)', 'Medicamentos', 'Licores y Cigarrería', 'Papelería',
      'Aseo y cuidado personal', 'Hogar', 'Aseo hogar', 'Dulces y mecato', 'Panadería',
      'Lacteos y embutidos', 'Refrigerados', 'Abarrotes', 'Mascotas', 'Servicios',
      'Maquillaje, accesorios y bizutería', 'Regalos y detalles', 'Jugetería', 'Ropa',
      'Otros', 'Ferretería básica', 'Frutas y verduras'
    ];

    const expenseCategories = [
      'Pago de servicios', 'Pago de proveedores', 'Transporte', 'Publicidad', 'Mantenimiento'
    ];

    // Build values array for batch insert
    const insertData = [];

    // For Negocio de barrio
    incomeCategories.forEach(cat => {
      insertData.push({ business_type_id: negocioId, description: cat, type: 'INCOME' });
    });
    expenseCategories.forEach(cat => {
      insertData.push({ business_type_id: negocioId, description: cat, type: 'EXPENSE' });
    });

    // For Emprendimiento (duplicated)
    incomeCategories.forEach(cat => {
      insertData.push({ business_type_id: emprendimientoId, description: cat, type: 'INCOME' });
    });
    expenseCategories.forEach(cat => {
      insertData.push({ business_type_id: emprendimientoId, description: cat, type: 'EXPENSE' });
    });

    // We can just use multiple inserts or sql`...` 
    // To keep it simple and idempotent, let's delete existing categories for these types first
    await sql`DELETE FROM categories WHERE business_type_id IN (${negocioId}, ${emprendimientoId})`;

    for (const data of insertData) {
      await sql`
        INSERT INTO categories (business_type_id, description, type) 
        VALUES (${data.business_type_id}, ${data.description}, ${data.type})
      `;
    }

    console.log("Migration and Seed successful.");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await sql.end();
  }
}

migrateAndSeed();
