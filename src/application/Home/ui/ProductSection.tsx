
import type { Product } from "../../../components/Product/types";
import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "../../../components/Product/ProductCard";

export function ProductSection({ 
  title, 
  items, 
  cta, 
  onCtaClick 
}: { 
  title: string; 
  items: Product[];
  cta?: string;
  onCtaClick?: () => void;
}) {
  return (
    <section className="mx-4 my-12 md:my-16 lg:my-12  md:mx-8 lg:mx-6 xl:mx-8">
      <SectionHeader title={title} cta={cta} onClick={onCtaClick}>
        <div
          className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
          role="list"
        >
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </SectionHeader>
    </section>
  );
}
