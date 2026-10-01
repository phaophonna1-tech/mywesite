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
              <div className="flex items-center gap-2">
                <button
                  onClick={isAdmin ? onOpenAdminDashboard : onOpenCustomerDashboard}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-stone-200 hover:text-white bg-stone-900/90 hover:bg-stone-850 rounded-xl border border-stone-800 hover:border-amber-400/40 transition-colors cursor-pointer text-left shadow-sm"
                  title={`Signed in as ${user.displayName} (${user.email})`}
                >
                  {/* Provider icon or initial */}
                  <div className="w-6 h-6 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-[11px] font-bold text-amber-400 shrink-0">
                    {user.provider === 'google' ? (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    ) : user.provider === 'facebook' ? (
                      <svg className="w-3.5 h-3.5 fill-[#1877F2]" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    ) : user.provider === 'github' ? (
                      <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    ) : (
                      <span>{user.displayName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  {/* Name and Email */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white max-w-[120px] truncate leading-tight">
                        {user.displayName}
                      </span>
                      {user.provider && (
                        <span className="text-[9px] uppercase px-1 rounded bg-stone-800 text-stone-400 font-mono">
                          {user.provider}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono max-w-[140px] truncate leading-tight">
                      {user.email}
                    </span>
                  </div>
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
                <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-bold text-sm">{user.displayName}</span>
                      {user.provider && (
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-400 text-stone-950 font-bold">
                          {user.provider}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-400 font-mono block">{user.email}</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCustomerDashboard();
                  }}
                  className="text-left text-amber-400 py-2 border-b border-stone-800/80 flex items-center justify-between"
                >
                  <span>My Bookings & Dossiers</span>
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
