# Judigoods — Full-Stack E-Commerce Store

> A curated boutique selling clothing, scarves & wraps, home décor, and lifestyle goods. Built with Next.js 14, Prisma, PostgreSQL, Stripe, and Tailwind CSS.

---

## Tech Stack

| Layer       | Technology                             |
|-------------|----------------------------------------|
| Frontend    | Next.js 14 (App Router) + React 18     |
| Styling     | Tailwind CSS + custom design tokens    |
| Database    | PostgreSQL (via Railway or Supabase)   |
| ORM         | Prisma                                 |
| Auth        | NextAuth.js (Email + Google OAuth)     |
| Payments    | Stripe (Checkout Sessions)             |
| Images      | Cloudinary                             |
| State       | Zustand (cart) + Server Components     |
| Fonts       | Inter + Playfair Display (Google)      |
| Deployment  | Vercel (app) + Railway (database)      |

---

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/YOUR-USERNAME/judigoods.git
cd judigoods
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your actual keys
```

### 3. Set up the database
```bash
npx prisma generate        # Generate Prisma client
npx prisma db push         # Push schema to database
npm run prisma:seed        # Seed sample data
```

### 4. Run the development server
```bash
npm run dev
# Open http://localhost:3000
```

### 5. Access admin panel
- URL: `http://localhost:3000/admin`
- Admin login: `admin@judigoods.com` / `admin123!`

---

## Project Structure

```
judigoods/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── products/           # Product listing + detail pages
│   ├── cart/               # Shopping cart page
│   ├── checkout/           # Checkout + success pages
│   ├── auth/               # Login + register pages
│   ├── admin/              # Admin dashboard (protected)
│   └── api/                # API routes (products, checkout, reviews...)
├── components/             # Reusable UI components
│   ├── Navbar.tsx          # Top navigation with cart icon
│   ├── Footer.tsx          # Site footer
│   ├── ProductCard.tsx     # Product card with quick-add
│   ├── CartDrawer.tsx      # Slide-in cart panel
│   └── DarkModeToggle.tsx  # Light/Dark mode toggle
├── hooks/
│   └── useCart.ts          # Zustand cart store (persisted)
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   ├── stripe.ts           # Stripe helpers
│   └── auth.ts             # NextAuth configuration
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Sample data seeding script
└── tailwind.config.ts      # Tailwind + brand colors
```

---

## Features

- ✅ Product listing with filters (category, price range, tags, sale)
- ✅ Product detail pages with variants, reviews, and related products
- ✅ Shopping cart with quantity controls (persisted via localStorage)
- ✅ Slide-in cart drawer with free shipping progress
- ✅ User authentication (email/password + Google OAuth)
- ✅ Stripe checkout integration (test mode)
- ✅ Order tracking and history
- ✅ Product reviews with ratings
- ✅ Admin dashboard (products, orders, customers, low-stock alerts)
- ✅ Dark mode toggle
- ✅ Fully responsive (mobile-first)
- ✅ SEO metadata + OpenGraph

---

## Deployment

### Frontend + API: Vercel
```bash
npm install -g vercel
vercel --prod
# Follow prompts, set environment variables in Vercel dashboard
```

### Database: Railway
1. Create account at railway.app
2. New Project → Add PostgreSQL
3. Copy the DATABASE_URL from Railway
4. Paste into your Vercel environment variables

### Stripe Webhooks (Production)
```bash
stripe listen --forward-to https://yourdomain.com/api/webhooks/stripe
```

---

## Environment Variables Summary

| Variable | Where to get it |
|----------|----------------|
| `DATABASE_URL` | Railway / Supabase dashboard |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → API Keys |
| `CLOUDINARY_*` | Cloudinary Console |
| `GOOGLE_CLIENT_ID/SECRET` | Google Cloud Console |

---

## License

MIT — free to use for personal and commercial projects.
