import { motion } from "framer-motion";

/**
 * TaglineSplit
 * Reference match: left "DESIGNED FOR THE BOLD." in a solid black banner,
 * right side paragraph copy. Minimal black/white, fully responsive.
 *
 * Mobile (≤ md): stacked, centered.
 * Desktop (≥ md): two columns with vertical centering.
 */

export default function TaglineSplit({
  tagline = "DESIGNED FOR THE BOLD.",
}: {
  tagline?: string;
}) {
  return (
    <section className="mx-4 my-16 md:my-20 md:mx-8 lg:my-32 lg:mx-12 xl:mx-16">
      <div className="flex justify-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }}
          className="inline-block rounded-sm bg-black px-4 py-3 text-center text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          {tagline}
        </motion.h2>
      </div>
    </section>
  );
}