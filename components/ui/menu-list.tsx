"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "ADIDAS",
    href: "/category/adidas",
    description:
      "Zapatillas de alto rendimiento con tecnología avanzada, diseñadas para brindarte comodidad y estilo en cada paso.",
  },
  {
    title: "NIKE",
    href: "/category/nike",
    description:
      "Innovación y estilo se unen en estas zapatillas, perfectas para quienes buscan el mejor rendimiento y diseño.",
  },
  {
    title: "VANS",
    href: "/category/vans",
    description:
    "Zapatillas urbanas con un toque clásico, ideales para quienes valoran el confort y el estilo en su día a día.",
  },
  
]

const  menuList =()=> {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Sobre nostros</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    
                    <div className="mb-2 mt-4 text-lg font-medium">
                      LUXESHOES
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Marca top del mercado internacional, ofreciendo la mejor calidad de zapatillas a los precios mas competitivos del mercado americano
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
                <ListItem 
                href="https://www.google.com/maps/place/Parque+Central/@-32.878079,-68.8409214,14.73z/data=!4m15!1m8!3m7!1s0x967e093ec45179bf:0x205a78f6d20efa3a!2sMendoza,+Capital,+Mendoza!3b1!8m2!3d-32.8894587!4d-68.8458386!16zL20vMDJtdHd0!3m5!1s0x967e08e446f5f2a7:0xd55596472c06ddc0!8m2!3d-32.8744949!4d-68.842445!16s%2Fg%2F11b7llsrhl?entry=ttu&g_ep=EgoyMDI0MDkzMC4wIKXMDSoASAFQAw%3D%3D" 
                title="Ubicación" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Nos ubicamos en ARG, MENDOZA
              </ListItem>

              <ListItem href="https://www.google.com/maps/place/Miami,+Florida,+EE.+UU./@25.7825389,-80.3118597,12z/data=!3m1!4b1!4m15!1m8!3m7!1s0x54eab584e432360b:0x1c3bb99243deb742!2sEstados+Unidos!3b1!8m2!3d38.7945952!4d-106.5348379!16zL20vMDljN3cw!3m5!1s0x88d9b0a20ec8c111:0xff96f271ddad4f65!8m2!3d25.7616798!4d-80.1917902!16zL20vMGYydjA?entry=ttu&g_ep=EgoyMDI0MDkzMC4wIKXMDSoASAFQAw%3D%3D" title="¿De donde son las Zapatillas?"
                target="_blank" 
                rel="noopener noreferrer">
               Las Zapatillas, las traemos de estados unidos, gracias a esto tienen un precio muy competitivo y la mejor calidad!
              </ListItem>
              <ListItem href="https://www.instagram.com/vichendallape/" title="Nuestro Instagram!"
              target="_blank" 
              rel="noopener noreferrer">
                El mejor Instagram de todos es de LUXE<span className="font-bold">SHOES</span>
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Zapatillas</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
             
             rel="noopener noreferrer"
             href="https://wa.me/542612071048?text=Hola%20LUXESHOES%20te%20hablo%20por%20las%20zapatillas!" 
             target="_blank" 
             legacyBehavior 
             passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Contactanos
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
export default menuList

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

