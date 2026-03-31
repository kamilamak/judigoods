'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import toast from 'react-hot-toast'

interface ProductCardProps {
  id: string
  name: string
  slug: string
  price: number
  compareAt?: number
  image: string
  category: string
  isOnSale?: boolean
  isFeatured?: boolean
  avgRating?: number | null
  reviewCount?: number
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  compareAt,
  image,
  isOnSale,
}: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const discount = compareAt ? Math.round(((compareAt - price) / compareAt) * 100) : null

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    addItem({ id, name, price, image, slug })
    toast.success(`${name} added to cart!`)
    setTimeout(() => setIsAdding(false), 600)
  }

  return (
    <Link href={`/products/${slug}`} className="product-card group">
      {/* Image container — tall portrait like Vela */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#ece8e2]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Sale badge — small, top left */}
        {isOnSale && discount && (
          <span className="absolute top-2 left-2 bg-white text-foreground text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5">
            -{discount}%
          </span>
        )}

        {/* Quick Add — appears on hover at bottom */}
        <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-white text-foreground text-[10px] font-semibold tracking-widest uppercase py-3 flex items-center justify-center gap-2 hover:bg-foreground hover:text-white transition-colors"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Product Info — Vela style: name uppercase, price below */}
      <div className="pt-3 pb-1">
        <h3 className="text-[11px] font-semibold tracking-widest uppercase text-foreground leading-snug line-clamp-2 mb-1">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-foreground/80">
            ${price.toFixed(2)} USD
          </span>
          {compareAt && (
            <span className="text-[11px] text-foreground/40 line-through">
              ${compareAt.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
