'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface Props { id: string; name: string }

export default function DeleteCategoryButton({ id, name }: Props) {
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (res.ok) router.refresh()
    setLoading(false)
    setConfirm(false)
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-1">
        <button onClick={handleDelete} disabled={loading}
          className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors disabled:opacity-50">
          {loading ? '...' : 'Confirmar'}
        </button>
        <button onClick={() => setConfirm(false)}
          className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 text-xs hover:bg-zinc-700 transition-colors">
          No
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => setConfirm(true)}
      className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  )
}
