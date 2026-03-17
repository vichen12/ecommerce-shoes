import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

export function useGetFeaturedProducts() {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[isFeature][$eq]=true&populate=*`;
    const [result, setResult] = useState<ProductType[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                const json = await res.json();
                setResult((json.data ?? []).filter(Boolean));
            } catch (error: any) {
                setError(error.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        })();
    }, [url]);

    return { result, loading, error };
}
