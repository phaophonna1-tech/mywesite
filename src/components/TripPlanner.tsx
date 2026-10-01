import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Users, MapPin, Check, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';
import { BookingFormData } from '../types';

interface TripPlannerProps {
  selectedDestinationId?: string;
  onBookingSuccess: (confirmation: {
    code: string;
    destinationName: string;
    total: number;
    travelers: number;
    email: string;
  }) => void;
}

export function TripPlanner({ selectedDestinationId, onBookingSuccess }: TripPlannerProps) {
  const formId = useId();
  const [formData, setFormData] = useState<BookingFormData>({
    destinationId: selectedDestinationId || DESTINATIONS[0].id,
    travelDate: '2026-06-15',
    travelers: 2,
    travelStyle: 'Signature Luxury',
    durationDays: 8,
    name: '',
    email: '',
    notes: '',
    includePrivateGuide: true,
    includeCarbonOffset: true,
  });

  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync if selectedDestinationId changes from props
  const currentDest = DESTINATIONS.find((d) => d.id === formData.destinationId) || DESTINATIONS[0];

  // Dynamic price calculation
  const baseRate = currentDest.priceFrom;
  const styleMultiplier = formData.travelStyle === 'Ultra-Private Expedition' ? 1.45 : formData.travelStyle === 'Signature Luxury' ? 1.15 : 1.0;
  const guideAddon = formData.includePrivateGuide ? 450 : 0;
  const carbonAddon = formData.includeCarbonOffset ? 65 : 0;
  const perPersonEstimate = Math.round((baseRate * styleMultiplier) + guideAddon + carbonAddon);
  const totalEstimate = perPersonEstimate * formData.travelers;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; email?: string } = {};
    if (!formData.name.trim()) errors.name = 'Please provide your full name';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Please provide a valid email address';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedCode = `AD-DMC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      onBookingSuccess({
        code: generatedCode,
        destinationName: currentDest.name,
        total: totalEstimate,
        travelers: formData.travelers,
        email: formData.email,
      });
      // Reset sensitive fields
      setFormData((prev) => ({ ...prev, name: '', email: '', notes: '' }));
    }, 700);
  };

  return (
    <section id="planner" className="py-24 px-6 md:px-10 bg-gradient-to-b from-stone-900 to-stone-950 border-t border-stone-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            Tailor-Made DMC Proposal Generator
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight mb-4">
            Plan Your Asian Expedition
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed">
            Customize dates, travel rhythm, and luxury amenities. Receive an itemized B2B/B2C itinerary proposal curated by your dedicated DMC destination specialist within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Destination Selector */}
              <div>
                <label htmlFor={`${formId}-dest`} className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                  Destination Region
                </label>
                <div className="relative">
                  <select
                    id={`${formId}-dest`}
                    value={formData.destinationId}
                    onChange={(e) => setFormData({ ...formData, destinationId: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-100 text-sm focus:border-amber-400 outline-none cursor-pointer"
                  >
                    {DESTINATIONS.map((d) => (
                      <option key={d.id} value={d.id} className="bg-stone-900 text-white">
                        {d.name} ({d.country}) — From ${d.priceFrom.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Group Size and Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`${formId}-travelers`} className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                    Number of Guests
                  </label>
                  <select
                    id={`${formId}-travelers`}
                    value={formData.travelers}
                    onChange={(e) => setFormData({ ...formData, travelers: Number(e.target.value) })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-100 text-sm focus:border-amber-400 outline-none cursor-pointer"
                  >
                    <option value={1} className="bg-stone-900 text-white">1 Solo Traveler</option>
                    <option value={2} className="bg-stone-900 text-white">2 Guests (Couple / Pair)</option>
                    <option value={3} className="bg-stone-900 text-white">3 Guests</option>
                    <option value={4} className="bg-stone-900 text-white">4 Guests (Family / Small Party)</option>
                    <option value={6} className="bg-stone-900 text-white">6 Guests (Private Group)</option>
                    <option value={8} className="bg-stone-900 text-white">8 Guests (Full Villa Charter)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={`${formId}-date`} className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                    Preferred Start Date
                  </label>
                  <input
                    id={`${formId}-date`}
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-100 text-sm focus:border-amber-400 outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Travel Style Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                  Expedition Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(['Comfort', 'Signature Luxury', 'Ultra-Private Expedition'] as const).map((style) => (
                    <button
                      type="button"
                      key={style}
                      onClick={() => setFormData({ ...formData, travelStyle: style })}
                      className={`p-3 text-left rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                        formData.travelStyle === style
                          ? 'bg-amber-400/10 border-amber-400 text-white font-semibold'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <span className="block text-stone-100 font-semibold mb-0.5">{style}</span>
                      <span className="text-[11px] text-stone-400">
                        {style === 'Comfort' && 'Boutique eco-chalets'}
                        {style === 'Signature Luxury' && '5★ suites & plunge pools'}
                        {style === 'Ultra-Private Expedition' && 'Exclusive private villas & heli'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Addons toggles */}
              <div className="space-y-2.5 pt-2">
                <label className="flex items-center gap-3 p-3 rounded-lg bg-stone-950 border border-stone-800 cursor-pointer hover:border-stone-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.includePrivateGuide}
                    onChange={(e) => setFormData({ ...formData, includePrivateGuide: e.target.checked })}
                    className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-stone-200">
                    Dedicated Private English Master Guide (+$450/trip)
                  </span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg bg-stone-950 border border-stone-800 cursor-pointer hover:border-stone-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.includeCarbonOffset}
                    onChange={(e) => setFormData({ ...formData, includeCarbonOffset: e.target.checked })}
                    className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-stone-200">
                    Verified Gold Standard Carbon Offset + Local Trust Endowment (+$65/person)
                  </span>
                </label>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label htmlFor={`${formId}-name`} className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    id={`${formId}-name`}
                    type="text"
                    placeholder="e.g. Eleanor Roosevelt"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full bg-stone-950 border rounded-lg p-3 text-stone-100 text-sm outline-none ${
                      formErrors.name ? 'border-rose-500' : 'border-stone-800 focus:border-amber-400'
                    }`}
                  />
                  {formErrors.name && (
                    <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.name}</span>
                  )}
                </div>

                <div>
                  <label htmlFor={`${formId}-email`} className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    id={`${formId}-email`}
                    type="email"
                    placeholder="e.g. eleanor@wanderlust.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full bg-stone-950 border rounded-lg p-3 text-stone-100 text-sm outline-none ${
                      formErrors.email ? 'border-rose-500' : 'border-stone-800 focus:border-amber-400'
                    }`}
                  />
                  {formErrors.email && (
                    <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.email}</span>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label htmlFor={`${formId}-notes`} className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Specific Desires or Dietary Preferences (Optional)
                </label>
                <textarea
                  id={`${formId}-notes`}
                  rows={2}
                  placeholder="Tell us about special occasions, preferred pace, or mobility requirements..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-100 text-sm focus:border-amber-400 outline-none resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-stone-950 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg glow-gold"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    Generating Custom Proposal...
                  </span>
                ) : (
                  <span>Request Custom Itinerary & Guaranteed Rate →</span>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Live Price & Valuation Summary */}
          <div className="lg:col-span-5 bg-stone-950 border border-stone-800 rounded-2xl p-6 sm:p-8 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
                Live Itinerary Estimate
              </span>
              <span className="text-xs text-stone-400">{currentDest.duration} Journey</span>
            </div>

            <div className="py-6 border-b border-stone-800">
              <h3 className="text-xl font-serif font-bold text-white mb-1">
                {currentDest.name}
              </h3>
              <p className="text-xs text-stone-400 mb-6">
                {currentDest.region}, {currentDest.country}
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-stone-300">
                <div className="flex justify-between">
                  <span className="text-stone-400">Base Expedition Rate:</span>
                  <span className="font-mono tabular-nums text-white">${baseRate.toLocaleString()} / guest</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Tier Adjustment ({formData.travelStyle}):</span>
                  <span className="font-mono tabular-nums text-white">
                    {styleMultiplier > 1 ? `+${Math.round((styleMultiplier - 1) * 100)}%` : 'Included'}
                  </span>
                </div>
                {formData.includePrivateGuide && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">Personal Master Guide:</span>
                    <span className="font-mono tabular-nums text-white">+$450</span>
                  </div>
                )}
                {formData.includeCarbonOffset && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">Carbon & Wildlife Trust:</span>
                    <span className="font-mono tabular-nums text-white">+${carbonAddon * formData.travelers}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Total Highlight */}
            <div className="py-6 border-b border-stone-800">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                  Total Estimated Investment ({formData.travelers} {formData.travelers === 1 ? 'Guest' : 'Guests'})
                </span>
                <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 tabular-nums">
                  ${totalEstimate.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Includes all transfers, permits, accommodations & listed meals. No hidden taxes.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-stone-400">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Complimentary 100% refund window for 48 hours post-booking</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-stone-400">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Expedition director response within 24 business hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
