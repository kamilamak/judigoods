'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (items.length === 0) return
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.id, quantity: i.quantity, variant: i.variant })),
        }),
      })
      const data = await res.json()
      if (data.url) {
        clearCart()
        window.location.href = data.url
      } else {
        toast.error(data.error ?? 'Checkout failed. Please try again.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-24 text-center">
        <ShoppingBag className="h-20 w-20 text-muted-foreground/20 mx-auto mb-6" />
        <h1 className="font-display text-3xl font-bold mb-3">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/products" className="btn-primary inline-flex">
          Start Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-destructive transition-colors">
          Clear cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={`${item.id}-${item.variant}`} className="flex gap-4 rounded-xl border border-border bg-card p-4">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`} className="text-sm font-semibold hover:text-primary line-clamp-2">
                  {item.name}
                </Link>
                {item.variant && <p className="text-xs text-muted-foreground mt-1">{item.variant}</p>}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)} className="px-3 py-1.5 hover:bg-accent transition-colors">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-4 py-1.5 text-sm font-medium border-x border-border">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)} className="px-3 py-1.5 hover:bg-accent transition-colors">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeItem(item.id, item.variant)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-border bg-card p-6 h-fit sticky top-24">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${total().toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-green-600">{total() >= 75 ? 'Free' : 'Calculated at checkout'}</span></div>
            <div className="flex justify-between font-bold text-base border-t border-border pt-3">
              <span>Estimated Total</span><span>${total().toFixed(2)}</span>
            </div>
          </div>
          {total() < 75 && (
            <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3 text-xs text-amber-800 dark:text-amber-300">
              Add <strong>${(75 - total()).toFixed(2)}</strong> more for free shipping!
              <div className="mt-2 h-1.5 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${(total() / 75) * 100}%` }} />
              </div>
            </div>
          )}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn-primary w-full justify-center mt-5 py-3.5 text-base"
          >
            {loading ? 'Redirecting to Stripe...' : 'Checkout with Stripe'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
          <Link href="/products" className="block text-center text-sm text-muted-foreground hover:text-primary mt-3 transition-colors">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
