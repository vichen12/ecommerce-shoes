'use client'

import { LogOut, Bell } from 'lucide-react'

interface Props {
  user: { email: string; full_name: string | null; role: string }
  tenantName: string
}

export default function AdminHeader({ user, tenantName }: Props) {
  return (
    <header className="bg-zinc-900 border-b border-zinc-800 px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <p className="text-zinc-400 text-xs tracking-widest uppercase">Bienvenido</p>
        <p className="text-white text-sm font-medium">{user.full_name || user.email}</p>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <div className="h-6 w-px bg-zinc-800" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <span className="text-zinc-900 text-xs font-bold">
              {(user.full_name || user.email)[0].toUpperCase()}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-xs font-medium">{user.full_name || 'Admin'}</p>
            <p className="text-zinc-500 text-xs">{tenantName}</p>
          </div>
        </div>
        <button
          onClick={() => window.location.href = '/admin/logout'}
          className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
