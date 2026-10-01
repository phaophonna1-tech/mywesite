import { Shield, Sparkles, Trees, Eye, Compass, HeartHandshake } from 'lucide-react';

export function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="max-w-2xl mb-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
          The Asia Destination DMC Advantage
        </p>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight mb-4 text-balance">
          In-Destination Authority, Privileged Access & Flawless Logistics.
        </h2>
        <p className="text-sm text-stone-300 leading-relaxed">
          We bridge global travel partners and discerning travelers with authentic Asia. With wholly-owned regional operations hubs, licensed cultural masters, and direct relationships with heritage trusts, we turn complex journeys into seamless memories.
        </p>
      </div>

      {/* Asymmetric Bento Grid with Editorial Numbering */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Bento Card 1 (Span 7): Direct Ground Infrastructure */}
        <div className="md:col-span-7 bg-stone-900/60 border border-stone-800 rounded-2xl p-8 flex flex-col justify-between hover:border-stone-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs font-semibold text-amber-400 tracking-wider">
                01. Wholly-Owned DMC Ground Operations
              </span>
              <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center text-amber-400">
                <Compass className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-2xl font-serif font-bold text-white mb-3">
              Direct operations hubs across Tokyo, Bangkok, Siem Reap, Hanoi & Bali.
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed mb-6">
              We never outsource your travelers to unvetted third parties. From our own luxury Mercedes fleet and airport tarmac VIP greeters to round-the-clock crisis management, every minute on the ground is overseen by our resident operations directors.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stone-800">
            <div>
              <span className="block font-mono text-2xl font-bold text-white tabular-nums">24/7</span>
              <span className="text-xs text-stone-400">In-country concierge teams</span>
            </div>
            <div>
              <span className="block font-mono text-2xl font-bold text-amber-400 tabular-nums">5 Hubs</span>
              <span className="text-xs text-stone-400">Directly operated across Asia</span>
            </div>
          </div>
        </div>

        {/* Bento Card 2 (Span 5): Master Cultural Guides */}
        <div className="md:col-span-5 bg-stone-900/60 border border-stone-800 rounded-2xl p-8 flex flex-col justify-between hover:border-stone-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs font-semibold text-amber-400 tracking-wider">
                02. Cultural Authorities
              </span>
              <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center text-amber-400">
                <Eye className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-xl font-serif font-bold text-white mb-3">
              Guides with 15+ years field immersion.
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              From temple epigraphers at Angkor and senior Geiko cultural masters in Kyoto to Buddhist monks in Bhutan, our private guides are recognized authorities, not script readers.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-800 text-xs text-stone-400">
            Avg. guide tenure: <span className="text-white font-medium">16.8 years</span>
          </div>
        </div>

        {/* Bento Card 3 (Span 5): Net B2B & Wholesale Direct Rates */}
        <div className="md:col-span-5 bg-stone-900/60 border border-stone-800 rounded-2xl p-8 flex flex-col justify-between hover:border-stone-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs font-semibold text-amber-400 tracking-wider">
                03. Wholesale DMC Purchasing
              </span>
              <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-xl font-serif font-bold text-white mb-3">
              Direct contracts with top luxury hotels & private charters.
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              Leverage our long-standing relationships with Aman, Capella, Rosewood, and private Phinisi yachts across Asia. We provide competitive net rates, room upgrades, and priority confirmations.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-800 text-xs text-stone-400">
            Rapid turnaround on customized B2B proposals.
          </div>
        </div>

        {/* Bento Card 4 (Span 7): Community & Heritage Fund */}
        <div className="md:col-span-7 bg-stone-900/60 border border-stone-800 rounded-2xl p-8 flex flex-col justify-between hover:border-stone-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs font-semibold text-amber-400 tracking-wider">
                04. Heritage Preservation & Community Grants
              </span>
              <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center text-amber-400">
                <Trees className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-2xl font-serif font-bold text-white mb-3">
              Direct endowments to local Asian heritage artisans & conservation trusts.
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed mb-6">
              We invest in preserving Khmer stone-carving guilds in Siem Reap, clean water filtration for Tonle Sap stilted villages, and coral nursery sanctuaries in Komodo. Your travelers leave a legacy of cultural respect.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stone-800">
            <div>
              <span className="block font-mono text-2xl font-bold text-white tabular-nums">$620k+</span>
              <span className="text-xs text-stone-400">Invested in Asian heritage trusts</span>
            </div>
            <div>
              <span className="block font-mono text-2xl font-bold text-amber-400 tabular-nums">48</span>
              <span className="text-xs text-stone-400">Village artisan guilds supported</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
