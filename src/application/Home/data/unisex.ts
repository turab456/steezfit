export type Product = {
  id: string;
  name: string;
  price: number; // offer/current
  original: number; // original
  images: { primary: string; hover: string };
  tag?: "NEW" | "HOT" | "";
};
// data/unisex.ts
export const unisex: Product[] = [
  {
    id: "uni-hoodie-core-black",
    name: "Core Hoodie — Black",
    price: 99,
    original: 159,
    images: {
      primary:
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
      hover:
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop#hover=1",
    },
    tag: "NEW",
  },
  {
    id: "uni-hoodie-fleece",
    name: "Fleece Hoodie",
    price: 119,
    original: 179,
    images: {
      primary:
        "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1200&auto=format&fit=crop",
      hover:
        "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1200&auto=format&fit=crop#hover=1",
    },
  },
];