"use client";
import { useLovedProducts } from "@/hooks/use-loved-products";
import LovedItemProduct from "./components/love-item-product";

export default function Page() {
    const { lovedItems } = useLovedProducts(); 

    return (
        <div className="max-w-4xl py-4 mx-auto sm:py-10 sm:px-18">
            <h1 className="sm:text-2xl">Productos Favoritos</h1>
            <div>
                {lovedItems.length === 0 && (
                    <p>No hay productos favoritos</p>
                )}
                <ul>
                    {lovedItems.map((item)=>(
                        <LovedItemProduct key={item.id} product={item}/>
                    
                    ))}
                </ul>
            </div>
        </div>
    );
}
