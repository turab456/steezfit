
import type { Product } from "../../../components/Product/types";
import { SectionHeader } from "./SectionHeader";
import { ProductCard } from "../../../components/Product/ProductCard";

type ProductSectionProps = {
  title: string;
  items: Product[];
  cta?: string;
  onCtaClick?: () => void;
  className?: string;
};

export function ProductSection({
  title,
  items,
  cta,
  onCtaClick,
  className,
}: ProductSectionProps) {
  const containerClassName = [
    "mx-auto max-w-8xl px-4 sm:px-6 lg:px-12",
    className ?? "my-12 md:my-16 lg:my-12",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={containerClassName}>
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
