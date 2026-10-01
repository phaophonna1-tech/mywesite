import { useState } from 'react';
import { Send, Check, Phone, Mail, MapPin, Globe } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-300 pt-16 pb-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-stone-800/80">
          {/* Brand & Mission (Span 4) */}
          <div className="lg:col-span-4">
            <a href="#" className="font-serif font-bold text-2xl text-white block mb-4 uppercase">
              Asia Destination DMC
            </a>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-6 max-w-sm">
              Premier Inbound Destination Management Company (DMC) across Southeast Asia, Japan, Indochina, and the Himalayas. Delivering VIP ground logistics, bespoke luxury itineraries, and cultural conservation.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <Globe className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Currency Display:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-stone-900 border border-stone-800 text-stone-200 text-xs rounded px-2 py-1 outline-none cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="SGD">SGD (S$)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>

          {/* Quick Links (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Asian Portfolios
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><a href="#destinations" className="hover:text-amber-400 transition-colors">Angkor & Cambodia</a></li>
              <li><a href="#destinations" className="hover:text-amber-400 transition-colors">Kyoto & Japan Alps</a></li>
              <li><a href="#destinations" className="hover:text-amber-400 transition-colors">Halong & Vietnam</a></li>
              <li><a href="#destinations" className="hover:text-amber-400 transition-colors">Bali & Komodo</a></li>
              <li><a href="#destinations" className="hover:text-amber-400 transition-colors">Bhutan Kingdom</a></li>
            </ul>
          </div>

          {/* Company & Philosophy (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              DMC Services
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><a href="#why-us" className="hover:text-amber-400 transition-colors">Direct Ground Hubs</a></li>
              <li><a href="#why-us" className="hover:text-amber-400 transition-colors">B2B Net Purchasing</a></li>
              <li><a href="#packages" className="hover:text-amber-400 transition-colors">Indochina Grand Tours</a></li>
              <li><a href="#why-us" className="hover:text-amber-400 transition-colors">Heritage Grant Fund</a></li>
              <li><a href="#planner" className="hover:text-amber-400 transition-colors">DMC Proposal Engine</a></li>
            </ul>
          </div>

          {/* Concierge & Newsletter Dispatch (Span 4) */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-2">
              The Asia DMC Dispatch
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Exclusive agent route openings, festival dates, and field curator updates across Asia.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter travel advisor or guest email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-stone-900 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 w-full outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg text-xs transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                  title="Subscribe to dispatch"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {subscribed && (
              <div className="flex items-center gap-2 text-xs text-amber-400 mb-3 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Subscribed to Asia Destination DMC Dispatch.</span>
              </div>
            )}

            <div className="space-y-1.5 text-xs text-stone-400 pt-2 border-t border-stone-900">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span>Hubs: Bangkok · Tokyo · Siem Reap · Hanoi · Singapore</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                <span>Asia HQ: +66 (0) 2 849 9453</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                <span>DMC Proposals: dmc@asiadestination.travel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Legal Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} Asia Destination DMC Co., Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-stone-200 transition-colors">DMC Agency Terms</a>
            <span className="text-stone-700">·</span>
            <a href="#" className="hover:text-stone-200 transition-colors">Privacy Charter</a>
            <span className="text-stone-700">·</span>
            <a href="#" className="hover:text-stone-200 transition-colors">Asian Heritage Ethics</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
