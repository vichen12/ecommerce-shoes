import {cn} from "@/lib/utils"


interface IconButtonProps{
    onClick: () => void,
    icon: React.ReactElement
    className?: string
}


const IconButton = (props:IconButtonProps) => {
    const {onClick, className} = props

    return ( 
        <button onClick={onClick} className={cn("rounded-full flex items-center bg-whiter border shadow-md p-2 hover:scale-110 transition",className)}>

        </button>
     );
}
 
export default IconButton;