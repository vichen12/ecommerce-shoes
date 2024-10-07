import { useGetProductField } from "@/api/useGetProductField"; 
import { Checkbox } from "@/components/ui/checkbox"; 
import { FilterTypes } from "../../../../types/filters";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type FilterSizeProps = {
    setFilterSize: (sizes: string[]) => void; 
}

const FilterSize = (props: FilterSizeProps) => {
    const { setFilterSize } = props;
    const { result, loading }: FilterTypes = useGetProductField();
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]); 

    const handleCheckboxChange = (size: string) => {
        const updatedSizes = selectedSizes.includes(size)
            ? selectedSizes.filter(s => s !== size)
            : [...selectedSizes, size];

        setSelectedSizes(updatedSizes);
        setFilterSize(updatedSizes)
    };

    return (
        <div className="my-5">
            <p className="mb-3 font-bold">Talla</p>
            {loading && result == null && (
                <p>Cargando talles...</p>
            )}
            {result != null && result.schema.attributes.size.enum.map((size: string) => (
                <div key={size} className="flex items-center space-x-2 mt-[5px]">
                    <Checkbox
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={() => handleCheckboxChange(size)}
                    />
                    <Label htmlFor={size}>{size}</Label>
                </div>
            ))}
        </div>
    );
}

export default FilterSize;
