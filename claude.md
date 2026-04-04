# GMGP Premium Meats - Project Documentation

## Project Overview
GMGP is a full-stack, E-Commerce web application built to sell premium meats (Wagyu, Angus, Halal-certified). It was designed with a highly dynamic frontend, utilizing modern web frameworks and a Supabase backend to manage products, carts, reviews, and tracking. 

The site features a seamless checkout system, a robust Admin Control Panel, dynamic Mega Menus, and a public order tracking interface.

---

## Technical Stack
- **Frontend Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (for Global Cart & UI State)
- **Backend & Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: `lucide-react` & `react-icons`

---

## Core Features & Architecture

### 1. Dynamic Public Frontend
- **Mega Menu Navigation**: Fully driven by the Database. Admins can assign visually distinct icons (via `Header Menu Builder`) and custom colors to specific categories to dictate what appears in the navigation.
- **Product Listings & Filters**: The Shop page filters items by Categories (e.g., Beef, Chicken) and Tags (e.g., `best-seller`, `special`).
- **Product Detail Pages (PDP)**: Includes advanced meta-data metrics for meat such as Leanness, Firmness, and Richness scales. Includes options for varying `Weight Options` per product.
- **Dynamic Content Sections**: Features Homepage Hero Sliders, Before/After Image Sliders, and Review Carousels.

### 2. Cart & Checkout Flow
- **Zustand Cart Drawer**: A global, sliding drawer that updates seamlessly. 
- **Checkout Process**: Collects user address snapshots and passes them to Supabase. Calculates Dynamic Shipping based on predefined zones (and Free Delivery thresholds configured in Site Settings).
- **Coupon System**: Users can apply fixed or percentage-based discount codes globally handled by Supabase RPC.
- **Guest vs Authenticated Orders**: Users can checkout as guests or registered members. Order data securely links to authenticated profiles if logged in. 

### 3. Order Tracking System
- **Public `Track Order` Module**: Guests and Customers can track their order through a custom timeline UI.
- **Short ID Tracking**: The system is designed to use friendly, 8-character "Short IDs" (e.g., `#E1D80003`) by parsing and resolving them into their target UUIDs.
- **Visual Timelines**: Maps to 5 core statuses: `Pending` ➔ `Confirmed` ➔ `Preparing` ➔ `Delivered` (or `Cancelled`).

### 4. Admin Control Panel (Secure Area)
- **Role-Based Access Control (RBAC)**: Only profiles flagged as `role: "admin"` or `role: "super_admin"` in the Supabase DB can access the `/admin` routes.
- **Product Management**: Full CRUD operations with rich-text descriptions, multiple image uploads, stock toggles, and multi-weight pricing options.
- **Category & Header Builder**: A dedicated UI to manage the "Shop Meta" and explicitly push categories to the public Header Mega Menu.
- **Order Management & Status**: Admins can update statuses in real-time, triggering timeline updates for public order tracking.
- **Site Settings**: Controls Delivery Fees and Free Shipping Thresholds programmatically.
- **Review Moderation**: Admins can oversee customer reviews and choose their visibility.

---

## Supabase Database Schema Overview

The Supabase PostgreSQL database serves as the source of truth, enforcing relationships using Foreign Keys.

1. **`profiles`**: Stores customer and admin data (`full_name`, `role`, `address`, `is_member`). Linked strictly to Supabase Auth (`auth.users`).
2. **`categories`**: Stores structural shop collections (`name`, `slug`, `image_url` containing JSON metadata for Icons/Header visibility).
3. **`products`**: Connected to categories. High-density table tracking `price`, `badge`, `in_stock`, `weight_options` (JSON), and visual traits (`leanness_rating` etc).
4. **`orders` & `order_items`**: Maintains a snapshot of the transaction. `orders` contains `delivery_date`, `status`, `address_snapshot` (JSON). `order_items` links specific products and weights to the parent order.
5. **`coupons`**: Discount logic tracking `discount_type`, `discount_value`, `min_order_amount`, and `used_count`.
6. **`site_settings`**: Global configuration layer overriding frontend constants (e.g., `free_threshold`).
7. **`product_reviews`**: Links customer comments and star ratings to individual products.

---

## Important Commands

- **Development Server**: `npm run dev`
- **Production Build**: `npm run build`
- **Linting**: `npm run lint`

## Future Extensibility Notes
- **Email/SMS Integrations**: Hooks are physically planned across checkout/order status changes. To enable them, connect API providers (e.g., SendGrid/Twilio) inside `src/lib/email-service.ts`.
- **Payment Gateway**: Currently, checkout logic processes through standard Cart components. A gateway like Stripe can be dropped in using Next.js Server Components.
