export type ProductType = {
    id: number;
    attributes: {
      productName: string;
      slug: string;
      description: string;
      active: boolean;
      isFeature: boolean;
      price: number;
      size: number;
      stock: number;
      images: {
        data: {
          id: number;
          attributes: {
            url: string;
          };
        }[];
      };
      category: {
        data: {
          attributes: {
            slug: string;
            categoryName: string;
          };
        };
      };
    };
  };
  