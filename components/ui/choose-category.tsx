"use client";
import { useGetCategories } from "@/api/getProducts";
import { CategoryType } from "@/types/category";
import { ResponseType } from "@/types/response";
import Link from "next/link";

const ChooseCategory = () => {
    const { result, loading }: ResponseType = useGetCategories();

    return (
        <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
            <h3 className="px-6 pb-4 text-3xl sm:pb-8">Elige tu Categoria favorita</h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {!loading && result.length > 0 &&
                    result.map((category: CategoryType) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.attributes.slug}`}
                            className="relative max-w-xs mx-auto overflow-hidden bg-no-repeat bg-cover rounded-lg h-[300px]"
                        >
                            <img
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${category.attributes.Categoryimage.data.attributes.url}`}
                                alt={category.attributes.categoryName}
                                className="max-w-[270px] h-[180px] object-cover transition duration-300 ease-in-out rounded-lg hover:scale-105"
                            />
                            <p className="w-full py-2 text-lg font-bold text-center backdrop-blur-lg h-[50px] flex items-center justify-center">
                                {category.attributes.categoryName}
                            </p>
                        </Link>
                    ))
                }
            </div>
        </div>
    );
};

export default ChooseCategory;
