# GMGP Butcher Shop - Premium eCommerce Experience 🥩 Desert Premium Butcher

Welcome to the official repository for the **GMGP Butcher Shop**, a modern, high-performance eCommerce platform dedicated to providing the finest cuts of meat to the Perth market.

## 🚀 Key Features

### 🛒 Advanced Shopping Experience
- **Interactive Shop**: Fast filtering by category (Beef, Lamb, Chicken, etc.) via URL parameters.
- **Product Profiles**: Visual sliders for meat attributes like leanness, firmness, and richness.
- **Featured & Best Sellers**: Easily identify premium and popular cuts.
- **Dynamic Shipping**: Automated calculation for Perth ($100) vs. Outside Perth ($200) shipping fees.

### 🤖 Smart AI Assistant
- **Multilingual Support**: Interactive live chat responding in English and Roman Urdu.
- **Product Guidance**: Suggests optimal cuts based on cooking styles (e.g., Biryani, Karahi, BBQ).
- **Automated Support**: Instant answers for delivery, quality, and ordering queries.

### 📄 Order & Account Management
- **PDF Invoices**: Downloadable, print-ready invoices available immediately after purchase.
- **Customer Ratings**: 5-star interactive rating system on the success page.
- **Self-Service Dashboard**: Users can track orders, update profiles, and cancel/delete orders with a mandatory reason popup.
- **Perth Localization**: Suburb selection and integrated Google Maps for delivery accuracy.

### 🎥 Visual Excellence
- **Video Backgrounds**: High-quality, looping YouTube Shorts on category cards for a premium feel.
- **Mobile Optimized**: Fully responsive design using Tailwind CSS.

---

## 🔐 Security & Backend Architecture

### 🛡️ Administrative Protection
- **Service Role Bypass**: Sensitive database operations (Product Management, Order Updates) are handled via Next.js Server Actions using the `SUPABASE_SERVICE_ROLE_KEY`. This ensures absolute security by bypassing standard client-side Row Level Security (RLS) while remaining strictly server-side.
- **Secure Auth**: Integration with Supabase Auth for user identity and profile management.

### 📦 Database Infrastructure (Supabase)
- **RLS Policies**: Standard select/read operations are protected by RLS, ensuring users only see their own data.
- **Schema**: Robust relational schema covering Categories, Products, Profiles, Orders, and Order Items.
- **Email Service**: Automated triggers for Order Confirmation and Cancellation emails.

---

## 👑 Admin Portal Features

Accessible only by users with the `is_admin` flag in their profile:
- **Product Management**: Create, edit, and delete products. Set featured status and badges.
- **Dashboard Stats**: Real-time sales data, order counts, and revenue tracking.
- **Order Control**: View and update fulfillment status across all customer orders.
- **Category Control**: Manage categories and visibility.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15+](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
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
