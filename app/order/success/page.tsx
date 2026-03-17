import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
            <div className="text-6xl">✅</div>
            <h1 className="text-3xl font-bold">¡Pago exitoso!</h1>
            <p className="text-muted-foreground text-lg">Gracias por tu compra. Recibirás un email de confirmación.</p>
            <Link href="/">
                <Button>Volver a la tienda</Button>
            </Link>
        </div>
    );
}
