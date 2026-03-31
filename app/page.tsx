import Image from 'next/image'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import { ArrowRight } from 'lucide-react'

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

async function getNewProducts() {
  return prisma.product.findMany({
    where: { isPublished: true },
    take: 4,
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

export default async function HomePage() {
  const [featuredProducts, newProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getNewProducts(),
    getCategories(),
  ])

  return (
    <div className="flex flex-col bg-[#f5f0eb]">

      {/* ======= HERO — full bleed, text bottom-left like Vela ======= */}
      <section className="relative w-full h-[90vh] min-h-[560px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
          alt="Judigoods new collection"
          fill
          className="object-cover object-center"
          priority
        />
        {/* subtle dark gradient bottom-left */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Text bottom-left like Vela */}
        <div className="absolute bottom-12 left-10 text-white max-w-sm">
          <p className="text-xs tracking-[0.3em] uppercase mb-3 opacity-80">New Collection 2026</p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-5 uppercase tracking-wide">
            Wear Your<br />Story
          </h1>
          <Link
            href="/products"
            className="inline-block border border-white text-white text-xs tracking-widest uppercase px-7 py-3 hover:bg-white hover:text-black transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* ======= CATEGORY TILES ======= */}
      <section className="py-14">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden bg-[#ece8e2]"
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="text-[11px] font-semibold tracking-widest uppercase">{cat.name}</p>
                  <p className="text-[10px] opacity-70 mt-0.5">{cat._count.products} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======= NEW IN ======= */}
      <section className="py-10">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-7">
            <h2 className="section-heading">New In</h2>
            <Link href="/products?tag=new-arrival" className="text-[11px] tracking-widest uppercase text-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newProducts.map((product) => (
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
        </div>
      </section>

      {/* ======= FULL-WIDTH BANNER ======= */}
      <section className="my-10 relative w-full h-[55vh] min-h-[320px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1400&q=80"
          alt="Judigoods lifestyle"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35 flex items-center justify-center text-white text-center px-6">
          <div>
            <p className="text-xs tracking-[0.35em] uppercase mb-3 opacity-80">Ethically Made</p>
            <h2 className="text-3xl md:text-4xl font-semibold uppercase tracking-wide mb-6 max-w-md mx-auto leading-tight">
              Made with Care.<br />Worn with Pride.
            </h2>
            <Link
              href="/products"
              className="inline-block border border-white text-white text-xs tracking-widest uppercase px-7 py-3 hover:bg-white hover:text-black transition-colors"
            >
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>

      {/* ======= FEATURED PRODUCTS ======= */}
      <section className="py-10">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-7">
            <h2 className="section-heading">Featured</h2>
            <Link href="/products?featured=true" className="text-[11px] tracking-widest uppercase text-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
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
        </div>
      </section>

      {/* ======= OUR COMMUNITY / VALUES ======= */}
      <section className="py-16 bg-white mt-10">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <p className="text-[11px] tracking-[0.35em] uppercase text-primary mb-4">Our Promise</p>
          <h2 className="text-2xl font-semibold uppercase tracking-widest mb-5">
            Curated with Intention
          </h2>
          <p className="text-sm text-foreground/60 leading-relaxed mb-8">
            At Judigoods, we believe community and purpose are more than words. Every piece we carry
            is chosen because it&apos;s made with care — ethically sourced, beautifully crafted, and
            worthy of your wardrobe.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-8 border-t border-[#e0d8cf] pt-8">
            {[
              { title: 'Ethically Sourced', sub: 'Every product is selected with care' },
              { title: 'Authentic Goods', sub: 'Real products from real makers' },
              { title: 'Community First', sub: 'We give back with every order' },
            ].map(({ title, sub }) => (
              <div key={title}>
                <p className="text-[11px] font-semibold tracking-widest uppercase mb-1">{title}</p>
                <p className="text-[11px] text-foreground/50">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= NEWSLETTER ======= */}
      <section className="py-16 bg-[#01603a] text-white text-center">
        <div className="container-custom max-w-md mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase opacity-70 mb-3">Stay Connected</p>
          <h2 className="text-2xl font-semibold uppercase tracking-widest mb-6">Join the Community</h2>
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
