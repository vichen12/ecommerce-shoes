import { PopoverContent, PopoverTrigger, Popover } from "@radix-ui/react-popover"
import { Menu} from "lucide-react"
import Link from "next/link"

const itemMenuMobile = () => {
    return ( 
        <Popover>
            <PopoverTrigger>
                <Menu/>
            </PopoverTrigger>
            <PopoverContent>
            <Link href="categories/adidas" className="block">Adidas</Link>
            <Link href="categories/Nike" className="block">Nike</Link>
            <Link href="categories/Vans" className="block">Vans</Link>

        </PopoverContent>
        </Popover>
     );
}
 
export default itemMenuMobile;