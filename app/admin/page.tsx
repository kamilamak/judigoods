import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Star,
  AlertCircle,
} from 'lucide-react'

async function getAdminStats() {
  const [
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } }, items: { select: { quantity: true } } },
    }),
    prisma.product.findMany({
      where: { stock: { lt: 5 }, isPublished: true },
      select: { name: true, stock: true, sku: true },
      take: 5,
    }),
  ])

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue: totalRevenue._sum.total ?? 0,
    recentOrders,
    lowStockProducts,
  }
}

const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING:    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  CONFIRMED:  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  PROCESSING: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  SHIPPED:    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  DELIVERED:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  CANCELLED:  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/auth/login')

  const stats = await getAdminStats()

  const statCards = [
    { label: 'Total Revenue',  value: `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Total Orders',   value: stats.totalOrders.toString(),    icon: ShoppingCart, color: 'text-blue-600',   bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Products',       value: stats.totalProducts.toString(),   icon: Package,      color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Customers',      value: stats.totalUsers.toString(),      icon: Users,        color: 'text-amber-600',  bg: 'bg-amber-100 dark:bg-amber-900/30' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {session.user.name}! Here&apos;s what&apos;s happening.</p>
      </div>

      {/* ---- STAT CARDS ---- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <div className={`rounded-lg p-2 ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      {/* ---- RECENT ORDERS + LOW STOCK ---- */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Recent Orders</h2>
            </div>
            <a href="/admin/orders" className="text-xs text-primary hover:underline">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No orders yet</td></tr>
                ) : (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  stats.recentOrders.map((order: any) => (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <a href={`/admin/orders/${order.id}`} className="font-medium text-primary hover:underline">
                          #{order.orderNumber}
                        </a>
                        <p className="text-xs text-muted-foreground">{order.items.reduce((s: number, i: any) => s + i.quantity, 0)} items</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium truncate max-w-[140px]">{order.user?.name ?? 'Guest'}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[140px]">{order.user?.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ${order.total.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <h2 className="font-semibold text-foreground">Low Stock</h2>
            </div>
            <a href="/admin/products" className="text-xs text-primary hover:underline">Manage</a>
          </div>
          <div className="divide-y divide-border">
            {stats.lowStockProducts.length === 0 ? (
              <div className="p-5 text-center text-sm text-muted-foreground">
                <Star className="h-8 w-8 text-green-500 mx-auto mb-2" />
                All products well-stocked!
              </div>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              stats.lowStockProducts.map((p: any) => (
                <div key={p.sku} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground line-clamp-1">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sku}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
