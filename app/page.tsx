import Link from 'next/link'
import prisma from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import { ArrowRight } from 'lucide-react'

async function getAllProducts() {
  return prisma.product.findMany({
    where: { isPublished: true },
    take: 16,
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

async function getCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    include: { _count: { select: { products: true } } },
    take: 8,
  })
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ])

  return (
    <div className="flex flex-col bg-background min-h-screen">

      {/* ── PAGE HEADER ─────────────────────────────────────────────── */}
      <section className="border-b border-border bg-card">
        <div className="container-custom py-10">
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-2">Welcome to</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-widest uppercase text-foreground mb-3">
            Judigoods
          </h1>
          <p className="text-sm text-foreground/60 max-w-md">
            Ethically sourced goods, curated with intention. Shop our full collection below.
          </p>
        </div>
      </section>

      {/* ── CATEGORY FILTER PILLS ───────────────────────────────────── */}
      <section className="border-b border-border bg-card sticky top-[60px] z-10">
        <div className="container-custom py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Link
            href="/products"
            className="flex-shrink-0 text-[10px] tracking-widest uppercase font-semibold px-4 py-2 border border-foreground bg-foreground text-background transition-colors"
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="flex-shrink-0 text-[10px] tracking-widest uppercase font-medium px-4 py-2 border border-border text-foreground/70 hover:border-foreground hover:text-foreground transition-colors"
            >
              {cat.name}
              <span className="ml-1.5 text-foreground/40">({cat._count.products})</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── MAIN PRODUCT CATALOG GRID ───────────────────────────────── */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-heading">All Products</h2>
            <span className="text-[11px] text-foreground/50 tracking-wider uppercase">
              {products.length} items
            </span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24 text-foreground/40">
              <p className="text-lg tracking-widest uppercase">No products yet</p>
              <p className="text-sm mt-2">Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  compareAt={product.compareAt ?? undefined}
                  image={product.images[0]?.url ?? '/images/placeholder.jpg'}
                  category={product.category.name}
                  isOnSale={product.isOnSale}
                  isFeatured={product.isFeatured}
                  avgRating={null}
                  reviewCount={0}
                />
              ))}
            </div>
          )}

          {products.length >= 16 && (
            <div className="mt-14 text-center">
              <Link href="/products" className="btn-secondary">
                View Full Catalog <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── VALUES STRIP ────────────────────────────────────────────── */}
      <section className="border-t border-border bg-card py-10 mt-4">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { title: 'Ethically Sourced', sub: 'Every product is selected with care' },
              { title: 'Authentic Goods', sub: 'Real products from real makers' },
              { title: 'Community First', sub: 'We give back with every order' },
            ].map(({ title, sub }) => (
              <div key={title}>
                <p className="text-[11px] font-semibold tracking-widest uppercase mb-1 text-foreground">{title}</p>
                <p className="text-[11px] text-foreground/50">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ──────────────────────────────────────────────── */}
      <section className="py-14 bg-[#01603a] text-white text-center">
        <div className="container-custom max-w-md mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase opacity-70 mb-3">Stay Connected</p>
          <h2 className="text-2xl font-semibold uppercase tracking-widest mb-5">Join the Community</h2>
          <p className="text-sm opacity-70 mb-7">Get early access to new arrivals, exclusive offers, and styling inspiration.</p>
          <form className="flex gap-0 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/10 border border-white/30 text-white placeholder:text-white/40 text-sm px-4 py-3 focus:outline-none focus:border-white"
            />
            <button
              type="submit"
              className="bg-white text-[#01603a] text-xs font-semibold tracking-widest uppercase px-6 py-3 hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[10px] opacity-40 mt-4 tracking-wider uppercase">No spam, ever.</p>
        </div>
      </section>

    </div>
  )
}
