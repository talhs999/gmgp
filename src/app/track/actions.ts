"use server";
import { supabaseAdmin } from "@/lib/supabase";
import { Order } from "@/lib/types";

// Public lightweight tracking method that DOES NOT leak sensitive email or internal user details unnecessarily
export async function trackPublicOrder(orderId: string): Promise<{ 
  success: boolean; 
  order?: { id: string; status: Order["status"]; total: number; delivery_date: string | null; created_at: string };
  error?: string;
}> {
  try {
    const cleanId = orderId.replace(/^#/, "").trim().toLowerCase();

    if (!cleanId) {
      return { success: false, error: "Please enter a valid Order ID." };
    }

    // If it's a full UUID
    if (cleanId.length === 36) {
      const { data } = await supabaseAdmin()
        .from("orders")
        .select("id, status, total, delivery_date, created_at")
        .eq("id", cleanId)
        .maybeSingle();
      
      if (data) return { success: true, order: data };
    }

    // Otherwise, treat as Short ID (e.g. first 8 chars)
    // For small/medium shops, we can fetch recent orders and filter in JS
    const { data, error } = await supabaseAdmin()
      .from("orders")
      .select("id, status, total, delivery_date, created_at")
      .order("created_at", { ascending: false })
      .limit(3000);

    if (error || !data) {
      return { success: false, error: "Order not found." };
    }

    const order = data.find((o) => o.id.toLowerCase().startsWith(cleanId));

    if (!order) {
      return { success: false, error: `Order #${orderId.toUpperCase()} not found. Please check your ID and try again.` };
    }

    return {
      success: true,
      order: order
    };
  } catch (error) {
    console.error("trackPublicOrder error:", error);
    return { success: false, error: "An error occurred while tracking. Please try again later." };
  }
}
