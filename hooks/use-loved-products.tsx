import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from './use-toast';
import { ProductType } from '@/types/product';

interface UseLovedProductsType {
    lovedItems: ProductType[];
    addLoveItem: (data: ProductType) => void;
    removeLovedItem: (id: number) => void; // Cambia aquí
}

export const useLovedProducts = create(persist<UseLovedProductsType>((set, get) => ({
    lovedItems: [],
    addLoveItem: (data: ProductType) => {
        const currentLovedItems = get().lovedItems;
        const existingItem = currentLovedItems.find(item => item.id === data.id);
        if (existingItem) {
            return toast({
                title: "El producto ya existe en la lista 💕",
                variant: "destructive"
            });
        }
        set({
            lovedItems: [...currentLovedItems, data]
        });
        toast({
            title: `${data.attributes.productName} añadido a la lista 💓`
        });
    },
    removeLovedItem: (id: number) => { // Cambia aquí también
        set({
            lovedItems: get().lovedItems.filter(item => item.id !== id)
        });
        toast({
            title: "El producto se ha eliminado de la lista 💔"
        });
    }
}), {
    name: "love-product-storage",
    storage: createJSONStorage(() => localStorage)
}));
