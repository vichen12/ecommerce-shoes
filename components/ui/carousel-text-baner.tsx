"use client"
import { useRouter } from "next/navigation"
import {Carousel, CarouselContent, CarouselItem, } from "@/components/ui/carousel"
import { Card, CardContent } from "./card"
import Autoplay from "embla-carousel-autoplay"
  

export const dataCarouselTop = [
    {
      id: 1,
      title: "Nike - Innovación y Estilo",
      description: "Descubre los últimos modelos de Nike, donde tecnología y diseño se encuentran. ¡Encuentra el par perfecto!",
      link: "/category/nike",
    },
    {
      id: 2,
      title: "Adidas - Rendimiento y Comodidad",
      description: "Experimenta el máximo rendimiento con las zapatillas Adidas, diseñadas para los mejores atletas. ¡Compra ahora!",
      link: "/category/adidas",
    },
    {
      id: 3,
      title: "Vans - Auténtico Estilo Urbano",
      description: "Elige entre las clásicas Vans para un look casual y auténtico. ¡Atrévete a destacar con estilo!",
      link: "/category/vans",
    }
  ]

const CarouselTextBaner = () => {
    const router = useRouter()
    return ( 
    <div className="bg-gray-200 dark:bg-primary">
        <Carousel className="w-full max-w-4xl mx-auto"        
          plugins={[
                Autoplay({
                    delay:2500

                })
            ]} >
               <CarouselContent>
   
            {dataCarouselTop.map(({id , title , link , description})=>(

                <CarouselItem key={id} onClick={()=> router.push(link)} className="cursor-pointer">

                    <div> 
                        <Card className="shadow-none border-none bg-transparent">
                            <CardContent className="flex flex-col justify-center p-2 items-center text-center">
                                <p className="sm:text-lg text-wrap darl:text-secondary">{title}</p>
                                <p className="text-xsa sm:text-sm text-wrap dark:text-secondary">{description}</p>
                            </CardContent>
                        </Card>
                    </div>

                </CarouselItem>


            ))}

            </CarouselContent>
        </Carousel>

        

    </div>
    


    );
}
 
export default CarouselTextBaner;