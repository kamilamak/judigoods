'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag, Heart, Star } from 'lucide-react'
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
  category,
  isOnSale,
  avgRating,
  reviewCount = 0,
}: ProductCardProps) {
  const { addItem } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)
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

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: isWishlisted ? '💔' : '❤️',
    })
  }

  return (
    <Link href={`/products/${slug}`} className="product-card flex flex-col">
      {/* ---- IMAGE ---- */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        {isOnSale && discount && (
          <span className="badge-sale">-{discount}%</span>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 rounded-full bg-white/90 dark:bg-card/90 p-2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'
            }`}
          />
        </button>

        {/* Quick add overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="btn-primary w-full py-2.5 text-xs"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {isAdding ? 'Adding...' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* ---- INFO ---- */}
      <div className="flex flex-col flex-1 p-3">
        <p className="text-xs text-muted-foreground mb-1">{category}</p>
        <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 mb-2 flex-1">
          {name}
        </h3>

        {/* Rating */}
        {avgRating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= Math.round(avgRating)
                      ? 'fill-amber-400 stroke-amber-400'
                      : 'stroke-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${isOnSale ? 'text-red-600' : 'text-foreground'}`}>
            ${price.toFixed(2)}
          </span>
          {compareAt && (
            <span className="text-xs text-muted-foreground line-through">
              ${compareAt.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
