import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  cta?: string;
  onClick?: () => void;
  children?: ReactNode;
};


export function SectionHeader({
  title,
  subtitle = "Shop the Latest Styles: Stay ahead of the curve with our newest arrivals",
  eyebrow = "Featured drop",
  cta = "All products",
  onClick,
  children,
}: Props) {
  const hasChildren = Boolean(children);

  return (
    <div className="flex w-full flex-col gap-8 rounded-3xl bg-white/70 p-5 shadow-sm shadow-black/5 ring-1 ring-black/5 backdrop-blur md:p-8 lg:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
        <div className="flex flex-col gap-4 md:gap-5">
          {eyebrow && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-black/60">
              {eyebrow}
            </span>
          )}

          <div className="space-y-3 md:space-y-4">
            <h2 className="text-2xl font-black leading-tight tracking-tight text-black sm:text-3xl md:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="max-w-2xl text-sm leading-relaxed text-black/70 sm:text-base">
                {subtitle}
              </p>
            )}
          </div>

          {/* <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-black/40 md:hidden">
            {DEFAULT_BADGES.map((badge) => (
              <span key={badge} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-black/40" />
                {badge}
              </span>
            ))}
          </div> */}
        </div>

        <div className="flex w-full flex-col items-stretch gap-4 md:w-auto md:items-end md:text-right">
          {/* <div className="hidden text-xs uppercase tracking-[0.45em] text-black/40 md:flex md:flex-wrap md:justify-end md:gap-3">
            {DEFAULT_BADGES.map((badge) => (
              <span key={badge} className="flex items-center gap-2">
                <span className="h-[3px] w-[22px] rounded-full bg-black/30" />
                {badge}
              </span>
            ))}
          </div> */}

          {cta && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 md:text-base"
            >
              {cta}
              <ArrowUpRight className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>

      {hasChildren && (
        <div className="p-4  sm:p-5 md:p-6">
          {children}
        </div>
      )}
    </div>
  );
}
