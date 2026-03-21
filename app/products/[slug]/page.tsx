import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import AddToCartButton from '@/components/AddToCartButton'
import { Star, Truck, RotateCcw, Shield, Leaf, ChevronRight } from 'lucide-react'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true },
  })
  if (!product) return {}
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isPublished: true },
    include: {
      images: { orderBy: { order: 'asc' } },
      category: { select: { name: true, slug: true } },
      variants: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!product) notFound()

  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : null

  const primaryImage = product.images.find(i => i.isPrimary) ?? product.images[0]

  // Group variants by name
  const variantGroups: Record<string, typeof product.variants> = {}
  product.variants.forEach(v => {
    if (!variantGroups[v.name]) variantGroups[v.name] = []
    variantGroups[v.name].push(v)
  })

  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : null

  return (
    <div className="container-custom py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Product Section */}
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* ---- IMAGE GALLERY ---- */}
        <div className="flex gap-3">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex flex-col gap-2">
              {product.images.map(img => (
                <div key={img.id} className="w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border cursor-pointer hover:border-primary transition-colors">
                  <Image src={img.url} alt={img.alt ?? product.name} width={64} height={64} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          )}
          {/* Main Image */}
          <div className="relative flex-1 aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
            {primaryImage && (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt ?? product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}
            {product.isOnSale && discount && (
              <span className="absolute top-3 left-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* ---- PRODUCT INFO ---- */}
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              {product.category.name}
            </p>
            <h1 className="font-display text-3xl font-bold text-foreground leading-tight md:text-4xl">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          {avgRating && (
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`h-4 w-4 ${s <= Math.round(avgRating) ? 'fill-amber-400 stroke-amber-400' : 'stroke-muted-foreground'}`} />
                ))}
              </div>
              <span className="text-sm font-semibold">{avgRating.toFixed(1)}</span>
              <a href="#reviews" className="text-sm text-primary hover:underline">
                ({product.reviews.length} reviews)
              </a>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className={`text-3xl font-bold ${product.isOnSale ? 'text-red-600' : 'text-foreground'}`}>
              ${product.price.toFixed(2)}
            </span>
            {product.compareAt && (
              <span className="text-xl text-muted-foreground line-through">
                ${product.compareAt.toFixed(2)}
              </span>
            )}
            {discount && (
              <span className="rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2.5 py-1 text-sm font-bold">
                Save ${(product.compareAt! - product.price).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="border-t border-border" />

          {/* Variants */}
          {Object.entries(variantGroups).map(([groupName, variants]) => (
            <div key={groupName}>
              <p className="text-sm font-semibold mb-2">{groupName}:</p>
              <div className="flex flex-wrap gap-2">
                {variants.map(v => (
                  <button
                    key={v.id}
                    className="rounded-lg border-2 border-border px-4 py-2 text-sm font-medium transition-all hover:border-primary hover:text-primary focus:border-primary focus:text-primary"
                  >
                    {v.value}
                    {v.price && v.price !== product.price && (
                      <span className="ml-1 text-muted-foreground text-xs">(+${(v.price - product.price).toFixed(0)})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Stock */}
          <div className={`rounded-lg px-4 py-2.5 text-sm font-medium ${
            product.stock > 10 ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
            product.stock > 0  ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' :
                                  'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}>
            {product.stock > 10 ? `✅ In stock (${product.stock} available)` :
             product.stock > 0  ? `⚠️ Only ${product.stock} left in stock!` :
                                   '❌ Out of stock'}
          </div>

          {/* Add to Cart */}
          <AddToCartButton
            id={product.id}
            name={product.name}
            price={product.price}
            image={primaryImage?.url ?? ''}
            slug={product.slug}
          />

          {/* Trust perks */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { icon: Truck, text: 'Free shipping over $75' },
              { icon: RotateCcw, text: 'Free 30-day returns' },
              { icon: Shield, text: 'Secure Stripe checkout' },
              { icon: Leaf, text: 'Ethically sourced' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---- REVIEWS ---- */}
      <section id="reviews" className="mt-16 pt-10 border-t border-border">
        <h2 className="font-display text-2xl font-bold mb-8">
          Customer Reviews
          {avgRating && <span className="text-muted-foreground text-lg font-normal ml-3">({avgRating.toFixed(1)} ★ avg)</span>}
        </h2>

        {product.reviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            <Star className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium mb-1">No reviews yet</p>
            <p className="text-sm">Be the first to review this product!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {product.reviews.map(review => (
              <div key={review.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {(review.user.name ?? 'A')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{review.user.name ?? 'Anonymous'}</p>
                      {review.verified && <p className="text-xs text-green-600">✓ Verified Purchase</p>}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex mb-2">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-muted-foreground'}`} />
                  ))}
                </div>
                {review.title && <p className="text-sm font-semibold mb-1">{review.title}</p>}
                <p className="text-sm text-muted-foreground leading-relaxed">{review.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
