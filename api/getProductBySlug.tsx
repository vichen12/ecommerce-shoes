import { useEffect, useState } from "react";
export function useGetProductBySlug(slug:string | string[]){
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`;
    const [result, setResult] = useState(null); // Inicializa como null
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                const json = await res.json();
                console.log("API Response:", json); // Verifica la respuesta
                // Asegúrate de que json.data sea del tipo ResultfilterTypes
                setResult(json.data || null); // Asigna null si no hay datos
            } catch (error: any) { // Utiliza any para manejar tipos de error
                setError(error.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        })();
    }, [url]);

    return { result, loading, error };
}