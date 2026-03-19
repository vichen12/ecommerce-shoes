'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Building2, Users, BarChart3, Settings, Globe } from 'lucide-react'

const navItems = [
  { href: '/superadmin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/superadmin/tenants', label: 'Clientes', icon: Building2 },
  { href: '/superadmin/users', label: 'Usuarios', icon: Users },
  { href: '/superadmin/analytics', label: 'Analíticas', icon: BarChart3 },
  { href: '/superadmin/settings', label: 'Configuración', icon: Settings },
]

export default function SuperAdminSidebar() {
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
            <Globe className="w-4 h-4 text-zinc-900" />
          </div>
          <div>
            <p className="text-white text-sm font-medium tracking-wider">SUPER ADMIN</p>
            <p className="text-zinc-500 text-xs">Plataforma global</p>
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
        <div className="px-3 py-2">
          <span className="text-xs text-zinc-600 uppercase tracking-wider">Modo Super Admin</span>
        </div>
      </div>
    </aside>
  )
}
