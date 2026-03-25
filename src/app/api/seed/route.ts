import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/lib/products';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const supabase = supabaseAdmin();
    let logs = [];
    const catIdMap: Record<string, string> = {}; // Maps 'beef' -> UUID
    
    // 1. Seed Categories
    for (const cat of MOCK_CATEGORIES) {
      // Check if it exists by slug
      const { data: existing } = await supabase.from('categories').select('id').eq('slug', cat.slug).single();
      
      let newId = existing?.id;
      if (!newId) {
        newId = randomUUID();
        const { error } = await supabase.from('categories').insert({
          id: newId,
          name: cat.name,
          slug: cat.slug,
          image_url: cat.image_url,
          sort_order: cat.sort_order
        });
        if (error) return NextResponse.json({ success: false, error: "Category Error: " + error.message });
      }
      catIdMap[cat.id] = newId;
    }
    
    // 2. Seed Products
    for (const prod of MOCK_PRODUCTS) {
      const { data: existing } = await supabase.from('products').select('id').eq('slug', prod.slug).single();
      
      if (!existing) {
        const newId = randomUUID();
        const { error } = await supabase.from('products').insert({
          id: newId,
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          category_id: catIdMap[prod.category_id], // use the mapped UUID!
          price: prod.price,
          compare_at_price: prod.compare_at_price || null,
          image_url: prod.image_url,
          images: prod.images || [],
          badge: prod.badge || null,
          badge_color: prod.badge_color || null,
          in_stock: prod.in_stock,
          is_featured: prod.is_featured,
          is_best_seller: prod.is_best_seller,
          tags: prod.tags || [],
          weight_options: prod.weight_options || [],
          leanness_rating: prod.leanness_rating || null,
          firmness_rating: prod.firmness_rating || null,
          richness_rating: prod.richness_rating || null
        });
        if (error) return NextResponse.json({ success: false, error: "Product Error: " + error.message });
      }
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully with UUIDs!" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
