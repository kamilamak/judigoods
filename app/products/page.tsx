import { Suspense } from 'react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import { SlidersHorizontal } from 'lucide-react'

interface Props {
  searchParams: {
    category?: string
    sale?: string
    tag?: string
    featured?: string
    search?: string
    sort?: string
    page?: string
  }
}

async function getProducts(searchParams: Props['searchParams']) {
  const page     = parseInt(searchParams.page ?? '1')
  const limit    = 16
  const category = searchParams.category
  const sale     = searchParams.sale === 'true'
  const featured = searchParams.featured === 'true'
  const tag      = searchParams.tag
  const search   = searchParams.search
  const sort     = searchParams.sort ?? 'createdAt_desc'

  const [sortField, sortDir] = sort.split('_')
  const orderBy: any =
    sortField === 'price' ? { price: sortDir as 'asc' | 'desc' } :
    sortField === 'name'  ? { name:  sortDir as 'asc' | 'desc' } :
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
    searchParams.sale === 'true'       ? 'Sale' :
    searchParams.tag === 'new-arrival' ? 'New Arrivals' :
    searchParams.featured === 'true'   ? 'Featured' :
    searchParams.search                ? `"${searchParams.search}"` :
    searchParams.category
      ? (categories.find(c => c.slug === searchParams.category)?.name ?? 'Products')
      : 'All Products'

  return (
    <div className="bg-[#f5f0eb] min-h-screen">
      {/* Page Header */}
      <div className="container-custom pt-10 pb-6 border-b border-[#e0d8cf]">
        <h1 className="text-3xl font-semibold tracking-widest uppercase text-foreground">
          {title}
        </h1>
      </div>

      {/* Filter/Sort bar — just like Vela */}
      <div className="container-custom py-4 flex items-center justify-between border-b border-[#e0d8cf]">
        {/* Category filter pills */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/products"
            className={`text-[10px] tracking-widest uppercase font-medium py-1.5 px-3 border transition-colors ${
              !searchParams.category && !searchParams.sale && !searchParams.featured
                ? 'border-foreground bg-foreground text-white'
                : 'border-[#c8c0b8] text-foreground/60 hover:border-foreground hover:text-foreground'
            }`}
          >
            All
          </Link>
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`text-[10px] tracking-widest uppercase font-medium py-1.5 px-3 border transition-colors ${
                searchParams.category === cat.slug
                  ? 'border-foreground bg-foreground text-white'
                  : 'border-[#c8c0b8] text-foreground/60 hover:border-foreground hover:text-foreground'
              }`}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/products?sale=true"
            className={`text-[10px] tracking-widest uppercase font-medium py-1.5 px-3 border transition-colors ${
              searchParams.sale === 'true'
                ? 'border-primary bg-primary text-white'
                : 'border-[#c8c0b8] text-primary/80 hover:border-primary hover:text-primary'
            }`}
          >
            Sale
          </Link>
        </div>

        {/* Sort + count */}
        <div className="flex items-center gap-4">
          <span className="text-[10px] tracking-widest uppercase text-foreground/40 hidden md:block">
            {total} Products
          </span>
          <div className="relative">
            <select
              className="appearance-none bg-transparent border border-[#c8c0b8] text-[10px] tracking-widest uppercase pl-3 pr-8 py-1.5 focus:outline-none focus:border-foreground"
              defaultValue={searchParams.sort ?? 'createdAt_desc'}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <SlidersHorizontal className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-foreground/50 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container-custom py-8">
        {products.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-sm tracking-widest uppercase text-foreground/40 mb-4">No products found</p>
            <Link href="/products" className="text-[11px] tracking-widest uppercase underline">
              Clear Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {products.map(product => (
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

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16">
            {page > 1 && (
              <Link
                href={`/products?${new URLSearchParams({ ...searchParams, page: String(page - 1) })}`}
                className="text-[10px] tracking-widest uppercase border border-[#c8c0b8] px-5 py-2.5 hover:bg-foreground hover:text-white hover:border-foreground transition-colors"
              >
                ← Previous
              </Link>
            )}
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <Link
                key={p}
                href={`/products?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
                className={`text-[10px] tracking-widest uppercase border px-4 py-2.5 transition-colors ${
                  p === page
                    ? 'border-foreground bg-foreground text-white'
                    : 'border-[#c8c0b8] hover:bg-foreground hover:text-white hover:border-foreground'
                }`}
              >
                {p}
              </Link>
            ))}
            {page < pages && (
              <Link
                href={`/products?${new URLSearchParams({ ...searchParams, page: String(page + 1) })}`}
                className="text-[10px] tracking-widest uppercase border border-[#c8c0b8] px-5 py-2.5 hover:bg-foreground hover:text-white hover:border-foreground transition-colors"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
