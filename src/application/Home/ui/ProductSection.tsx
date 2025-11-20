
import type { Product } from "../../../components/Product/types";
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
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10 mb-8">
        <div className="flex flex-col gap-4 md:gap-5">
          <h2 className="text-2xl font-black leading-tight tracking-tight text-black sm:text-3xl md:text-4xl">
            {title}
          </h2>
        </div>
        {cta && (
          <button
            type="button"
            onClick={onCtaClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 md:text-base"
          >
            {cta}
          </button>
        )}
      </div>
      
      {/* Product Cards */}
      <div
        className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
        role="list"
      >
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
