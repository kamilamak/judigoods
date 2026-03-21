'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/hooks/useCart'
import DarkModeToggle from './DarkModeToggle'
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Heart,
  LogOut,
  LayoutDashboard,
  Package,
  ChevronDown,
} from 'lucide-react'

const NAV_LINKS = [
  { label: 'Shop All', href: '/products' },
  {
    label: 'Categories',
    href: '#',
    dropdown: [
      { label: 'Clothing', href: '/products?category=clothing' },
      { label: 'Scarves & Wraps', href: '/products?category=scarves-wraps' },
      { label: 'Home & Decor', href: '/products?category=home-decor' },
      { label: 'Accessories', href: '/products?category=accessories' },
      { label: 'Lifestyle', href: '/products?category=lifestyle' },
    ],
  },
  { label: 'New Arrivals', href: '/products?tag=new-arrival' },
  { label: 'Sale', href: '/products?sale=true' },
]

export default function Navbar() {
  const { data: session } = useSession()
  const { itemCount, toggleCart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm border-b border-border shadow-sm'
          : 'bg-background border-b border-border'
      }`}
    >
      {/* ---- ANNOUNCEMENT BAR ---- */}
      <div className="bg-brand-600 py-2 text-center">
        <p className="text-xs font-medium text-white">
          ✨ Free shipping on orders over $75 · Use code{' '}
          <span className="font-bold underline">WELCOME15</span> for 15% off your first order
        </p>
      </div>

      {/* ---- MAIN NAV ---- */}
      <div className="container-custom flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="font-display text-2xl font-bold text-primary tracking-tight">
            Judigoods
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) =>
            link.dropdown ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  {link.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {activeDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-52 rounded-xl border border-border bg-card shadow-lg py-2 animate-fade-in">
                    {link.dropdown.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="block px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-accent transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <DarkModeToggle />

          {/* Search */}
          <Link href="/search" className="btn-ghost p-2 rounded-full" aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>

          {/* Wishlist */}
          {session && (
            <Link href="/wishlist" className="btn-ghost p-2 rounded-full" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          )}

          {/* User Account */}
          <div className="relative group">
            <button className="btn-ghost p-2 rounded-full" aria-label="Account">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? 'User'}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-border bg-card shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {session ? (
                <>
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-xs font-medium text-foreground truncate">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                  </div>
                  <Link href="/account/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-accent transition-colors">
                    <Package className="h-4 w-4" /> My Orders
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-accent transition-colors">
                      <LayoutDashboard className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-accent transition-colors">
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="block px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-accent transition-colors">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Cart */}
          <button
            onClick={toggleCart}
            className="relative btn-ghost p-2 rounded-full"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount() > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {itemCount() > 99 ? '99+' : itemCount()}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden btn-ghost p-2 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ---- MOBILE MENU ---- */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-1 animate-fade-in">
          {NAV_LINKS.map((link) => (
            <div key={link.label}>
              <Link
                href={link.href}
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
              {link.dropdown?.map((sub) => (
                <Link
                  key={sub.label}
                  href={sub.href}
                  className="block rounded-lg px-8 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </header>
  )
}
