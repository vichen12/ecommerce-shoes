"use client"

import Link from "next/link";
import { buttonVariants } from "./button";

const BannerDiscount = () => {
    return (  
        <div className="p-5 sm:p-20 text-center">
            <h2 className="uppercase font-black text-2xl text-primary"> Consigue hasta un -25% Gastando mas de $100 </h2>
            <h3 className="mt-3 font-semibold">Utlizando el codigo de LUXE<span className="font-bold">SHOES</span> Consegui un 15% de Descuento!</h3>
            <div className="max-w-md mx-auto sm:flex justify-center gap-8 mt-5">
                <Link href="#" className={buttonVariants()}>Comprar</Link>
                <Link href="#" className={buttonVariants({variant:"outline"})}>Más Informacion</Link>

            </div>

        </div>
    );
}
 
export default BannerDiscount;