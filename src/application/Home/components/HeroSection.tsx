import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/**
 * HERO — Full-bleed background inside a rounded container with left/right space
 * Centered headline/subtext/CTA, bullet-only navigation
 * TSX + Tailwind + framer-motion + lucide-react
 */

const BG_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1072",
    alt: "Streetwear hoodies in city",
  },
  {
    src: "https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
    alt: "Minimal black hoodie flat lay",
  },
  {
    src: "https://images.unsplash.com/photo-1732257119998-b66cda63dcfc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1330",
    alt: "Monochrome hoodie on model",
  },
];

function useAutoRotate(length: number, delay = 3000) {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);
  const timer = useRef<number | null>(null);

  const goTo = (i: number) => setIndex((i + length) % length);
  const next = () => setIndex((i) => (i + 1) % length);

  useEffect(() => {
    if (paused.current) return;
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      if (!paused.current) next();
    }, delay);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [delay, length]);

  return {
    index,
    setIndex: goTo,
    pause: () => (paused.current = true),
    resume: () => (paused.current = false),
  } as const;
}

export default function HoodiesHeroCentered() {
  const { index, setIndex, pause, resume } = useAutoRotate(
    BG_IMAGES.length,
    5200
  );

  const fades = useMemo(
    () => ({
      initial: { opacity: 0, scale: 1.02 },
      animate: {
        opacity: 1,
        scale: 1,
        // transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
      },
      exit: {
        opacity: 0,
        scale: 0.98,
        // transition: { duration: 0.7, ease: [0.42, 0, 1, 1] },
      },
    }),
    []
  );

  return (
    // Wrapper adds left/right space with rounded corners
    <div className="mx-2 my-6 overflow-hidden rounded-[32px] bg-black/40 ring-1 ring-white/10 md:mx-8 lg:mx-6 xl:mx-8">
      <section
        className="relative w-full overflow-hidden bg-black text-white"
        onMouseEnter={pause}
        onMouseLeave={resume}
        aria-label="Hero Section"
      >
        {/* BACKGROUND image + uniform overlay (no watermark/shadow text) */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={BG_IMAGES[index].src}
              src={BG_IMAGES[index].src}
              alt={BG_IMAGES[index].alt}
              className="absolute inset-0 h-full w-full object-cover"
              variants={fades}
              initial="initial"
              animate="animate"
              exit="exit"
              fetchPriority="high"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/50 via-black/0 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[160px]" />
          <div className="pointer-events-none absolute bottom-10 right-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-[140px]" />
        </div>

        {/* CONTENT – fully centered */}
        <div className="relative mx-auto flex min-h-[64vh] items-center justify-center px-6 py-16 text-center sm:px-10 md:min-h-[72vh] lg:min-h-[82vh]">
          <div className="max-w-3xl space-y-8">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
              SS25 capsule drop
            </div>

            <h1 className="mx-auto text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
              Blockhaus Signatures
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70">
                25% off
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/85 md:text-base">
              Tailored essentials remastered for high frequency wear. Premium cotton blends,
              thermoregulating interiors, and sharp geometrics to anchor your city uniform.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#shop"
                className="group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white/95"
              >
                Explore
                <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#lookbook"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white/80 transition hover:-translate-y-0.5 hover:border-white hover:text-white"
              >
                Studio lookbook
              </a>
            </div>

           
          </div>
        </div>

        {/* BULLET NAV — centered bottom and inset from rounded edges */}
        <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 transform">
          <div className="flex items-center gap-2">
            {BG_IMAGES.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === index
                    ? "bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.35)]"
                    : "bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="sr-only">
          Auto-rotates every ~5s. Pause on hover. Use bullets to navigate.
        </div>
      </section>
    </div>
  );
}
