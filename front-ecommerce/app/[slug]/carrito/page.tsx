import CartView from '@/components/store/CartView'

export default function CartPage({ params }: { params: { slug: string } }) {
  return <CartView slug={params.slug} />
}
