export type Product = {
  id: string;
  cardId?: string;
  productSlug?: string;
  detailPath?: string;
  selectedColorId?: number;
  selectedSizeId?: number;
  categoryId?: number;
  name: string;
  price: number;
  original: number;
  images: { primary: string; hover: string };
  tag?: "NEW" | "HOT" | "";
  isActive?: boolean;
  isAvailable?: boolean;
};
