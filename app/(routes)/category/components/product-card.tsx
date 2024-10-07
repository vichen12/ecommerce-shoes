import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ProductType } from "@/types/product";
import Link from "next/link";
import IconButton from '../../../../components/ui/icon-button';
import { Expand, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from "@/lib/formatPrice";

type ProductCardProps = {
    product: ProductType;
}

const ProductCard = (props: ProductCardProps) => {
    const { product } = props;
    const router = useRouter();

    return (  
        <Link href={`/product/${product.attributes.slug}`} className="relative p-2 transition-all duration-100 rounded-lg hover:shadow-md">
            <div className="absolute flex items-center justify-between gap-3 px-2 z-[1] top-4">
                <p className="px-2 py-1 text-xs text-white bg-black rounded-full dark:bg-white dark:text-black w-fit">
                    {product.attributes.stock} <small>Restantes</small>
                </p>
                <p className="px-2 py-1 text-xs text-white bg-yellow-900 rounded-full dark:bg-white dark:text-black w-fit">
                    {product.attributes.size}
                </p>
            </div>
            <Carousel opts={{ allign: "start" }} className="w-full max-w-sm">
                <CarouselContent>
                    {product.attributes.images.data.map((image) => (
                        <CarouselItem key={image.id} className='max-w-[270px] h-[320px] object-cover object-center rounded-xl bg-white '>
                            <img 
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.attributes.url}`}
                                alt='Image'
                                className="rounded-xl mt-[60px] object-cover object-center"
                            />
                            <div className="absolute w-full px-6 transition duration-200 opacity-0 group-hover:opacity-100 bottom-5">
                                <div className='flex justify-center gap-x-6'>
                                    <IconButton 
                                        onClick={() => router.push(`/product/${product.attributes.slug}`)} 
                                        icon={<Expand size={20} className="text-red-600" />} 
                                    />
                                    <IconButton 
                                        onClick={() => console.log("Add to cart")} 
                                        icon={<ShoppingCart size={20} className="text-red-600" />} 
                                    />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <p className="text-2xl text-center">{product.attributes.productName}</p> {/* Cambiado a "attributes" */}
            <p className='font-bold text-center'>{formatPrice (product.attributes.price)}</p> {/* Cambiado a "attributes" */}
        </Link>
    );
}

export default ProductCard;
