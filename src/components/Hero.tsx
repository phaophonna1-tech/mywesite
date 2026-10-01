import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, ArrowRight, Compass, Calendar, MapPin, Sparkles } from 'lucide-react';
import { ScenicIllustration } from './ScenicIllustration';
import { Destination } from '../types';

interface HeroProps {
  onExploreDestinations: () => void;
  onWatchVideo: () => void;
  onSelectPolaroid: (destinationId: string) => void;
  onQuickSearch: (destinationName: string, season: string) => void;
}

export function Hero({
  onExploreDestinations,
  onWatchVideo,
  onSelectPolaroid,
  onQuickSearch,
}: HeroProps) {
  const [searchDestination, setSearchDestination] = useState('');
  const [searchSeason, setSearchSeason] = useState('any');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSearch(searchDestination, searchSeason);
  };

  return (
    <section className="relative min-h-[95vh] pt-28 pb-16 flex flex-col justify-between overflow-hidden bg-stone-950">
      {/* Dynamic Background Scenic Carrier */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <ScenicIllustration type="hero" className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Typography & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 max-w-2xl"
          >
            {/* Editorial Kicker (Quiet unboxed text) */}
            <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-amber-400 mb-4 tracking-wide uppercase">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Asia's Premier Inbound Destination Management Specialist</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif font-extrabold text-white tracking-tight leading-[1.08] mb-6 text-balance">
              Exceptional Inbound Expeditions Across Asia.
            </h1>

            {/* Value Proposition */}
            <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed mb-8 max-w-xl">
              As Asia’s premier Destination Management Company (DMC), we engineer bespoke luxury journeys, VIP ground logistics, private charters, and privileged cultural access across Southeast Asia, Japan, Indochina, and the Himalayas.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onExploreDestinations}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm rounded-lg transition-all duration-200 flex items-center gap-2 glow-gold cursor-pointer"
              >
                <span>Explore Asian Portfolios</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onWatchVideo}
                className="px-5 py-3.5 bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700/80 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2.5 backdrop-blur-sm cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-amber-400 translate-x-[1px]" />
                </div>
                <span>Watch Asia DMC Reel</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Floating Interactive Polaroids */}
          <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
            <div className="relative w-[340px] sm:w-[380px] h-[400px]">
              {/* Polaroid 1: Angkor Wat */}
              <motion.div
                initial={{ opacity: 0, x: 40, rotate: -8 }}
                animate={{ opacity: 1, x: 0, rotate: -8 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                whileHover={{ scale: 1.06, rotate: -2, zIndex: 30 }}
                onClick={() => onSelectPolaroid('angkor')}
                className="absolute left-2 top-4 w-52 sm:w-56 bg-stone-100 p-2.5 pb-4 rounded-sm shadow-2xl transition-shadow cursor-pointer select-none border border-stone-200 hover:shadow-amber-500/20"
              >
                {/* Pin visual */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-700 shadow-md border border-amber-500" />
                <div className="w-full h-36 rounded-xs overflow-hidden mb-2">
                  <ScenicIllustration type="angkor" className="w-full h-full" />
                </div>
                <div className="px-1 text-center">
                  <p className="font-serif italic text-stone-900 text-sm font-semibold">Angkor, Cambodia</p>
                  <p className="text-[11px] text-stone-500">Dawn Lotus Temple Access</p>
                </div>
              </motion.div>

              {/* Polaroid 2: Kyoto */}
              <motion.div
                initial={{ opacity: 0, x: 50, rotate: 6 }}
                animate={{ opacity: 1, x: 0, rotate: 6 }}
                transition={{ duration: 0.9, delay: 0.35 }}
                whileHover={{ scale: 1.06, rotate: 1, zIndex: 30 }}
                onClick={() => onSelectPolaroid('kyoto')}
                className="absolute right-0 top-12 w-52 sm:w-56 bg-stone-100 p-2.5 pb-4 rounded-sm shadow-2xl transition-shadow cursor-pointer select-none border border-stone-200 hover:shadow-amber-500/20"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-700 shadow-md border border-rose-400" />
                <div className="w-full h-36 rounded-xs overflow-hidden mb-2">
                  <ScenicIllustration type="bamboo" className="w-full h-full" />
                </div>
                <div className="px-1 text-center">
                  <p className="font-serif italic text-stone-900 text-sm font-semibold">Kyoto, Japan</p>
                  <p className="text-[11px] text-stone-500">Zen Sanctuaries & Ryokans</p>
                </div>
              </motion.div>

              {/* Polaroid 3: Halong Bay */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: -2 }}
                transition={{ duration: 0.9, delay: 0.5 }}
                whileHover={{ scale: 1.06, rotate: 0, zIndex: 30 }}
                onClick={() => onSelectPolaroid('halong')}
                className="absolute left-14 bottom-2 w-52 sm:w-56 bg-stone-100 p-2.5 pb-4 rounded-sm shadow-2xl transition-shadow cursor-pointer select-none border border-stone-200 hover:shadow-amber-500/20"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-teal-700 shadow-md border border-teal-400" />
                <div className="w-full h-36 rounded-xs overflow-hidden mb-2">
                  <ScenicIllustration type="halong" className="w-full h-full" />
                </div>
                <div className="px-1 text-center">
                  <p className="font-serif italic text-stone-900 text-sm font-semibold">Halong Bay, Vietnam</p>
                  <p className="text-[11px] text-stone-500">Private Karst Junk Cruise</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating Quick Discovery Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-xl p-4 sm:p-5 shadow-2xl max-w-4xl"
        >
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            {/* Destination Input */}
            <div className="relative">
              <label htmlFor="hero-dest" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                Destination
              </label>
              <div className="flex items-center gap-2 bg-stone-950/80 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 focus-within:border-amber-400 transition-colors">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <input
                  id="hero-dest"
                  type="text"
                  placeholder="e.g. Angkor, Kyoto, Halong, Bali, Bhutan"
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 outline-none"
                />
              </div>
            </div>

            {/* Travel Season Dropdown */}
            <div className="relative">
              <label htmlFor="hero-season" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                Travel Season
              </label>
              <div className="flex items-center gap-2 bg-stone-950/80 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 focus-within:border-amber-400 transition-colors">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <select
                  id="hero-season"
                  value={searchSeason}
                  onChange={(e) => setSearchSeason(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-stone-100 outline-none cursor-pointer"
                >
                  <option value="any" className="bg-stone-900 text-stone-100">Any Travel Window</option>
                  <option value="spring" className="bg-stone-900 text-stone-100">Spring (Apr – Jun)</option>
                  <option value="summer" className="bg-stone-900 text-stone-100">Summer (Jul – Sep)</option>
                  <option value="autumn" className="bg-stone-900 text-stone-100">Autumn (Oct – Dec)</option>
                  <option value="winter" className="bg-stone-900 text-stone-100">Winter (Jan – Mar)</option>
                </select>
              </div>
            </div>

            {/* Submit button */}
            <div className="sm:self-end pt-1 sm:pt-0">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Find Expeditions</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
