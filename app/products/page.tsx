import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'

interface Props {
  searchParams: {
    category?: string
    sale?: string
    tag?: string
    featured?: string
    search?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }
}

async function getProducts(searchParams: Props['searchParams']) {
  const page     = parseInt(searchParams.page ?? '1')
  const limit    = 12
  const category = searchParams.category
  const tag      = searchParams.tag
  const sale     = searchParams.sale === 'true'
  const featured = searchParams.featured === 'true'
  const search   = searchParams.search
  const sort     = searchParams.sort ?? 'createdAt_desc'
  const minPrice = parseFloat(searchParams.minPrice ?? '0')
  const maxPrice = parseFloat(searchParams.maxPrice ?? '9999')

  const [sortField, sortDir] = sort.split('_')
  const orderBy: any =
    sortField === 'price' ? { price: sortDir as 'asc' | 'desc' } :
    sortField === 'name'  ? { name: sortDir as 'asc' | 'desc' } :
    { createdAt: 'desc' }

  const where = {
    isPublished: true,
    ...(sale     && { isOnSale: true }),
    ...(featured && { isFeatured: true }),
    ...(category && { category: { slug: category } }),
    ...(tag      && { tags: { has: tag } }),
    ...(search   && { OR: [
      { name: { contains: search, mode: 'insensitive' as const } },
      { description: { contains: search, mode: 'insensitive' as const } },
    ]}),
    price: { gte: minPrice, lte: maxPrice },
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where, take: limit, skip: (page - 1) * limit, orderBy,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, slug: true } },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  return { products, total, categories, page, pages: Math.ceil(total / limit) }
}

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest' },
  { value: 'price_asc',      label: 'Price: Low to High' },
  { value: 'price_desc',     label: 'Price: High to Low' },
  { value: 'name_asc',       label: 'A–Z' },
]

export default async function ProductsPage({ searchParams }: Props) {
  const { products, total, categories, page, pages } = await getProducts(searchParams)

  const title =
    searchParams.sale === 'true'    ? 'Sale Items' :
    searchParams.tag === 'new-arrival' ? 'New Arrivals' :
    searchParams.featured === 'true' ? 'Featured Products' :
    searchParams.search ? `Results for "${searchParams.search}"` :
    searchParams.category
      ? (categories.find(c => c.slug === searchParams.category)?.name ?? 'Products')
      : 'All Products'

  return (
    <div className="container-custom py-8 md:py-12">
      <div className="mb-8">
        <h1 className="section-heading mb-1">{title}</h1>
        <p className="text-sm text-muted-foreground">{total} products</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ---- SIDEBAR FILTERS ---- */}
        <aside className="w-full lg:w-56 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">Categories</h3>
              <div className="space-y-1">
                <Link
                  href="/products"
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${!searchParams.category ? 'bg-primary text-white font-medium' : 'hover:bg-accent'}`}
                >
                  All Categories
                </Link>
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${searchParams.category === cat.slug ? 'bg-primary text-white font-medium' : 'hover:bg-accent'}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">Shop</h3>
              <div className="space-y-1">
                <Link href="/products?sale=true" className={`block rounded-lg px-3 py-2 text-sm transition-colors ${searchParams.sale === 'true' ? 'bg-red-500 text-white font-medium' : 'hover:bg-accent text-red-600 font-medium'}`}>
                  🔥 Sale Items
                </Link>
                <Link href="/products?tag=new-arrival" className={`block rounded-lg px-3 py-2 text-sm transition-colors ${searchParams.tag === 'new-arrival' ? 'bg-primary text-white font-medium' : 'hover:bg-accent'}`}>
                  ✨ New Arrivals
                </Link>
                <Link href="/products?featured=true" className={`block rounded-lg px-3 py-2 text-sm transition-colors ${searchParams.featured === 'true' ? 'bg-primary text-white font-medium' : 'hover:bg-accent'}`}>
                  ⭐ Featured
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* ---- PRODUCT GRID ---- */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-border">
            <p className="text-sm text-muted-foreground">{total} results</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort:</span>
              <div className="relative">
                <select
                  className="appearance-none text-sm border border-input rounded-md pl-3 pr-8 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  defaultValue={searchParams.sort ?? 'createdAt_desc'}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="py-24 text-center text-muted-foreground">
              <SlidersHorizontal className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm">Try adjusting your filters or <Link href="/products" className="text-primary hover:underline">browse all products</Link>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-5">
              {products.map(product => {
                const avgRating = product.reviews.length
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
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {page > 1 && (
                <Link href={`/products?${new URLSearchParams({ ...searchParams, page: String(page - 1) })}`}
                  className="btn-secondary px-4 py-2 text-sm">← Prev</Link>
              )}
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <Link key={p}
                  href={`/products?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${p === page ? 'bg-primary text-white' : 'border border-input hover:bg-accent'}`}>
                  {p}
                </Link>
              ))}
              {page < pages && (
                <Link href={`/products?${new URLSearchParams({ ...searchParams, page: String(page + 1) })}`}
                  className="btn-secondary px-4 py-2 text-sm">Next →</Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
