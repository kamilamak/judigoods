'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* ---- BACKDROP ---- */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* ---- DRAWER ---- */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Your Cart</h2>
            {itemCount() > 0 && (
              <span className="text-sm text-muted-foreground">({itemCount()} items)</span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="btn-ghost p-2 rounded-full"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ---- ITEMS ---- */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 p-6 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
            <h3 className="text-lg font-medium">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">Add some beautiful items to get started!</p>
            <Link href="/products" onClick={closeCart} className="btn-primary mt-2">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4 px-6">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.variant}`}
                  className="flex gap-3 bg-secondary/30 rounded-xl p-3"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm font-medium text-foreground hover:text-primary line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center rounded-lg border border-border bg-background overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                          className="px-2.5 py-1 text-sm hover:bg-accent transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium border-x border-border">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                          className="px-2.5 py-1 text-sm hover:bg-accent transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id, item.variant)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ---- FOOTER ---- */}
            <div className="border-t border-border p-6 space-y-4">
              {/* Subtotal */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${total().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">
                    {total() >= 75 ? 'Free' : 'Calculated at checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-border pt-2">
                  <span>Total</span>
                  <span>${total().toFixed(2)}</span>
                </div>
              </div>

              {/* Free shipping progress */}
              {total() < 75 && (
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1.5">
                    Add <span className="font-semibold text-primary">${(75 - total()).toFixed(2)}</span> more for free shipping!
                  </p>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((total() / 75) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full justify-center py-3.5"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="btn-secondary w-full justify-center py-3"
                >
                  View Full Cart
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
