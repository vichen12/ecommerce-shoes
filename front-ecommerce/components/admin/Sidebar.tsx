'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Tag, ShoppingBag, Settings, Store, BarChart3, Users } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Pedidos', icon: ShoppingBag },
  { href: '/admin/products', label: 'Productos', icon: Package },
  { href: '/admin/categories', label: 'Categorías', icon: Tag },
  { href: '/admin/customers', label: 'Clientes', icon: Users },
  { href: '/admin/analytics', label: 'Analíticas', icon: BarChart3 },
  { href: '/admin/settings', label: 'Configuración', icon: Settings },
]

interface Props { tenantName: string }

export default function AdminSidebar({ tenantName }: Props) {
  const pathname = usePathname()

  function isActive(item: typeof navItems[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col min-h-screen sticky top-0 shrink-0">
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Store className="w-4 h-4 text-zinc-900" />
          </div>
          <div>
            <p className="text-white text-sm font-medium tracking-wider truncate max-w-[130px]">{tenantName}</p>
            <p className="text-zinc-500 text-xs">Panel de gestión</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item)
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active ? 'bg-white text-zinc-900 font-medium' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}>
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <Link href="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
          <Store className="w-4 h-4" />
          Ver tienda
        </Link>
      </div>
    </aside>
  )
}
