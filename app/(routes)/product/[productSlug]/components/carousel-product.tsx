import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface CarouselProductProps{
    images:{
        data:{
            id:number;
            attributes:{
                url:string
            }
        }[]
    }
}

const CarouselProduct = (props: CarouselProductProps) => {
    const{images} = props

    return ( <div className="sm:px-16">
        <Carousel>
            <CarouselContent>
                {images.data.map((image)=>(
                    <CarouselItem key={image.id}  className="rounded-lg max-w-[260px] h-[350px] object-cover object-center rounded-xl bg-white ">
                       <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.attributes.url}`}
                        alt="Image Product"
                        className="mt-[40px] "
                       
                       />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious/>
            <CarouselNext/>

        </Carousel>

    </div> );
}
 
export default CarouselProduct;