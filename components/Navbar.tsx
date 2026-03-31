'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/hooks/useCart'
import { Search, User, ShoppingBag, Heart, Menu, X, ChevronDown } from 'lucide-react'

const NAV_LINKS = [
  { label: 'New', href: '/products?tag=new-arrival' },
  {
    label: 'Clothing',
    href: '/products?category=clothing',
    dropdown: [
      { label: 'All Clothing', href: '/products?category=clothing' },
      { label: 'Dresses', href: '/products?category=clothing' },
      { label: 'Tops & Shirts', href: '/products?category=clothing' },
      { label: 'Skirts', href: '/products?category=clothing' },
    ],
  },
  {
    label: 'Accessories',
    href: '/products?category=accessories',
    dropdown: [
      { label: 'All Accessories', href: '/products?category=accessories' },
      { label: 'Jewellery', href: '/products?category=accessories' },
      { label: 'Handbags', href: '/products?category=accessories' },
    ],
  },
  {
    label: 'Home & Living',
    href: '/products?category=home-living',
    dropdown: [
      { label: 'All Home', href: '/products?category=home-living' },
      { label: 'Pillows & Cushions', href: '/products?category=home-living' },
      { label: 'Bedding', href: '/products?category=home-living' },
    ],
  },
  { label: 'Beauty', href: '/products?category=beauty-wellness' },
  { label: 'Sale', href: '/products?sale=true' },
]

export default function Navbar() {
  const { data: session } = useSession()
  const { itemCount, toggleCart } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Announcement Bar */}
      <div className="announcement-bar">
        Free Standard Shipping on orders over $75 &nbsp;|&nbsp; Use code WELCOME15 for 15% off
      </div>

      {/* Main Nav */}
      <div className="bg-[#f5f0eb] border-b border-[#e0d8cf]">
        <div className="container-custom flex items-center h-[60px] gap-8">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 mr-4">
            <span className="text-xl font-bold tracking-widest uppercase text-foreground">
              Judigoods
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 flex-1">
            {NAV_LINKS.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="nav-link flex items-center gap-0.5">
                    {link.label}
                    <ChevronDown className="h-3 w-3 mt-0.5" />
                  </button>
                  {activeDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-[#e0d8cf] shadow-sm py-2 z-50">
                      {link.dropdown.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-4 py-2.5 text-xs tracking-wider uppercase text-foreground/70 hover:text-foreground hover:bg-[#f5f0eb] transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.label} href={link.href} className="nav-link">
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-1 ml-auto">
            <Link href="/products?search=" className="btn-ghost" aria-label="Search">
              <Search className="h-[18px] w-[18px]" />
            </Link>

            <div className="relative group">
              <button className="btn-ghost" aria-label="Account">
                <User className="h-[18px] w-[18px]" />
              </button>
              <div className="absolute right-0 top-full mt-0 w-44 bg-white border border-[#e0d8cf] shadow-sm py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {session ? (
                  <>
                    <div className="px-4 py-2 border-b border-[#e0d8cf]">
                      <p className="text-[11px] font-semibold uppercase tracking-wider truncate">{session.user.name}</p>
                    </div>
                    <Link href="/account/orders" className="block px-4 py-2.5 text-[11px] tracking-wider uppercase text-foreground/70 hover:text-foreground hover:bg-[#f5f0eb]">
                      My Orders
                    </Link>
                    {session.user.role === 'ADMIN' && (
                      <Link href="/admin" className="block px-4 py-2.5 text-[11px] tracking-wider uppercase text-foreground/70 hover:text-foreground hover:bg-[#f5f0eb]">
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="block w-full text-left px-4 py-2.5 text-[11px] tracking-wider uppercase text-red-600 hover:bg-[#f5f0eb]"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block px-4 py-2.5 text-[11px] tracking-wider uppercase text-foreground/70 hover:text-foreground hover:bg-[#f5f0eb]">
                      Sign In
                    </Link>
                    <Link href="/auth/register" className="block px-4 py-2.5 text-[11px] tracking-wider uppercase text-foreground/70 hover:text-foreground hover:bg-[#f5f0eb]">
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>

            <button className="btn-ghost" aria-label="Wishlist">
              <Heart className="h-[18px] w-[18px]" />
            </button>

            <button onClick={toggleCart} className="btn-ghost relative" aria-label="Cart">
              <ShoppingBag className="h-[18px] w-[18px]" />
              {itemCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold">
                  {itemCount() > 9 ? '9+' : itemCount()}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              className="md:hidden btn-ghost"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#f5f0eb] border-t border-[#e0d8cf] px-6 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block py-3 text-xs tracking-widest uppercase font-medium text-foreground/70 hover:text-foreground border-b border-[#e0d8cf] last:border-0"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
