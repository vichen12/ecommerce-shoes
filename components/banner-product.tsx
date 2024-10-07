import Link from "next/link";
import { buttonVariants } from "./ui/button";
import bannerImage from '../public/banner2.png'; 
const BannerProduct = () => {
    return (
        <>
            <div className="mt-4 text-center">
                <p>¿Qué estás esperando?</p>
                <h4 className="mt-2 text-5xl font-semibold uppercase">
                    Utiliza el mejor calzado a los mejores precios con LUXE<span className="font-extrabold">SHOES</span>
                </h4>
                <p className="my-2 text-lg">Los mejores precios y la mejor calidad</p>

                <Link href='#' className={buttonVariants()}>Comprar</Link>
            </div>
            <div 
    className=" h-[350px] md:h-[600px] lg:h-[900px]  bg-center mt-5"
    style={{ 
        backgroundImage: `url(${bannerImage.src})`,
        backgroundSize: 'contain', 
        backgroundRepeat: 'no-repeat'

    }}> 
</div>






        </>
    );
}

export default BannerProduct;
