// Product & Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  category?: Category;
  price: number;
  compare_at_price: number | null;
  image_url: string;
  images: string[];
  badge: string | null;
  badge_color: "red" | "green" | "grey" | null;
  in_stock: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  tags: string[];
  weight_options: WeightOption[] | null;
  leanness_rating: number | null;
  firmness_rating: number | null;
  richness_rating: number | null;
  created_at: string;
}

export interface WeightOption {
  label: string;
  price: number;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  weight_option?: WeightOption;
}

// Order Types
export interface Order {
  id: string;
  user_id: string | null;
  status: "pending" | "confirmed" | "preparing" | "delivered" | "cancelled";
  total: number;
  delivery_date: string | null;
  address_snapshot: AddressSnapshot | null;
  created_at: string;
  order_items?: OrderItem[];
  cancellation_reason?: string | null;
  rating?: number | null;
  rating_comment?: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  unit_price: number;
  weight_option: string | null;
}

// Profile Types
export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  is_member: boolean;
  is_admin: boolean;
  referral_code: string | null;
  created_at: string;
}

export interface AddressSnapshot {
  full_name: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  phone: string;
}
// Site Settings Types
export interface SiteSettings {
  id: string;
  perth_fee: number;
  outside_fee: number;
  free_threshold: number;
  updated_at: string;
}
