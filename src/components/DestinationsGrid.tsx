import { useState } from 'react';
import { motion } from 'motion/react';
import { Bookmark, Star, ArrowUpRight, Clock, Users, Calendar, Sparkles } from 'lucide-react';
import { Destination } from '../types';
import { ScenicIllustration } from './ScenicIllustration';

interface DestinationsGridProps {
  destinations: Destination[];
  shortlist: string[];
  onToggleShortlist: (id: string) => void;
  onSelectDestination: (destination: Destination) => void;
  onPlanForDestination: (destinationId: string) => void;
}

export function DestinationsGrid({
  destinations,
  shortlist,
  onToggleShortlist,
  onSelectDestination,
  onPlanForDestination,
}: DestinationsGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Expeditions' },
    { id: 'coastal', label: 'Coastal & Lagoons' },
    { id: 'alpine', label: 'Alpine Peaks' },
    { id: 'cultural', label: 'Sacred & Cultural' },
    { id: 'wildlife', label: 'Wild Safaris' },
  ];

  const filteredDestinations = activeCategory === 'all'
    ? destinations
    : destinations.filter((d) => d.category === activeCategory);

  return (
    <section id="destinations" className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
      {/* Header and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            Curated 2026 Portfolios
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Hand-Crafted Expeditions
          </h2>
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-900 border border-stone-800 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDestinations.map((dest, idx) => {
          const isSaved = shortlist.includes(dest.id);

          return (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group bg-stone-900/60 border border-stone-800/80 rounded-xl overflow-hidden hover:border-stone-700 transition-all duration-300 flex flex-col justify-between glow-card"
            >
              {/* Media Container with Zero-Broken-Image Scenic Fallback */}
              <div className="relative h-64 overflow-hidden bg-stone-950">
                <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out">
                  <ScenicIllustration type={dest.heroSvgType} className="w-full h-full" />
                </div>

                {/* Subtle gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-black/30 pointer-events-none" />

                {/* Wishlist toggle button */}
                <button
                  onClick={() => onToggleShortlist(dest.id)}
                  aria-label={isSaved ? `Remove ${dest.name} from wishlist` : `Save ${dest.name} to wishlist`}
                  className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
                    isSaved
                      ? 'bg-amber-400 text-stone-950 shadow-lg'
                      : 'bg-stone-900/70 text-stone-200 hover:text-white hover:bg-stone-900'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-stone-950' : ''}`} />
                </button>

                {/* Rating display */}
                <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-stone-200 bg-stone-950/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-stone-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-mono font-medium tabular-nums">{dest.rating}</span>
                  <span className="text-stone-400">({dest.reviewsCount})</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  {/* Clean unboxed metadata with separators (Strict Zero-Pill discipline) */}
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
                    <span>{dest.country}</span>
                    <span aria-hidden="true" className="text-stone-600">·</span>
                    <span>{dest.duration}</span>
                    <span aria-hidden="true" className="text-stone-600">·</span>
                    <span>{dest.groupSize}</span>
                  </div>

                  {/* Primary Title */}
                  <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {dest.name}
                  </h3>

                  {/* Concise description */}
                  <p className="text-xs text-stone-300 leading-relaxed line-clamp-2 mb-4">
                    {dest.tagline}
                  </p>

                  {/* Key Highlights list */}
                  <ul className="space-y-1.5 mb-6 text-xs text-stone-400">
                    {dest.highlights.slice(0, 2).map((hl, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span className="line-clamp-1">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer: Price & Primary Action */}
                <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-400 block uppercase tracking-wider">From</span>
                    <span className="text-lg font-mono font-bold text-white tabular-nums">
                      ${dest.priceFrom.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-stone-400"> / guest</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectDestination(dest)}
                      className="px-3.5 py-2 text-xs font-semibold text-stone-200 hover:text-white bg-stone-800 hover:bg-stone-700/80 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Itinerary</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onPlanForDestination(dest.id)}
                      className="px-3 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                      title="Plan custom trip for this destination"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
