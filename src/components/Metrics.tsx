import { ShieldCheck, MapPin, Award, HeartHandshake } from 'lucide-react';

export function Metrics() {
  const stats = [
    {
      icon: MapPin,
      number: '22+',
      label: 'Asian Destinations Covered',
      context: 'Across Southeast Asia, Japan, Indochina, and the Himalayan kingdoms',
    },
    {
      icon: Award,
      number: '18,400+',
      label: 'Guests Hosted Seamlessly',
      context: 'Curated for luxury private parties, family multi-gens, and executive retreats',
    },
    {
      icon: HeartHandshake,
      number: '450+',
      label: 'Global Agency Partners',
      context: 'Trusted DMC partner for Virtuoso, Signature, and luxury tour operators',
    },
    {
      icon: ShieldCheck,
      number: '100%',
      label: 'Licensed In-Country Teams',
      context: 'Direct local operation offices in Bangkok, Tokyo, Siem Reap, and Hanoi',
    },
  ];

  return (
    <section className="bg-stone-900 border-y border-stone-800/80 py-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-stone-800">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`pt-6 sm:pt-0 sm:px-6 flex flex-col justify-between group`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-stone-800/80 border border-stone-700/60 flex items-center justify-center text-amber-400 group-hover:border-amber-400/50 group-hover:bg-amber-400/10 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-mono text-3xl font-bold tracking-tight text-white tabular-nums">
                    {item.number}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-200 mb-1">
                    {item.label}
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {item.context}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
