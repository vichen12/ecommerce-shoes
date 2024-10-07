"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/formatPrice"
import CardItem from "./components/cart-item"
import { loadStripe } from "@stripe/stripe-js"
import { makePaymentRequest } from "@/api/payment"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

export default function Page() {
    const { items, removeAll } = useCart()
    const totalPrice = items.reduce((total, item) => total + item.attributes.price, 0)

    console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

    const buyStripe = async () => {
        
        try {
            const stripe = await stripePromise
            if (!stripe) {
                throw new Error("Stripe no se ha cargado correctamente.");
            }
            const res = await makePaymentRequest.post("/api/orders", {
                products: items
            })
            await stripe.redirectToCheckout({
                sessionId: res.data.stripeSession.id
            })
        } catch (error) {
            console.error("Error al procesar el pago con Stripe:", error)
        }
    }

    return (
        <div className="max-w-6xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
            <h1 className="mb-5 text-3xl font-bold">Carrito de Compras</h1>
            <div className="grid sm:grid-cols-2 sm:gap-5">
                <div>
                    {items.length === 0 && (
                        <p>No hay productos en el carrito.</p>
                    )}
                    <ul>
                        {items.map((item) => (
                            <CardItem key={item.id} product={item} />
                        ))}
                    </ul>
                </div>
                <div className="max-2-xl">
                    <div className="p-6 rounded-lg bg-slate-100">
                        <p className="mb-3 text-lg font-semibold text-black">Resumen del Pedido</p>
                        <Separator />
                        <div className="flex justify-between gap-5 my-4 text-black">
                            <p>Total del Pedido</p>
                            <p>{formatPrice(totalPrice)}</p>
                        </div>
                        <div className="flex items-center justify-center w-full mt-3">
                            <Button className="w-full" onClick={buyStripe}>Comprar</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
