import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ArrowRight, Bookmark, Compass } from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';
import { ScenicIllustration } from './ScenicIllustration';

interface ShortlistDrawerProps {
  isOpen: boolean;
  shortlist: string[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onPlanTrip: (firstDestinationId?: string) => void;
  onExplore: () => void;
}

export function ShortlistDrawer({
  isOpen,
  shortlist,
  onClose,
  onRemove,
  onPlanTrip,
  onExplore,
}: ShortlistDrawerProps) {
  if (!isOpen) return null;

  const savedDestinations = DESTINATIONS.filter((d) => shortlist.includes(d.id));
  const estimatedCombined = savedDestinations.reduce((acc, curr) => acc + curr.priceFrom, 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
        />

        {/* Slide-in Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative z-10 w-full max-w-md bg-stone-900 border-l border-stone-800 h-full flex flex-col justify-between shadow-2xl p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-400" />
              <h3 className="font-serif font-bold text-lg text-white">
                Saved Wishlist ({shortlist.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List or Empty State */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {savedDestinations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <Compass className="w-12 h-12 text-stone-700 mb-3" />
                <h4 className="font-serif text-lg font-bold text-white mb-1">
                  Your wishlist is empty
                </h4>
                <p className="text-xs text-stone-400 mb-6 leading-relaxed">
                  Bookmark destinations across our 2026 portfolios to compare routes and estimate private group rates.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onExplore();
                  }}
                  className="px-4 py-2 bg-amber-400 text-stone-950 text-xs font-bold rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  Explore Destinations
                </button>
              </div>
            ) : (
              savedDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="flex items-center gap-3 p-3 bg-stone-950 border border-stone-800 rounded-xl group hover:border-stone-700 transition-colors"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-stone-900">
                    <ScenicIllustration type={dest.heroSvgType} className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-white truncate">{dest.name}</h5>
                    <p className="text-[11px] text-stone-400 truncate">{dest.region}, {dest.country}</p>
                    <span className="font-mono text-xs font-bold text-amber-400 tabular-nums">
                      ${dest.priceFrom.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-stone-500"> / guest</span>
                  </div>
                  <button
                    onClick={() => onRemove(dest.id)}
                    className="p-2 text-stone-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                    aria-label={`Remove ${dest.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {savedDestinations.length > 0 && (
            <div className="pt-4 border-t border-stone-800 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-stone-400">
                  Combined Group Baseline
                </span>
                <span className="font-mono text-xl font-bold text-white tabular-nums">
                  ${estimatedCombined.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onPlanTrip(savedDestinations[0]?.id);
                }}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md glow-gold"
              >
                <span>Plan With Saved Destinations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
