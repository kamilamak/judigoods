'use client'

import { useState } from 'react'
import { ShoppingBag, Heart, Check } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import toast from 'react-hot-toast'

interface Props {
  id: string
  name: string
  price: number
  image: string
  slug: string
  variant?: string
}

export default function AddToCartButton({ id, name, price, image, slug, variant }: Props) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  const handleAdd = () => {
    addItem({ id, name, price, image, slug, quantity, variant })
    toast.success(`${name} added to cart!`)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-3">
      {/* Quantity + Add */}
      <div className="flex gap-3">
        {/* Quantity */}
        <div className="flex items-center border border-input rounded-md overflow-hidden">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="px-3 py-3 text-muted-foreground hover:bg-accent transition-colors font-bold"
          >
            −
          </button>
          <span className="px-4 py-3 text-sm font-semibold border-x border-input min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(q => q + 1)}
            className="px-3 py-3 text-muted-foreground hover:bg-accent transition-colors font-bold"
          >
            +
          </button>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAdd}
          className={`flex-1 btn-primary justify-center py-3 transition-all ${
            added ? 'bg-green-600 hover:bg-green-600' : ''
          }`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" /> Added!
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </>
          )}
        </button>

        {/* Wishlist */}
        <button
          onClick={() => {
            setWishlisted(!wishlisted)
            toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
              icon: wishlisted ? '💔' : '❤️',
            })
          }}
          className={`p-3 rounded-md border transition-all ${
            wishlisted
              ? 'border-red-300 bg-red-50 text-red-500 dark:bg-red-900/20 dark:border-red-800'
              : 'border-input hover:border-red-300 hover:bg-red-50 hover:text-red-500'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`h-5 w-5 ${wishlisted ? 'fill-red-500' : ''}`} />
        </button>
      </div>
    </div>
  )
}
