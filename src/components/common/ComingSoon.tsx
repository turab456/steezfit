import { Link } from "react-router-dom";
import { MoveLeft, Sparkles } from "lucide-react";

export default function ComingSoon() {
  return (
    <section className="flex min-h-[80vh] w-full flex-col items-center justify-center bg-white px-4 py-12 text-center">
      
      

      {/* Main Content */}
      <div className="max-w-xl space-y-6">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
          <Sparkles className="h-4 w-4" />
          <span>In The Works</span>
        </div>

        <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900 sm:text-6xl md:text-7xl">
          Coming Soon
        </h1>

        <p className="mx-auto max-w-md text-base leading-relaxed text-gray-500 sm:text-lg">
          We are currently crafting this collection to perfection. 
          Stay tuned for something exceptional.
        </p>

        {/* Action Button */}
        <div className="pt-8">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 rounded-full bg-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800 hover:px-10"
          >
            <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Shop
          </Link>
        </div>
      </div>

      {/* Footer / Decorative Line */}
      <div className="mt-20 flex w-full max-w-xs items-center justify-center gap-4 opacity-30">
        <div className="h-px w-full bg-gray-900"></div>
        <span className="text-xs uppercase tracking-widest">Aesthco</span>
        <div className="h-px w-full bg-gray-900"></div>
      </div>
    </section>
  );
}