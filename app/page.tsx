import CarouselTextBaner from "@/components/ui/carousel-text-baner";
import FeaturedProducts from '../components/feature-products';
import BannerDiscount from "@/components/ui/banner-discount";
import ChooseCategory from "@/components/ui/choose-category";
import BannerProduct from "@/components/banner-product";



export default function Home() {
  return (
    <main>
      <CarouselTextBaner/>
      <FeaturedProducts/>
      <BannerDiscount/>
      <ChooseCategory/>
      <BannerProduct/>
    </main>
   
  );
}
