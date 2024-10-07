"use client";
import { useGetCategoriesProduct } from "@/api/getCategoryProducts";
import { Separator } from "@/components/ui/separator";
import { ResponseType } from "@/types/response";
import { useParams } from "next/navigation";
import FilterControlsCategory from "../components/filters-controls-category";
import SkeletonSchema from "@/components/ui/skeletonSchema";
import ProductCard from "../components/product-card";
import { ProductType } from "@/types/product";
import { useState } from "react";

export default function Page() {
    const params = useParams();
    const { categorySlug } = params;
    const { result, loading }: ResponseType = useGetCategoriesProduct(categorySlug);
    const [filterSize, setFilterSize] = useState<string[]>([]); 

    const filteredProducts = result != null && !loading && (
        filterSize.length === 0 ? result : 
        result.filter((product: ProductType) => filterSize.includes(product.attributes.size)) 
    );

    return (
        <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24 flex flex-col">
            {result !== null && !loading && (
                <h1 className="text-3xl font-medium">Zapatillas {result[0].attributes.category.data.attributes.categoryName}</h1>
            )}
            <Separator />
            <div className="sm:flex sm:justify-between  ">
    <FilterControlsCategory setFilterSize={setFilterSize} className="mt-[200px] bg-white " />
        </div>
            <div className="grid gap-5 mt-8 sm:grid-cols-2 md:grid-cols-3 md:gap-10  ">
                {loading && (
                    <SkeletonSchema grid={3} />
                )}
                {filteredProducts !== null && !loading && (
                    filteredProducts.map((product: ProductType) => (
                        <ProductCard key={product.id} product={product}  />
                    ))
                )}
                {filteredProducts !== null && !loading && filteredProducts.length   === 0 &&(
                    <p>No hay productos con este filtros, te pedimos disculpas!</p>
                )}
            </div>
        </div>
    );
}
