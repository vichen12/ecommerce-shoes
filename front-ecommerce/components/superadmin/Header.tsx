'use client'

import { LogOut, Shield } from 'lucide-react'

interface Props {
  user: { email: string; full_name: string | null; role: string }
}

export default function SuperAdminHeader({ user }: Props) {
  return (
    <header className="bg-zinc-900 border-b border-zinc-800 px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-yellow-400" />
        <span className="text-yellow-400 text-xs font-medium tracking-widest uppercase">Vista de plataforma</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-zinc-900 text-xs font-bold">
              {(user.full_name || user.email)[0].toUpperCase()}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-xs font-medium">{user.full_name || 'Super Admin'}</p>
            <p className="text-yellow-400 text-xs">superadmin</p>
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
