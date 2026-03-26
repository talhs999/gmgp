"use server";
import { supabase, supabaseAdmin } from "./supabase";
import { Product, Category, Order, Profile } from "./types";
import { sendOrderConfirmationEmail, sendOrderCancellationEmail } from "./email-service";

// ─── PRODUCTS ────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });
  if (error) { console.error("getProducts:", error); return []; }
  return (data as Product[]) ?? [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*, category:categories(*)")
    .or("is_featured.eq.true,is_best_seller.eq.true")
    .order("created_at", { ascending: false })
    .limit(12);
  if (error) { console.error("getFeaturedProducts:", error); return []; }
  return (data as Product[]) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) { console.error("getProductBySlug:", error); return null; }
  return data as Product | null;
}

export async function getRelatedProducts(categoryId: string, excludeId: string): Promise<Product[]> {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*, category:categories(*)")
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .limit(4);
  if (error) { console.error("getRelatedProducts:", error); return []; }
  return (data as Product[]) ?? [];
}

export async function createProduct(product: Omit<Product, "id" | "created_at" | "category">): Promise<Product | null> {
  console.log("createProduct Payload:", product);
  const { data, error } = await supabaseAdmin().from("products")
    .insert(product)
    .select()
    .single();
  if (error) { 
    console.error("createProduct Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    }); 
    return null; 
  }
  return data as Product;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<boolean> {
  console.log("updateProduct ID:", id, "Payload:", product);
  const { error } = await supabaseAdmin().from("products")
    .update(product)
    .eq("id", id);
  if (error) { 
    console.error("updateProduct Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    return false; 
  }
  return true;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin().from("products")
    .delete()
    .eq("id", id);
  if (error) { console.error("deleteProduct:", error); return false; }
  return true;
}

// ─── CATEGORIES ──────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabaseAdmin().from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) { console.error("getCategories:", error); return []; }
  return (data as Category[]) ?? [];
}

export async function createCategory(category: Omit<Category, "id">): Promise<Category | null> {
  const { data, error } = await supabaseAdmin().from("categories")
    .insert(category)
    .select()
    .single();
  if (error) { console.error("createCategory:", error); return null; }
  return data as Category;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin().from("categories").delete().eq("id", id);
  if (error) { console.error("deleteCategory:", error); return false; }
  return true;
}

// ─── ORDERS ──────────────────────────────────────────────────

export interface OrderItemInput {
  product_id: string;
  quantity: number;
  unit_price: number;
  weight_option: string | null;
}

export interface AddressInput {
  full_name: string;
  email?: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  phone: string;
}

export async function createOrder(
  userId: string,
  total: number,
  items: OrderItemInput[],
  address: AddressInput
): Promise<Order | null> {
  const { data: order, error: orderError } = await supabaseAdmin().from("orders")
    .insert({
      user_id: userId,
      total,
      address_snapshot: address,
      status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("createOrder:", orderError);
    return null;
  }

  const orderItems = items.map((item) => ({
    ...item,
    order_id: order.id,
  }));

  const { error: itemsError } = await supabaseAdmin().from("order_items").insert(orderItems);
  if (itemsError) {
    console.error("createOrderItems:", itemsError);
    return null;
  }

  // Send Confirmation Email
  await sendOrderConfirmationEmail(order.id, address.email || "guest@example.com", total);

  return order as Order;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabaseAdmin().from("orders")
    .select("*, order_items(*, product:products(name, image_url, slug))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) { console.error("getUserOrders:", error); return []; }
  return (data as Order[]) ?? [];
}

export async function getAllOrders(): Promise<(Order & { profile?: { full_name: string } })[]> {
  const client = supabaseAdmin();
  const { data, error } = await client
    .from("orders")
    .select("*, order_items(*), profile:profiles(full_name)")
    .order("created_at", { ascending: false });
  if (error) { console.error("getAllOrders:", error); return []; }
  return (data as (Order & { profile?: { full_name: string } })[]) ?? [];
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<boolean> {
  try {
    const { data: order } = await supabaseAdmin()
      .from("orders")
      .select("*, profile:profiles(email), address_snapshot")
      .eq("id", id)
      .single();

    const { error } = await supabaseAdmin().from("orders").update({ status }).eq("id", id);
    if (error) {
      console.error("updateOrderStatus Error:", error);
      return false;
    }

    if (status === "cancelled") {
      const email = order?.profile?.email || order?.address_snapshot?.email;
      if (email) {
        await sendOrderCancellationEmail(id, email);
      }
    }
    
    return true;
  } catch (err) {
    console.error("updateOrderStatus Catch:", err);
    return false;
  }
}

// ─── PROFILES ────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabaseAdmin().from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) { console.error("getProfile:", error); return null; }
  return data as Profile | null;
}

export async function updateProfile(userId: string, profile: Partial<Profile>): Promise<boolean> {
  const { error } = await supabaseAdmin().from("profiles")
    .update(profile)
    .eq("id", userId);
  if (error) { console.error("updateProfile:", error); return false; }
  return true;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const client = supabaseAdmin();
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("getAllProfiles:", error); return []; }
  return (data as Profile[]) ?? [];
}

// ─── ADMIN STATS ─────────────────────────────────────────────

export async function getAdminStats() {
  const client = supabaseAdmin();
  const [products, orders, profiles] = await Promise.all([
    client.from("products").select("id", { count: "exact", head: true }),
    client.from("orders").select("id,total,created_at"),
    client.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  const totalRevenue = (orders.data ?? []).reduce((sum: number, o: { total: number }) => sum + Number(o.total), 0);
  const todayOrders = (orders.data ?? []).filter((o: { created_at: string }) => {
    const d = new Date(o.created_at);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
  });

  return {
    productCount: products.count ?? 0,
    orderCount: orders.data?.length ?? 0,
    totalRevenue,
    userCount: profiles.count ?? 0,
    todayOrderCount: todayOrders.length,
    todayRevenue: todayOrders.reduce((sum: number, o: { total: number }) => sum + Number(o.total), 0),
  };
}

export async function cancelOrder(orderId: string, reason?: string): Promise<boolean> {
  try {
    const { data: order } = await supabaseAdmin()
      .from("orders")
      .select("*, profile:profiles(email), address_snapshot")
      .eq("id", orderId)
      .single();

    // Try to update with reason first
    const { error } = await supabaseAdmin()
      .from("orders")
      .update({ 
        status: "cancelled",
        cancellation_reason: reason || "User cancelled"
      })
      .eq("id", orderId);
      
    if (error) {
      console.warn("cancelOrder full update failed, retrying with status only:", error);
      // Fallback for missing column
      const { error: error2 } = await supabaseAdmin()
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", orderId);
      
      if (error2) {
        console.error("cancelOrder Fallback Error:", error2);
        return false;
      }
    }
    
    // Trigger cancellation email
    const email = order?.profile?.email || order?.address_snapshot?.email;
    if (email) {
      await sendOrderCancellationEmail(orderId, email);
    }
    
    return true;
  } catch (err) {
    console.error("cancelOrder Catch:", err);
    return false;
  }
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    // First delete order items (foreign key constraint)
    await supabaseAdmin()
      .from("order_items")
      .delete()
      .eq("order_id", orderId);

    // Then delete the order
    const { error } = await supabaseAdmin()
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) {
      console.error("deleteOrder Error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("deleteOrder Catch:", err);
    return false;
  }
}

export async function saveOrderRating(
  orderId: string, 
  rating: number, 
  comment?: string
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin()
      .from("orders")
      .update({ 
        rating,
        rating_comment: comment 
      })
      .eq("id", orderId);

    if (error) {
      console.error("saveOrderRating Error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("saveOrderRating Catch:", err);
    return false;
  }
}
