import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

/**
 * TestimonialsShowcase
 * Matches the reference: centered huge quote, blue stars rating, author name,
 * faint oversized background words, round shadowed nav arrows.
 *
 * Features
 * - Auto-rotating carousel (pause on hover)
 * - Left/Right pill buttons with soft shadows
 * - Smooth crossfade animation
 * - Fully responsive typography and layout
 */

export type Testimonial = {
  quote: string;
  author: string;
  rating?: number; // default 5
};

const DEMO: Testimonial[] = [
  {
    quote: "We bought 10 pieces and it is the best purchase ever!",
    author: "Jeanice Woodley",
    rating: 5,
  },
  {
    quote: "Quality is insane. Heavy, cozy, and it survives every wash.",
    author: "Rahul Deshmukh",
    rating: 5,
  },
  {
    quote: "Looks premium, feels premium. Shipping was lightning fast.",
    author: "Ava Lopez",
    rating: 5,
  },
];

function useAuto(length: number, delay = 5200) {
  const [i, setI] = useState(0);
  const paused = useRef(false);
  const t = useRef<number | null>(null);
  const next = () => setI((x) => (x + 1) % length);
  const prev = () => setI((x) => (x - 1 + length) % length);
  useEffect(() => {
    if (paused.current) return;
    if (t.current) clearInterval(t.current);
    t.current = window.setInterval(() => !paused.current && next(), delay);
    return () => {
      if (t.current) {
        clearInterval(t.current);
      }
    };
  }, [delay, length]);
  return {
    i,
    setI,
    next,
    prev,
    pause: () => (paused.current = true),
    resume: () => (paused.current = false),
  } as const;
}

export default function TestimonialsShowcase({
  items = DEMO,
  bgWord = "WHAT PEOPLE SAY",
}: {
  items?: Testimonial[];
  bgWord?: string;
}) {
  const { i, next, prev, pause, resume } = useAuto(items.length, 5400);
  const rating = items[i].rating ?? 5;

  return (
    <section
      className="relative mx-4 my-16 overflow-hidden rounded-xl bg-neutral-100 px-4 py-16 text-black ring-1 ring-black/10 md:mx-8 lg:mx-6 xl:mx-8"
      onMouseEnter={pause}
      onMouseLeave={resume}
      aria-label="Customer testimonials"
    >
      {/* Oversized background word */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[-1rem] flex select-none justify-center opacity-20">
        <div className="whitespace-nowrap text-[20vw] font-extrabold tracking-tight text-black/10 leading-none">
          {bgWord}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Stars */}
        <div className="mb-6 flex items-center justify-center gap-1 text-blue-600 md:mb-8">
          {Array.from({ length: rating }).map((_, k) => (
            <Star key={k} className="h-5 w-5 fill-current" />
          ))}
        </div>

        {/* Quote */}
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 12, scale: 0.995 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.5, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              y: -10,
              scale: 0.995,
              transition: { duration: 0.35, ease: "easeIn" },
            }}
            className="px-2"
          >
            <p className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-black/90 leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              &ldquo;{items[i].quote.toUpperCase()}&rdquo;
            </p>
            <footer className="mt-6 text-base text-black/70 md:mt-8">
              {items[i].author}
            </footer>
          </motion.blockquote>
        </AnimatePresence>

        {/* Navigation controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            aria-label="Previous testimonial"
            onClick={prev}
            className="rounded-full bg-white p-2 shadow-lg shadow-black/10 transition hover:shadow-xl"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {items.map((_, k) => (
              <button
                key={k}
                aria-label={`Go to slide ${k + 1}`}
                onClick={() => {
                  if (k !== i) {
                    pause();
                    setTimeout(() => resume(), 0);
                    return;
                  }
                }}
                className={`h-1.5 w-5 rounded-full transition ${
                  k === i ? "bg-black/60" : "bg-black/20 hover:bg-black/30"
                }`}
              />
            ))}
          </div>

          <button
            aria-label="Next testimonial"
            onClick={next}
            className="rounded-full bg-white p-2 shadow-lg shadow-black/10 transition hover:shadow-xl"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
