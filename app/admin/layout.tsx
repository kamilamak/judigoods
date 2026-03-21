import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  BarChart3,
  Settings,
  ArrowLeft,
} from 'lucide-react'

const ADMIN_NAV = [
  { label: 'Dashboard',  href: '/admin',              icon: LayoutDashboard },
  { label: 'Products',   href: '/admin/products',      icon: Package },
  { label: 'Orders',     href: '/admin/orders',        icon: ShoppingCart },
  { label: 'Customers',  href: '/admin/customers',     icon: Users },
  { label: 'Categories', href: '/admin/categories',    icon: Tag },
  { label: 'Analytics',  href: '/admin/analytics',     icon: BarChart3 },
  { label: 'Settings',   href: '/admin/settings',      icon: Settings },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/auth/login?callbackUrl=/admin')

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* ---- SIDEBAR ---- */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border shadow-sm hidden md:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/" className="font-display text-xl font-bold text-primary">
            Judigoods
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-accent hover:text-primary transition-all"
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Back to store */}
        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* ---- MAIN CONTENT ---- */}
      <main className="md:ml-64 flex-1 p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
