"use client"
import { Heart, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import MenuList from "./menu-list";
import ItemsMenuMobile from "./items-menu-mobile";
import ToggleTheme from './toggle-theme';


const Navbar = () => {
    const router=useRouter()


    return ( 
        <div className="flex item-center justify-between p-4 mx-auto cursor-pointer sm:max-w-4xl md:max-w-6xl " >
            <h1 className="text-3xl" onClick={()=>router.push("/")}>LUXE<span className="font-bold">SHOES</span></h1>
            <div className="item-center justify-between hidden sm:flex">
                <MenuList/>
            </div>
            <div className="flex sm:hidden">
                <ItemsMenuMobile/>
            </div>
            <div className="flex justift-between items-center gap-2 sm:gap-7">
                <ShoppingCart strokeWidth="1" className="cursor-pointer"
                 onClick={()=>router.push("/cart")}>
                </ShoppingCart>
                <Heart strokeWidth="1" className="cursor-pointer"
                onClick={()=>router.push("/loved-products")}>
                </Heart>
                <User strokeWidth="1" 
                className="cursor-pointer" 
                onClick={()=>router.push("/loved-products")} />
                <ToggleTheme/>
            </div>
        </div>
     );
}
 
export default Navbar;