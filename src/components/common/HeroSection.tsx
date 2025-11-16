import type { FC } from "react";
import { motion } from "framer-motion";

type HeroSectionProps = {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
};

const DEFAULT_BG =
  "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1600";

const fades = {
  initial: { opacity: 0, scale: 1.02 },
  animate: { opacity: 1, scale: 1 },
};

const HeroSection: FC<HeroSectionProps> = ({
  title,
  subtitle,
  backgroundImage = DEFAULT_BG,
}) => {
  return (
    // Wrapper adds left/right space with rounded corners
    <div className="mx-2 my-6 overflow-hidden rounded-[32px] bg-black/40 ring-1 ring-white/10 md:mx-8 lg:mx-6 xl:mx-8">
      <section
        className="relative w-full overflow-hidden bg-black text-white"
        aria-label="About us hero section"
      >
        {/* BACKGROUND image + overlay */}
        <div className="absolute inset-0">
          <motion.img
            key={backgroundImage}
            src={backgroundImage}
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover"
            variants={fades}
            initial="initial"
            animate="animate"
            fetchPriority="high"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/50 via-black/0 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[160px]" />
          <div className="pointer-events-none absolute bottom-10 right-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-[140px]" />
        </div>

        {/* CONTENT – centered title + subtitle */}
        <div className="relative mx-auto flex min-h-[64vh] items-center justify-center px-6 py-16 text-center sm:px-10 md:min-h-[72vh] lg:min-h-[82vh]">
          <div className="max-w-3xl space-y-6">
            <h1 className="mx-auto text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
              {title}
            </h1>

            {subtitle && (
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/85 md:text-base">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
