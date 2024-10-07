export type ProductType = {
    id: number;
    Attributes: {
      productName: string;
      slug: string;
      description: string;
      active: boolean;
      isFeature: boolean;
      price: number;
      size: number;
      stock: number;
      image: {
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
  