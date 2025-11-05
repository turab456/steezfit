export type Product = {
  id: string;
  name: string;
  price: number;
  original: number;
  images: { primary: string; hover: string };
  tag?: "NEW" | "HOT" | "";
};