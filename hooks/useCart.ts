// ============================================================
// JUDIGOODS - Cart Store using Zustand
// Persistent cart stored in localStorage for guest users
// ============================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  slug: string
  quantity: number
  variant?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string, variant?: string) => void
  updateQuantity: (id: string, quantity: number, variant?: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items
        const key = item.variant ? `${item.id}-${item.variant}` : item.id
        const existing = items.find(
          (i) => (item.variant ? `${i.id}-${i.variant}` : i.id) === key
        )

        if (existing) {
          set({
            items: items.map((i) =>
              (item.variant ? `${i.id}-${i.variant}` : i.id) === key
                ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                : i
            ),
          })
        } else {
          set({ items: [...items, { ...item, quantity: item.quantity ?? 1 }] })
        }

        // Auto-open cart when item added
        set({ isOpen: true })
      },

      removeItem: (id, variant) => {
        set({
          items: get().items.filter((i) =>
            variant ? !(i.id === id && i.variant === variant) : i.id !== id
          ),
        })
      },

      updateQuantity: (id, quantity, variant) => {
        if (quantity <= 0) {
          get().removeItem(id, variant)
          return
        }
        set({
          items: get().items.map((i) =>
            variant
              ? i.id === id && i.variant === variant
                ? { ...i, quantity }
                : i
              : i.id === id
              ? { ...i, quantity }
              : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      total: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      itemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: 'judigoods-cart', // key in localStorage
      partialize: (state) => ({ items: state.items }), // only persist items
    }
  )
)
