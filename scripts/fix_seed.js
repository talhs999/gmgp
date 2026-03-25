const fs = require('fs');
const file = 'src/lib/products.ts';
let code = fs.readFileSync(file, 'utf8');

// The original file uses categories like 'beef', 'lamb', etc. Let's map those to valid UUIDs
const catUUIDs = [
  '02abc2ed-1111-4000-8000-000000000001', // beef
  '02b04093-1111-4000-8000-000000000002', // lamb
  '02b24741-1111-4000-8000-000000000003', // pork
  '0c4e1e4c-1111-4000-8000-000000000004', // chicken
  '211e5048-1111-4000-8000-000000000005', // bbq
  '53f2c110-1111-4000-8000-000000000006', // wagyu
  '616c0af7-1111-4000-8000-000000000007', // sausages
  '11e88ccb-1111-4000-8000-000000000008', // burgers
  '0b41986c-1111-4000-8000-000000000009', // marinated
  '531f7055-1111-4000-8000-000000000010', // halal
  '5314e79a-1111-4000-8000-000000000011'  // gifts
];

const catMap = {
  'beef': catUUIDs[0],
  'lamb': catUUIDs[1],
  'pork': catUUIDs[2],
  'chicken': catUUIDs[3],
  'bbq': catUUIDs[4],
  'wagyu': catUUIDs[5],
  'sausages': catUUIDs[6],
  'burgers': catUUIDs[7],
  'marinated': catUUIDs[8],
  'halal': catUUIDs[9],
  'gifts': catUUIDs[10]
};

// We will recreate the seed data manually from the file contents since parsing TS in pure Node is tricky.
const match = code.match(/export const MOCK_PRODUCTS: Product\[\] = (\[[\s\S]*?\]);/);
if (!match) throw new Error('Could not find MOCK_PRODUCTS array');

// Strip out types to allow eval
let arrStr = match[1].replace(/ as Product/g, ''); 

const crypto = require('crypto');
// basic mock environment to evaluate the object
const vm = require('vm');
const context = { };
vm.createContext(context);
vm.runInContext('var products = ' + arrStr, context);
const products = context.products;

const cats = [
  {id: catMap['beef'], name: 'Beef', slug: 'beef', sortOrder: 1},
  {id: catMap['lamb'], name: 'Lamb', slug: 'lamb', sortOrder: 2},
  {id: catMap['pork'], name: 'Pork', slug: 'pork', sortOrder: 3},
  {id: catMap['chicken'], name: 'Chicken', slug: 'chicken', sortOrder: 4},
  {id: catMap['bbq'], name: 'BBQ Packs', slug: 'bbq', sortOrder: 5},
  {id: catMap['wagyu'], name: 'Wagyu', slug: 'wagyu', sortOrder: 6},
  {id: catMap['sausages'], name: 'Sausages', slug: 'sausages', sortOrder: 7},
  {id: catMap['burgers'], name: 'Burgers', slug: 'burgers', sortOrder: 8},
  {id: catMap['marinated'], name: 'Marinated', slug: 'marinated', sortOrder: 9},
  {id: catMap['halal'], name: 'Halal', slug: 'halal', sortOrder: 10},
  {id: catMap['gifts'], name: 'Gift Packs', slug: 'gifts', sortOrder: 11}
];

let outSql = `-- ============================================
-- GMGP Clone - Complete Database Schema & Seed Data
-- ============================================

-- TABLES AND POLICIES
`;

const schemaSql = fs.readFileSync('supabase/schema.sql', 'utf8');
outSql += schemaSql + '\n\n';

outSql += `-- ============================================\n-- Seed Categories\n-- ============================================\n`;
cats.forEach(c => {
  outSql += `INSERT INTO categories (id, name, slug, image_url, sort_order) VALUES ('${c.id}', '${c.name}', '${c.slug}', NULL, ${c.sortOrder}) ON CONFLICT (slug) DO NOTHING;\n`;
});

outSql += `\n-- ============================================\n-- Seed Products\n-- ============================================\n`;

function escapeStr(str) {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

products.forEach(p => {
  const cId = catMap[p.category_id] || catMap['beef']; 
  const pId = crypto.randomUUID();
  
  const arrImgs = p.images && p.images.length ? 
    `ARRAY['${p.images.join("','")}']` : `ARRAY[]::TEXT[]`;
    
  const arrTags = p.tags && p.tags.length ? 
    `ARRAY['${p.tags.join("','")}']` : `ARRAY[]::TEXT[]`;
    
  const wOpts = p.weight_options ? `'${JSON.stringify(p.weight_options)}'::jsonb` : 'NULL';
  
  outSql += `INSERT INTO products (id, name, slug, description, category_id, price, compare_at_price, image_url, images, badge, badge_color, in_stock, is_featured, is_best_seller, tags, weight_options, leanness_rating, firmness_rating, richness_rating)
VALUES ('${pId}', ${escapeStr(p.name)}, ${escapeStr(p.slug)}, ${escapeStr(p.description)}, '${cId}', ${p.price}, ${p.compare_at_price || 'NULL'}, ${escapeStr(p.image_url)}, ${arrImgs}, ${escapeStr(p.badge)}, ${escapeStr(p.badge_color)}, ${p.in_stock}, ${p.is_featured || false}, ${p.is_best_seller || false}, ${arrTags}, ${wOpts}, ${p.leanness_rating || 'NULL'}, ${p.firmness_rating || 'NULL'}, ${p.richness_rating || 'NULL'}) ON CONFLICT (slug) DO NOTHING;\n`;
});

outSql += `\n-- ============================================\n-- Success! Database is ready to go.\n-- ============================================\n`;

fs.writeFileSync('supabase/complete_setup.sql', outSql);
