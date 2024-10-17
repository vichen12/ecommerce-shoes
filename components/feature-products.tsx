"use client";

import { ResponseType } from "@/types/response";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import SkeletonSchema from "./ui/skeletonSchema";
import { useGetFeaturedProducts } from "@/api/useGetFeatureProducts";
import { ProductType } from "@/types/product";
import { Card, CardContent } from "./ui/card";
import { Expand, ShoppingCart } from "lucide-react";  
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";

const FeaturedProducts = () => {
  const { result, loading }: ResponseType = useGetFeaturedProducts();
  const router = useRouter();
  const { addItem } = useCart();


  const sortedProducts = result?.sort((a: ProductType, b: ProductType) => {
    const nameA = a.attributes.productName.toLowerCase();
    const nameB = b.attributes.productName.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  return (
    <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
      <h3 className="px-6 text-3xl sm:pb-8">Productos destacados</h3>
      <Carousel>
        <CarouselContent className="-ml-2 md:-ml-4">
          {loading && <SkeletonSchema grid={3} />}
          {sortedProducts != null &&
            sortedProducts.map((product: ProductType) => {
              const { attributes, id } = product;
              const { slug, images, productName, price} = attributes;

              return (
                <CarouselItem key={id} className="md:basis-1/2 lg:basis-1/3 group">
                  <div className="p-1">
                    <Card className="bg-white dark:bg-white py-4 border border-gray-200 shadow-none">
                      <CardContent className="max-w-[370px] h-[380px] bg-white dark:bg-white relative flex items-center justify-center px-6 py-2">
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${images.data[0].attributes.url}`}
                          alt={productName}
                        />
                        <div className="absolute w-full px-6 transition duration-200 opacity-0 group-hover:opacity-100 bottom-5">
                          <div className="flex justify-center gap-x-6">
                          <Expand 
                                  strokeWidth="1" 
                                  className="cursor-pointer" 
                                  onClick={() => router.push(`/product/${slug}`)}
                                  color="black"  
                                />
                         
                            <ShoppingCart 
                                  strokeWidth="1" 
                                  className="cursor-pointer" 
                                  onClick={() => addItem(product)}
                                  color="black" 
                                />
                   
                            
                          </div>
                        </div>
                      </CardContent>
                      <div className="flex justify-between gap-4 px-8 bg-white dark:bg-white"> 
                        <h3 className="text-lg font-bold text-black dark:text-black">{productName}</h3> 
                        <div className="flex items-center justify-between gap-3">
                          <p className="px-2 py-1 text-white bg-black rounded-full dark:bg-white dark:text-black w-fit">
                            {price} $
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
};

export default FeaturedProducts;
