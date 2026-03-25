import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../src/lib/products';

async function run() {
  const client = new Client({
    host: 'db.kahgvzzjftncetyufomc.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'pak12345!@#$T',
    ssl: { rejectUnauthorized: false } // Required for Supabase
  });
  
  await client.connect();
  console.log("Connected to Supabase Postgres.");

  try {
    // 1. Run schema.sql
    const schemaSql = fs.readFileSync(path.join(process.cwd(), 'supabase', 'schema.sql'), 'utf-8');
    console.log("Executing schema.sql...");
    await client.query(schemaSql);
    console.log("Schema applied successfully.");

    // 2. Seed Categories
    console.log("Seeding categories...");
    for (const cat of MOCK_CATEGORIES) {
      const res = await client.query('SELECT id FROM categories WHERE id = $1', [cat.id]);
      if (res.rowCount === 0) {
        await client.query(
          `INSERT INTO categories (id, name, slug, image_url, sort_order) VALUES ($1, $2, $3, $4, $5)`,
          [cat.id, cat.name, cat.slug, cat.image_url, cat.sort_order]
        );
      }
    }

    // 3. Seed Products
    console.log("Seeding products...");
    for (const prod of MOCK_PRODUCTS) {
      const res = await client.query('SELECT id FROM products WHERE id = $1', [prod.id]);
      if (res.rowCount === 0) {
        await client.query(
          `INSERT INTO products (
            id, name, slug, description, category_id, price, compare_at_price, image_url, images,
            badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options,
            leanness_rating, firmness_rating, richness_rating
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            $10, $11, $12, $13, $14, $15, $16,
            $17, $18, $19
          )`,
          [
            prod.id, prod.name, prod.slug, prod.description, prod.category_id, prod.price, prod.compare_at_price || null, prod.image_url, prod.images || [],
            prod.badge || null, prod.badge_color || null, prod.in_stock, prod.is_featured, prod.is_best_seller, prod.tags || [], JSON.stringify(prod.weight_options || []),
            prod.leanness_rating || null, prod.firmness_rating || null, prod.richness_rating || null
          ]
        );
      }
    }

    console.log("Database setup and seed completed successfully! 🎉");
  } catch (err) {
    console.error("Error setting up DB:", err);
  } finally {
    await client.end();
  }
}

run();
