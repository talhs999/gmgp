# GMGP Butcher Shop - Premium eCommerce Experience 🥩 Desert Premium Butcher

Welcome to the official repository for the **GMGP Butcher Shop**, a modern, high-performance eCommerce platform dedicated to providing the finest cuts of meat to the Perth market.

## 🚀 Key Features

### 🛒 Advanced Shopping Experience
- **Dynamic Weight Options**: Select between different weights (e.g., 500g, 1kg) with real-time price updates in the cart and checkout.
- **Interactive Shop**: Fast filtering by category (Beef, Lamb, Chicken, etc.) via URL parameters.
- **Product Profiles**: Visual sliders for meat attributes like leanness, firmness, and richness.
- **Guest Checkout**: Secure checkout for non-registered users with full order persistence in the database.
- **Dynamic Shipping**: Automated calculation for Perth vs. Outside Perth fees, controlled directly via the Admin Panel.

### 🤖 Smart AI Assistant
- **Multilingual Support**: Interactive live chat responding in English and Roman Urdu.
- **Product Guidance**: Suggests optimal cuts based on cooking styles (e.g., Biryani, Karahi, BBQ).
- **Automated Support**: Instant answers for delivery, quality, and ordering queries.

### 📄 Order & Account Management
- **PDF Invoices**: Downloadable, print-ready invoices available immediately after purchase with accurate "Amount Due" displays.
- **Customer Ratings**: 5-star interactive rating system on the success page.
- **Self-Service Dashboard**: Users can track orders, update profiles, and cancel/delete orders with a mandatory reason popup.
- **Perth Localization**: Suburb selection and integrated Google Maps for delivery accuracy.

### ⚡ Performance & Accessibility
- **Lighthouse Optimized**: Achieved high performance scores through Next.js `<Image />` optimization (Priority loading, WebP compression).
- **Accessibility (WCAG)**: Full ARIA label support for all interactive elements, search overlays, and navigation icons.
- **Mobile Optimized**: Fully responsive, high-end UI design using Tailwind CSS and Framer Motion.

---

## 🔐 Security & Backend Architecture

### 🛡️ Administrative Protection
- **Service Role Bypass**: Sensitive database operations (Product Management, Order Updates) are handled via Next.js Server Actions using the `SUPABASE_SERVICE_ROLE_KEY`.
- **Secure Auth**: Integration with Supabase Auth for user identity and profile management.

### 📦 Database Infrastructure (Supabase)
- **RLS Policies**: Standard select/read operations are protected by RLS, ensuring users only see their own data.
- **Relational Schema**: Robust schema covering Categories, Products, Profiles, Orders, Order Items, and Site Settings.
- **Email Service**: Automated triggers for Order Confirmation and Cancellation emails.

---

## 👑 Admin Portal Features

Accessible only by users with the `is_admin` flag in their profile:
- **Shipping Control**: Manage Perth Delivery Fees, Outside Perth Fees, and Free Delivery Thresholds in real-time.
- **Product Management**: Create, edit, and delete products. Manage weight options and pricing.
- **Dashboard Stats**: Real-time sales data, order counts, and revenue tracking.
- **Order Control**: View and update fulfillment status across all customer orders (including Guest Orders).
- **Category Control**: Manage categories, video cards, and site-wide organization.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15+](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Cart & UI state)
- **Database / Auth**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📖 Development Commands

- **Local Dev**: `npm run dev`
- **Product Build**: `npm run build`
- **Linting**: `npm run lint`

---

*Built with ❤️ for GMGP Butcher Shop.* 🏜️👏🥩
