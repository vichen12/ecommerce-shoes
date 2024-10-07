import FilterSize from "./filter-size";

type FilterControlsCategoryProps = {
    setFilterSize: (sizes: string[]) => void; 
}

const FilterControlsCategory = (props: FilterControlsCategoryProps) => {
    const { setFilterSize } = props;

    return ( 
        <div className="sm:w-[350px] sm:mt-5 p-6">
            <FilterSize setFilterSize={setFilterSize} />
        </div>
    );
}

export default FilterControlsCategory;
