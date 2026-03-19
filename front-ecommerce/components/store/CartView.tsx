'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, ShoppingBag } from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  image: string | null
  quantity: number
}

export default function CartView({ slug }: { slug: string }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const cartKey = `cart_${slug}`
    setCart(JSON.parse(localStorage.getItem(cartKey) ?? '[]'))
  }, [slug])

  function updateQuantity(id: string, quantity: number) {
    const cartKey = `cart_${slug}`
    const updated = cart.map(item => item.id === id ? { ...item, quantity } : item).filter(item => item.quantity > 0)
    setCart(updated)
    localStorage.setItem(cartKey, JSON.stringify(updated))
  }

  function removeItem(id: string) {
    const cartKey = `cart_${slug}`
    const updated = cart.filter(item => item.id !== id)
    setCart(updated)
    localStorage.setItem(cartKey, JSON.stringify(updated))
  }

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)

  if (!mounted) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-light text-white tracking-wide mb-8">Carrito</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500 mb-6">Tu carrito está vacío</p>
          <Link href={`/${slug}/productos`}
            className="bg-white text-zinc-900 px-6 py-3 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors">
            Seguir comprando
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-700 text-xs">—</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-light truncate">{item.name}</p>
                  <p className="text-zinc-400 text-sm mt-1">${Number(item.price).toLocaleString('es-AR')}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-zinc-400 hover:text-white w-7 h-7 border border-zinc-700 rounded-lg flex items-center justify-center text-sm">−</button>
                    <span className="text-white text-sm w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-zinc-400 hover:text-white w-7 h-7 border border-zinc-700 rounded-lg flex items-center justify-center text-sm">+</button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.id)} className="text-zinc-600 hover:text-red-400 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <p className="text-white text-sm font-medium">${(Number(item.price) * item.quantity).toLocaleString('es-AR')}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit space-y-4">
            <h2 className="text-white font-medium">Resumen</h2>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Subtotal</span>
              <span className="text-white">${total.toLocaleString('es-AR')}</span>
            </div>
            <div className="border-t border-zinc-800 pt-4 flex items-center justify-between">
              <span className="text-white font-medium">Total</span>
              <span className="text-white text-xl font-light">${total.toLocaleString('es-AR')}</span>
            </div>
            <Link href={`/${slug}/checkout`}
              className="w-full block text-center bg-white text-zinc-900 py-3.5 rounded-xl text-sm font-medium hover:bg-zinc-100 transition-colors">
              Continuar al pago
            </Link>
            <Link href={`/${slug}/productos`}
              className="w-full block text-center text-zinc-500 text-sm hover:text-white transition-colors py-2">
              Seguir comprando
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
