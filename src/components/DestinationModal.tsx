import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Calendar, Users, MapPin, Clock, ArrowRight, Bookmark } from 'lucide-react';
import { Destination } from '../types';
import { ScenicIllustration } from './ScenicIllustration';

interface DestinationModalProps {
  destination: Destination | null;
  isSaved: boolean;
  onClose: () => void;
  onToggleShortlist: (id: string) => void;
  onSelectForPlanner: (destinationId: string) => void;
}

export function DestinationModal({
  destination,
  isSaved,
  onClose,
  onToggleShortlist,
  onSelectForPlanner,
}: DestinationModalProps) {
  if (!destination) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative z-10 bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Hero Header with Scenic Illustration */}
          <div className="relative h-60 sm:h-72 overflow-hidden bg-stone-950">
            <ScenicIllustration type={destination.heroSvgType} className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-black/30 pointer-events-none" />

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => onToggleShortlist(destination.id)}
                className={`p-2.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                  isSaved ? 'bg-amber-400 text-stone-950' : 'bg-stone-950/70 text-stone-200 hover:text-white'
                }`}
                aria-label="Save to wishlist"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-stone-950' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-stone-950/70 hover:bg-stone-950 text-stone-200 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title Over Scrim */}
            <div className="absolute bottom-4 left-6 right-6">
              <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
                {destination.region}, {destination.country}
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                {destination.name}
              </h2>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Meta Row (Zero-Pill discipline) */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 py-3 px-4 bg-stone-950/70 rounded-xl border border-stone-800">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{destination.duration} Expedition</span>
              </div>
              <span className="text-stone-600">·</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Best Window: {destination.bestSeason}</span>
              </div>
              <span className="text-stone-600">·</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span>{destination.groupSize}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Expedition Overview
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                {destination.description}
              </p>
            </div>

            {/* Highlights */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-3">
                Curated Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {destination.highlights.map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-950/50 border border-stone-800/80 text-xs sm:text-sm text-stone-300">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Day-by-Day Detailed Itinerary */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4">
                Detailed Itinerary
              </h3>
              <div className="space-y-4">
                {destination.itinerary.map((day) => (
                  <div key={day.day} className="flex gap-4 items-start pb-4 border-b border-stone-800/60 last:border-0">
                    <div className="w-16 shrink-0 font-mono text-xs font-bold text-amber-400 pt-0.5">
                      Day 0{day.day}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">{day.title}</h4>
                      <p className="text-xs text-stone-400 leading-relaxed">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-3">
                All-Inclusive Inclusions
              </h3>
              <ul className="space-y-2 text-xs text-stone-300">
                {destination.included.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Action Bar */}
            <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 block">
                  All-Inclusive Group Rate
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-mono font-bold text-white tabular-nums">
                    ${destination.priceFrom.toLocaleString()}
                  </span>
                  <span className="text-xs text-stone-400">/ person</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="w-1/2 sm:w-auto px-5 py-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onSelectForPlanner(destination.id);
                  }}
                  className="w-1/2 sm:w-auto px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md glow-gold"
                >
                  <span>Customize This Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
