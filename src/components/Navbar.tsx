import { useState, useEffect } from 'react';
import { Bookmark, Compass, Menu, X, ShieldCheck, UserCheck, LogOut, LogIn, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  shortlistCount: number;
  onOpenShortlist: () => void;
  onOpenPlanner: () => void;
  onOpenAuth: () => void;
  onOpenCustomerDashboard: () => void;
  onOpenAdminDashboard: () => void;
}

export function Navbar({ 
  shortlistCount, 
  onOpenShortlist, 
  onOpenPlanner,
  onOpenAuth,
  onOpenCustomerDashboard,
  onOpenAdminDashboard,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, signOutUser } = useAuth();

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
            ? 'bg-stone-950/85 backdrop-blur-md border-b border-stone-800/80 py-3 shadow-2xl'
            : 'bg-transparent py-4 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between">
          {/* Brand wordmark */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="text-base sm:text-lg md:text-xl font-serif font-bold tracking-tight text-white hover:text-amber-400 transition-colors shrink-0 uppercase"
            >
              Asia Destination DMC
            </a>
            {isAdmin && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950">
                <ShieldCheck className="w-3 h-3" /> ADMIN
              </span>
            )}
          </div>

          {/* Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-medium text-stone-300">
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
          </nav>

          {/* Actions & Portals */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Customer Bookings button */}
            {user && (
              <button
                onClick={onOpenCustomerDashboard}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 hover:border-amber-400/40 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> My Bookings
              </button>
            )}

            {/* Admin Console button */}
            {isAdmin && (
              <button
                onClick={onOpenAdminDashboard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Console
              </button>
            )}

            {/* User Auth trigger */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={isAdmin ? onOpenAdminDashboard : onOpenCustomerDashboard}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-stone-300 hover:text-white bg-stone-950/60 rounded-lg border border-stone-800 cursor-pointer"
                  title={`Logged in as ${user.email}`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="max-w-[100px] truncate">{user.displayName}</span>
                </button>
                <button
                  onClick={signOutUser}
                  className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-stone-800/60 rounded-lg transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-200 hover:text-white bg-stone-900/80 hover:bg-stone-800 rounded-lg border border-stone-800 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" /> Sign In
              </button>
            )}

            {/* Shortlist bookmark trigger */}
            <button
              onClick={onOpenShortlist}
              className="relative p-2 text-stone-300 hover:text-white hover:bg-stone-800/60 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-amber-400 cursor-pointer"
              aria-label={`View saved wishlist items (${shortlistCount} saved)`}
            >
              <Bookmark className="w-4.5 h-4.5" />
              {shortlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-mono text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {shortlistCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenPlanner}
              className="px-3.5 py-2 text-xs md:text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all duration-200 whitespace-nowrap shadow-sm glow-gold cursor-pointer"
            >
              Plan Trip
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-white rounded-lg transition-colors cursor-pointer"
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
          <div className="flex flex-col gap-5 text-base font-medium">
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
              href="#planner"
              onClick={() => setMobileMenuOpen(false)}
              className="text-stone-200 hover:text-amber-400 transition-colors py-2 border-b border-stone-800/80"
            >
              Interactive Trip Planner
            </a>

            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCustomerDashboard();
                  }}
                  className="text-left text-amber-400 py-2 border-b border-stone-800/80 flex items-center justify-between"
                >
                  <span>My Bookings</span>
                  <Calendar className="w-4 h-4" />
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdminDashboard();
                    }}
                    className="text-left text-amber-400 font-bold py-2 border-b border-stone-800/80 flex items-center justify-between"
                  >
                    <span>Admin Management Console</span>
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => {
                    signOutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-rose-400 py-2 flex items-center justify-between"
                >
                  <span>Sign Out ({user.displayName})</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="text-left text-amber-400 py-2 flex items-center justify-between"
              >
                <span>Sign In (Customer & Admin)</span>
                <LogIn className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="pt-6 border-t border-stone-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPlanner();
              }}
              className="w-full py-3 bg-amber-400 text-stone-950 font-bold rounded-xl text-center text-sm shadow-lg"
            >
              Plan Your Bespoke Trip
            </button>
          </div>
        </div>
      )}
    </>
  );
}
