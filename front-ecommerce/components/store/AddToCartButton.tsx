'use client'

import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'

interface Props {
  product: any
  slug: string
}

export default function AddToCartButton({ product, slug }: Props) {
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const outOfStock = product.stock === 0

  function addToCart() {
    if (outOfStock) return

    const cartKey = `cart_${slug}`
    const cart: any[] = JSON.parse(localStorage.getItem(cartKey) ?? '[]')
    const existing = cart.find((item: any) => item.id === product.id)

    if (existing) {
      existing.quantity += quantity
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: Array.isArray(product.images) ? product.images[0] : null,
        quantity,
      })
    }

    localStorage.setItem(cartKey, JSON.stringify(cart))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Quantity */}
      <div className="flex items-center gap-3">
        <span className="text-zinc-500 text-sm">Cantidad</span>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-zinc-400 hover:text-white w-6 text-center">−</button>
          <span className="text-white text-sm w-8 text-center">{quantity}</span>
          <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="text-zinc-400 hover:text-white w-6 text-center">+</button>
        </div>
      </div>

      <button
        onClick={addToCart}
        disabled={outOfStock}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm tracking-widest uppercase font-medium transition-all
          ${outOfStock
            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            : added
            ? 'bg-green-500 text-white'
            : 'bg-white text-zinc-900 hover:bg-zinc-100'
          }`}
      >
        {added ? <><Check className="w-4 h-4" /> Agregado</> : <><ShoppingBag className="w-4 h-4" /> Agregar al carrito</>}
      </button>
    </div>
  )
}
