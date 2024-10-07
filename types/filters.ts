export type FilterTypes = {
    result: ResultfilterTypes | null;
    loading: boolean;
    error: string;
};

export type ResultfilterTypes = {
    schema: {
        attributes: {
            size: {
                enum: string[];
            };
        };
    };
};
