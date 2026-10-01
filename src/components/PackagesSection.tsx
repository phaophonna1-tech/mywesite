import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, CheckCircle2, Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { SIGNATURE_PACKAGES } from '../data/destinations';

interface PackagesSectionProps {
  onSelectPackageForPlanner: (packageName: string) => void;
}

export function PackagesSection({ onSelectPackageForPlanner }: PackagesSectionProps) {
  const [activePackageId, setActivePackageId] = useState(SIGNATURE_PACKAGES[0].id);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const activePackage = SIGNATURE_PACKAGES.find((p) => p.id === activePackageId) || SIGNATURE_PACKAGES[0];

  const handleSelectPackage = (id: string) => {
    setActivePackageId(id);
    setSelectedDayIdx(0);
  };

  return (
    <section id="packages" className="py-24 px-6 md:px-10 bg-stone-900/40 border-y border-stone-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            Curated Indochina & Asia Grand Routes
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight mb-4">
            Signature Asian Journeys
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed">
            Multi-destination master itineraries engineered by our local DMC curators. Featuring VIP airport fast-track, private aircraft & yacht charters, and boutique heritage suites.
          </p>
        </div>

        {/* Package Selector Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-stone-900 border border-stone-800 rounded-xl overflow-x-auto max-w-full">
            {SIGNATURE_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handleSelectPackage(pkg.id)}
                className={`px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activePackageId === pkg.id
                    ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                }`}
              >
                {pkg.destinations[0]} & More
              </button>
            ))}
          </div>
        </div>

        {/* Active Package Showcase */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Package Overview & Day Switcher */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Meta details without pill badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 mb-3">
                  <span>{activePackage.duration}</span>
                  <span aria-hidden="true" className="text-stone-600">·</span>
                  <span>{activePackage.difficulty}</span>
                  <span aria-hidden="true" className="text-stone-600">·</span>
                  <span>Season: {activePackage.season}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                  {activePackage.title}
                </h3>
                <p className="text-sm text-stone-300 mb-8 leading-relaxed">
                  {activePackage.subtitle}
                </p>

                {/* Day-by-Day Interactive Selector */}
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
                  Day-by-Day Route Itinerary
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                  {activePackage.schedule.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDayIdx(idx)}
                      className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                        selectedDayIdx === idx
                          ? 'bg-stone-800 border-amber-400 text-white shadow-sm'
                          : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                      }`}
                    >
                      <span className="block text-[11px] font-mono font-semibold text-amber-400/90 mb-0.5">
                        {item.day}
                      </span>
                      <span className="block text-xs font-medium truncate text-stone-200">
                        {item.activity}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Day Detail Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activePackage.id}-${selectedDayIdx}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 bg-stone-950/80 border border-stone-800 rounded-xl mb-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-semibold text-amber-400">
                        {activePackage.schedule[selectedDayIdx].day}
                      </span>
                      <span className="text-xs text-stone-400">
                        Focus: {activePackage.schedule[selectedDayIdx].activity}
                      </span>
                    </div>
                    <h5 className="text-base font-semibold text-white mb-2">
                      {activePackage.schedule[selectedDayIdx].title}
                    </h5>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      {activePackage.schedule[selectedDayIdx].detail}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Waypoints traversed */}
              <div className="pt-4 border-t border-stone-800 flex items-center gap-2 text-xs text-stone-400">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Featured Stops: {activePackage.destinations.join(' → ')}</span>
              </div>
            </div>

            {/* Right Column: Pricing Breakdown & Customization Call */}
            <div className="lg:col-span-5 bg-stone-950/90 border border-stone-800 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-semibold text-stone-400 tracking-wider block mb-1">
                  Private Group Rate
                </span>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl sm:text-4xl font-mono font-bold text-white tabular-nums">
                    ${activePackage.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-stone-400">per person / all-inclusive</span>
                </div>

                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
                  Every Package Includes:
                </h4>
                <ul className="space-y-3 mb-8 text-xs sm:text-sm text-stone-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Private licensed English-speaking local master guides</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Hand-picked 5-star heritage chalets & boutique villas</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Private internal flights, chartered catamarans & rail</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Daily gourmet meals & private culinary masterclasses</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>24/7 dedicated in-country mobile concierge support</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => onSelectPackageForPlanner(activePackage.title)}
                  className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm glow-gold"
                >
                  <span>Customize This Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-[11px] text-stone-500">
                  Zero cancellation penalty up to 30 days prior to departure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
