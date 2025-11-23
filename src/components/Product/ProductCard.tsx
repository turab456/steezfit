import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../contexts/WishlistContext";
import type { Product } from "./types";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return CURRENCY_FORMATTER.format(value);
}

function ProductCard({ p }: { p: Product }) {
  const isOutOfStock = p.isAvailable === false || p.isActive === false;
  const originalPrice =
    typeof p.original === "number" && p.original > 0 ? p.original : undefined;
  const basePrice = originalPrice ?? p.price;
  const hasDiscount =
    typeof originalPrice === "number" && originalPrice > p.price;
  const discount = hasDiscount
    ? Math.round(100 - (p.price / (originalPrice ?? 1)) * 100)
    : 0;
  const displayPrice = hasDiscount ? p.price : basePrice;
  const { contains, toggleWishlist } = useWishlist();
  const detailPath = p.detailPath ?? `/product/${p.productSlug ?? p.id}`;
  const wishlistId = p.productSlug ?? p.id;
  const isWishlisted = contains(wishlistId);
  const cardClassName = [
    "group relative flex h-full flex-col overflow-hidden rounded-md sm:rounded-[8x] bg-white text-zinc-900 shadow-md shadow-zinc-900/5 ring-1 ring-zinc-200 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl",
    isOutOfStock ? "opacity-80" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClassName}>
      <Link
        to={detailPath}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-zinc-100 focus:outline-none"
      >
        <span className="absolute inset-0 transition duration-700 ease-out group-hover:scale-[1.03]">
          <img
            src={p.images.primary}
            alt={p.name}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out group-hover:opacity-0"
            loading="lazy"
          />
          <img
            src={p.images.hover}
            alt={`${p.name} alternate view`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
            loading="lazy"
          />
        </span>

        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent opacity-70 transition-opacity duration-500 sm:opacity-0 sm:group-hover:opacity-90" />

        {isOutOfStock && (
          <span className="pointer-events-none absolute inset-0 bg-white/55" />
        )}

        

        <button
          type="button"
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 inline-flex items-center justify-center rounded-full bg-white/95 p-2 shadow-md shadow-black/10 transition hover:bg-white hover:shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleWishlist(wishlistId);
          }}
        >
          <Heart
            className={`h-4 w-4 ${isWishlisted ? "text-red-500" : "text-zinc-900"}`}
          />
        </button>

        <span className="absolute inset-x-3 bottom-3 hidden items-center justify-center rounded-2xl bg-black/82 py-3 text-[11px] font-semibold uppercase tracking-[0.4em] text-white transition-transform duration-300 ease-out sm:flex sm:translate-y-6 sm:group-hover:translate-y-0">
          {isOutOfStock ? "Out of stock" : "View product"}
        </span>

        {isOutOfStock && (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-black/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="line-clamp-2 text-sm font-semibold leading-relaxed text-zinc-800 sm:text-base">
          {p.name}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-base font-semibold sm:text-lg ${isOutOfStock ? "text-zinc-400" : "text-zinc-900"}`}
            >
              {formatCurrency(displayPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xs text-zinc-500 line-through">
                  {formatCurrency(basePrice)}
                </span>
                <span className="text-[11px] font-semibold text-red-600">-{discount}%</span>
              </>
            )}
          </div>

          {isOutOfStock && (
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export { ProductCard };
