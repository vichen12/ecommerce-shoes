import { useEffect, useState } from "react";

export function useGetFeaturedProducts() {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[isFeature][$eq]=true&populate=*`;
    const [result, setResult] = useState([]);
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
                setResult(json.data || []);
            } catch (error) {
                setError(error.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        })();
    }, [url]);

    return { result, loading, error };
}
