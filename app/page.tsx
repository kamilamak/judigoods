import Image from 'next/image'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import { ArrowRight, Truck, RotateCcw, Shield, Leaf } from 'lucide-react'

// ---- FETCH DATA ----
async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true, isPublished: true },
    take: 8,
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: { select: { name: true, slug: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

async function getCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    include: { _count: { select: { products: true } } },
    take: 5,
  })
}

// ---- PAGE ----
export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <div className="flex flex-col">
      {/* ============ HERO ============ */}
      <section className="relative h-[85vh] min-h-[560px] flex items-center overflow-hidden bg-brand-950">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
          alt="Judigoods hero – woman in elegant scarf"
          fill
          className="object-cover object-center opacity-40"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-950/60 to-transparent" />

        {/* Content */}
        <div className="container-custom relative z-10 max-w-2xl">
          <p className="mb-4 text-brand-300 text-sm font-medium tracking-[0.2em] uppercase">
            New Collection – Spring 2026
          </p>
          <h1 className="font-display text-5xl font-bold text-white leading-tight md:text-6xl lg:text-7xl">
            Wear Your
            <br />
            <span className="text-brand-400">Story</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-md">
            Curated clothing, handmade scarves, artisan home décor, and lifestyle goods — ethically sourced, beautifully made.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/products" className="btn-primary text-base px-8 py-4">
              Shop Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/products?category=scarves-wraps" className="btn-secondary text-base px-8 py-4 border-white/30 text-white hover:bg-white/10">
              Scarves & Wraps
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TRUST BADGES ============ */}
      <section className="border-y border-border bg-secondary/50 py-6">
        <div className="container-custom grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Truck, label: 'Free Shipping', sub: 'Orders over $75' },
            { icon: RotateCcw, label: 'Free Returns', sub: 'Within 30 days' },
            { icon: Shield, label: 'Secure Checkout', sub: 'SSL + Stripe' },
            { icon: Leaf, label: 'Ethically Made', sub: 'Sustainably sourced' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 justify-center text-center md:justify-start md:text-left">
              <div className="flex-shrink-0 rounded-full bg-primary/10 p-2">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SHOP BY CATEGORY ============ */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">Browse</p>
              <h2 className="section-heading">Shop by Category</h2>
            </div>
            <Link href="/products" className="hidden text-sm font-medium text-primary hover:underline md:flex items-center gap-1">
              All Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative h-52 overflow-hidden rounded-2xl bg-muted"
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-base font-semibold text-white">{cat.name}</p>
                  <p className="text-xs text-gray-300 mt-0.5">{cat._count.products} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="py-16 bg-secondary/30 md:py-24">
        <div className="container-custom">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">Handpicked</p>
              <h2 className="section-heading">Featured Products</h2>
            </div>
            <Link href="/products?featured=true" className="hidden text-sm font-medium text-primary hover:underline md:flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
            {featuredProducts.map((product) => {
              const avgRating =
                product.reviews.length > 0
                  ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
                  : null
              return (
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
                  avgRating={avgRating}
                  reviewCount={product.reviews.length}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ BRAND STORY BANNER ============ */}
      <section className="py-20 md:py-32">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 md:h-[500px] rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800"
                alt="Artisan crafting a scarf"
                fill
                className="object-cover"
              />
            </div>
            <div className="max-w-md">
              <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">Our Story</p>
              <h2 className="font-display text-4xl font-bold text-foreground leading-tight mb-6">
                Made with Care.<br />Worn with Pride.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Judigoods was born from a love of beautiful, purposeful things. We partner with artisans and ethical makers from around the world to bring you pieces that carry a story.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Every scarf, every garment, every home piece — chosen because it&apos;s made with intention, built to last, and worthy of your space.
              </p>
              <Link href="/about" className="btn-primary">
                Learn Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section className="bg-brand-950 py-16 text-white">
        <div className="container-custom text-center max-w-xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-4">Join the Judigoods Community</h2>
          <p className="text-brand-300 mb-8">
            Get early access to new arrivals, exclusive offers, and styling inspiration delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded-md bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-xs text-brand-400">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  )
}
