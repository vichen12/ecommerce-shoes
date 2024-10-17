import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatPrice";
import { ProductType } from "@/types/product";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItemProps{
    product:ProductType
}

const CardItem = (props:CartItemProps) => {
    const {product} = props
    const router = useRouter()
    const {removeItem} = useCart()
    return ( 
      <li className="flex py-6 border-b">
        <div className="cursor-pointer  h-[220px] bg-white  "onClick={()=> router.push(`/product/${product.attributes.slug}`)}>
        <img
  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.attributes.images?.data?.[0]?.attributes?.url || '/path-to-default-image.jpg'}`}
  alt="Product"
  className="w-24 h-24 overflow-hidden rounded-md sm:w-auto sm:h-32"
/>
        </div>
        <div className="flex justify-betweenflex-1 px-6">
            <div>
                <h2 className="text-lg font-bold">
                    {product.attributes.productName}
                </h2>
                <p className="font-bold">
                    {formatPrice(product.attributes.price)}
                </p>
                <div className="flex items-center justify-between gap-3">
                    <p className="px-2 py-1 text-white bg-black rounded-full dark:bg-white dark:text-black w-fit">
                        {product.attributes.size}
                    </p>
                </div>
                </div>
                <div>
                <Button
                        className="rounded-full flex justify-center items-center bg-white border shadow-md p-1 hover:scale-110 transition mt-[10px] w-10 h-10"
                        onClick={() => removeItem(product.id)}
                        >
                        <X size={20} />
                        </Button>
                </div>

            </div>


      </li>
     );
}
 
export default CardItem;