import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/lib/products';

export async function GET() {
  try {
    const supabase = supabaseAdmin();
    let logs = [];
    
    // 1. Seed Categories
    for (const cat of MOCK_CATEGORIES) {
      const { error } = await supabase.from('categories').upsert({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image_url: cat.image_url,
        sort_order: cat.sort_order
      }, { onConflict: 'id' });
      if (error) {
          logs.push("Category Error: " + error.message);
          return NextResponse.json({ success: false, error: error.message });
      }
    }
    
    // 2. Seed Products
    for (const prod of MOCK_PRODUCTS) {
      const { error } = await supabase.from('products').upsert({
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        category_id: prod.category_id,
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
      }, { onConflict: 'id' });
      if (error) {
         logs.push("Product Error: " + error.message);
         return NextResponse.json({ success: false, error: error.message });
      }
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
