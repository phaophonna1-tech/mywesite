import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from 'lucide-react';
import { TESTIMONIALS } from '../data/destinations';

export function Testimonials() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[currentIdx];

  return (
    <section id="testimonials" className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            Verified Traveler Dispatches
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Memories of the Wild
          </h2>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            aria-label="Previous testimonial"
            className="w-10 h-10 rounded-full border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next testimonial"
            className="w-10 h-10 rounded-full border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Testimonial Active Card */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-8 sm:p-12 relative overflow-hidden">
        <Quote className="absolute right-8 bottom-6 w-24 h-24 text-stone-800/40 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 max-w-3xl"
          >
            {/* Star rating */}
            <div className="flex items-center gap-1 mb-6">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs text-stone-400 ml-2 font-mono">{current.highlight}</span>
            </div>

            {/* Quote body */}
            <blockquote className="text-lg sm:text-2xl font-serif font-normal text-stone-100 leading-relaxed mb-8">
              "{current.quote}"
            </blockquote>

            {/* Author Attribution */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-serif font-bold text-sm">
                {current.author.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{current.author}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-amber-400/90 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Verified Guest</span>
                  </div>
                </div>
                <div className="text-xs text-stone-400">
                  {current.location} · {current.trip} · {current.year}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots Pagination */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-stone-800/80">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setCurrentIdx(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentIdx === idx ? 'w-8 bg-amber-400' : 'w-2 bg-stone-700 hover:bg-stone-500'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
