import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useLovedProducts } from "@/hooks/use-loved-products";
import { formatPrice } from "@/lib/formatPrice";
import { ProductType } from "@/types/product";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface LovedItemProductProps {
    product: ProductType;
}

const LovedItemProduct = (props: LovedItemProductProps) => {
    const { product } = props;
    const router = useRouter();
    const { removeLovedItem } = useLovedProducts();
    const { addItem } = useCart();

    return ( 
        <li className="flex py-6 border-b ">
           <div onClick={() => product?.attributes.slug && router.push(`/product/${product.attributes.slug}`)}
            className=" h-[180px] bg-white ">
               {product.attributes.images.data.length > 0 ? ( // Verificación de existencia de imagen
                   <img 
                       src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.attributes.images.data[0].attributes.url}`} 
                       alt="product" 
                       className="w-24 h-24 overflow-hidden rounded-md sm:w-auto sm:h-32"
                   />
               ) : (
                   <p>No hay imagen disponible</p> // Mensaje alternativo
               )}
           </div>
           <div className="flex justify-between flex-1 px-6 ">
            <div>
                <div>
                    <h2 className="text-lg font-bold">{product.attributes.productName}</h2>
                <p className="font-bold">{formatPrice(product.attributes.price)}</p>
                <div className="flex items-center justify-between gap-3">
                    <p className="px-2 py-1 text-xs text-white bg-black rounded-full dark:bg-white dark:text-black w-fit"> 
                        {product.attributes.size} </p>
                    <p className="px-2 py-1 text-xs bg-yellow-900 rounded-full text-white"> Stock: 
                    { product.attributes.stock} zapatillas disponibles 
                    </p>
                    </div>
                    <Button className="w-full " onClick={()=>addItem(product)}>Añadir al carrito</Button>
                </div>
                <div>
                <Button
                        className="rounded-full flex justify-center items-center bg-white border shadow-md p-1 hover:scale-110 transition mt-[10px] w-10 h-10"
                        onClick={() => removeLovedItem(product.id)}
                        >
                        <X size={20} />
                        
                        </Button>
                </div>
            </div>
           </div>
        </li>
    );
}
 
export default LovedItemProduct;