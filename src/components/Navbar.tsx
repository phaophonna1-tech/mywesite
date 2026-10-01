import { useState, useEffect } from 'react';
import { Bookmark, Compass, Menu, X } from 'lucide-react';

interface NavbarProps {
  shortlistCount: number;
  onOpenShortlist: () => void;
  onOpenPlanner: () => void;
}

export function Navbar({ shortlistCount, onOpenShortlist, onOpenPlanner }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-stone-950/85 backdrop-blur-md border-b border-stone-800/80 py-3.5 shadow-2xl'
            : 'bg-transparent py-5 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="text-lg md:text-xl font-serif font-bold tracking-tight text-white hover:text-amber-400 transition-colors shrink-0 uppercase"
          >
            Asia Destination DMC
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-300">
            <a
              href="#destinations"
              className="hover:text-amber-400 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all"
            >
              Destinations
            </a>
            <a
              href="#packages"
              className="hover:text-amber-400 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all"
            >
              Signature Journeys
            </a>
            <a
              href="#why-us"
              className="hover:text-amber-400 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all"
            >
              Our Philosophy
            </a>
            <a
              href="#planner"
              className="hover:text-amber-400 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all"
            >
              Trip Planner
            </a>
            <a
              href="#testimonials"
              className="hover:text-amber-400 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all"
            >
              Stories
            </a>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            {/* Shortlist bookmark trigger */}
            <button
              onClick={onOpenShortlist}
              className="relative p-2 text-stone-300 hover:text-white hover:bg-stone-800/60 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-amber-400"
              aria-label={`View saved wishlist items (${shortlistCount} saved)`}
            >
              <Bookmark className="w-5 h-5" />
              {shortlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-mono text-[11px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {shortlistCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenPlanner}
              className="px-4 py-2 text-xs md:text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all duration-200 whitespace-nowrap shadow-sm glow-gold cursor-pointer"
            >
              Plan Your Trip
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-white rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-amber-400"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-stone-950/95 backdrop-blur-lg lg:hidden pt-24 px-6 flex flex-col justify-between pb-10">
          <div className="flex flex-col gap-6 text-lg font-medium">
            <a
              href="#destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="text-stone-200 hover:text-amber-400 transition-colors py-2 border-b border-stone-800/80"
            >
              Destinations
            </a>
            <a
              href="#packages"
              onClick={() => setMobileMenuOpen(false)}
              className="text-stone-200 hover:text-amber-400 transition-colors py-2 border-b border-stone-800/80"
            >
              Signature Journeys
            </a>
            <a
              href="#why-us"
              onClick={() => setMobileMenuOpen(false)}
              className="text-stone-200 hover:text-amber-400 transition-colors py-2 border-b border-stone-800/80"
            >
              Our Philosophy
            </a>
            <a
              href="#planner"
              onClick={() => setMobileMenuOpen(false)}
              className="text-stone-200 hover:text-amber-400 transition-colors py-2 border-b border-stone-800/80"
            >
              Interactive Trip Planner
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="text-stone-200 hover:text-amber-400 transition-colors py-2 border-b border-stone-800/80"
            >
              Traveler Stories
            </a>
          </div>

          <div className="pt-6 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenShortlist();
              }}
              className="w-full py-3 bg-stone-900 border border-stone-800 rounded-lg text-stone-200 flex items-center justify-center gap-2 text-sm"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              Saved Destinations ({shortlistCount})
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPlanner();
              }}
              className="w-full py-3 bg-amber-400 text-stone-950 font-bold rounded-lg text-sm"
            >
              Plan Your Trip →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
