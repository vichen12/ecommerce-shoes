import Link from 'next/link'

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-light text-white tracking-widest uppercase">
            LuxeShoes
          </Link>
          <Link href="/admin/login" className="text-zinc-500 text-xs hover:text-white transition-colors tracking-wider">
            Admin →
          </Link>
        </div>
      </header>
      {children}
    </div>
  )
}
