import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Metrics } from './components/Metrics';
import { DestinationsGrid } from './components/DestinationsGrid';
import { PackagesSection } from './components/PackagesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { TripPlanner } from './components/TripPlanner';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { DestinationModal } from './components/DestinationModal';
import { VideoModal } from './components/VideoModal';
import { ShortlistDrawer } from './components/ShortlistDrawer';
import { ConfirmationModal } from './components/ConfirmationModal';
import { AuthModal } from './components/AuthModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DESTINATIONS as defaultDestinations } from './data/destinations';
import { Destination } from './types';
import { getLocalCustomDestinations, BookingRecord } from './lib/bookingService';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Bookmark, ShieldCheck, UserCheck } from 'lucide-react';

function MainApp() {
  const { user, isAdmin } = useAuth();
  const [shortlist, setShortlist] = useState<string[]>(['angkor', 'kyoto']);
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [plannerDestinationId, setPlannerDestinationId] = useState<string>('angkor');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals for Customer & Admin
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<'customer' | 'admin'>('customer');
  const [isCustomerDashboardOpen, setIsCustomerDashboardOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Dynamic merged destinations (defaults + custom created by admin)
  const [allDestinations, setAllDestinations] = useState<Destination[]>(defaultDestinations);

  const reloadDestinations = () => {
    const customList = getLocalCustomDestinations();
    const merged = [
      ...customList,
      ...defaultDestinations.filter((d) => !customList.some((c) => c.id === d.id)),
    ];
    setAllDestinations(merged);
  };

  useEffect(() => {
    reloadDestinations();
  }, []);

  const [bookingConfirmation, setBookingConfirmation] = useState<{
    code: string;
    destinationName: string;
    total: number;
    travelers: number;
    email: string;
    bookingRecord?: BookingRecord;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  const handleToggleShortlist = (id: string) => {
    setShortlist((prev) => {
      const exists = prev.includes(id);
      const destName = allDestinations.find((d) => d.id === id)?.name || 'Destination';
      if (exists) {
        showToast(`Removed ${destName} from your wishlist`);
        return prev.filter((item) => item !== id);
      } else {
        showToast(`Saved ${destName} to your wishlist`);
        return [...prev, id];
      }
    });
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlanForDestination = (destId: string) => {
    setPlannerDestinationId(destId);
    handleScrollToSection('planner');
  };

  const handleSelectPolaroid = (destId: string) => {
    const found = allDestinations.find((d) => d.id === destId);
    if (found) {
      setSelectedDestination(found);
    }
  };

  const handleQuickSearch = (destinationQuery: string, _season: string) => {
    if (destinationQuery.trim()) {
      const found = allDestinations.find(
        (d) =>
          d.name.toLowerCase().includes(destinationQuery.toLowerCase()) ||
          d.country.toLowerCase().includes(destinationQuery.toLowerCase()) ||
          d.region.toLowerCase().includes(destinationQuery.toLowerCase())
      );
      if (found) {
        setSelectedDestination(found);
        return;
      }
    }
    handleScrollToSection('destinations');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 border border-amber-400/50 text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-bounce-short">
          <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        shortlistCount={shortlist.length}
        onOpenShortlist={() => setIsShortlistOpen(true)}
        onOpenPlanner={() => handleScrollToSection('planner')}
        onOpenAuth={() => {
          setAuthDefaultRole('customer');
          setIsAuthModalOpen(true);
        }}
        onOpenCustomerDashboard={() => setIsCustomerDashboardOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Admin Quick Banner if Admin is Logged In */}
      {isAdmin && (
        <div className="mt-16 bg-amber-400/10 border-b border-amber-400/20 py-2 px-6 text-center text-xs flex items-center justify-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-amber-400">
            <ShieldCheck className="w-4 h-4" /> Admin Console Active ({user?.email})
          </span>
          <span className="text-stone-400 hidden sm:inline">•</span>
          <button
            onClick={() => setIsAdminDashboardOpen(true)}
            className="text-stone-200 hover:text-amber-400 underline font-medium cursor-pointer"
          >
            Review Customer Bookings & Manage Destinations
          </button>
        </div>
      )}

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreDestinations={() => handleScrollToSection('destinations')}
          onWatchVideo={() => setIsVideoModalOpen(true)}
          onSelectPolaroid={handleSelectPolaroid}
          onQuickSearch={handleQuickSearch}
        />

        {/* Quantified Metrics & Proof Bar */}
        <Metrics />

        {/* Curated Destinations Showcase */}
        <DestinationsGrid
          destinations={allDestinations}
          shortlist={shortlist}
          onToggleShortlist={handleToggleShortlist}
          onSelectDestination={(dest) => setSelectedDestination(dest)}
          onPlanForDestination={handlePlanForDestination}
        />

        {/* Curated Signature Travel Packages */}
        <PackagesSection
          onSelectPackageForPlanner={(pkgName) => {
            handleScrollToSection('planner');
            showToast(`Tailoring itinerary for: ${pkgName}`);
          }}
        />

        {/* Why Wild Wonders / Philosophy Bento Grid */}
        <WhyChooseUs />

        {/* Interactive Trip Planner & Cost Wizard */}
        <TripPlanner
          destinations={allDestinations}
          selectedDestinationId={plannerDestinationId}
          onBookingSuccess={(confirmation) => {
            setBookingConfirmation(confirmation);
            showToast(`Itinerary request ${confirmation.code} registered!`);
          }}
        />

        {/* Verified Traveler Testimonials */}
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer />

      {/* Destination Quick View & Itinerary Modal */}
      <DestinationModal
        destination={selectedDestination}
        isSaved={selectedDestination ? shortlist.includes(selectedDestination.id) : false}
        onClose={() => setSelectedDestination(null)}
        onToggleShortlist={handleToggleShortlist}
        onSelectForPlanner={(destId) => {
          setSelectedDestination(null);
          handlePlanForDestination(destId);
        }}
      />

      {/* Expedition Film Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onPlanTrip={() => {
          setIsVideoModalOpen(false);
          handleScrollToSection('planner');
        }}
      />

      {/* Saved Wishlist Drawer */}
      <ShortlistDrawer
        isOpen={isShortlistOpen}
        shortlist={shortlist}
        onClose={() => setIsShortlistOpen(false)}
        onRemove={handleToggleShortlist}
        onPlanTrip={(firstId) => {
          if (firstId) setPlannerDestinationId(firstId);
          setIsShortlistOpen(false);
          handleScrollToSection('planner');
        }}
        onExplore={() => {
          setIsShortlistOpen(false);
          handleScrollToSection('destinations');
        }}
      />

      {/* Proposal Request Confirmation Modal */}
      <ConfirmationModal
        confirmation={bookingConfirmation}
        onClose={() => setBookingConfirmation(null)}
        onOpenCustomerDashboard={() => setIsCustomerDashboardOpen(true)}
      />

      {/* Auth Modal for Customer & Admin */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultRole={authDefaultRole}
      />

      {/* Customer Bookings Dashboard */}
      <CustomerDashboard
        isOpen={isCustomerDashboardOpen}
        onClose={() => setIsCustomerDashboardOpen(false)}
        onNewBookingClick={() => handleScrollToSection('planner')}
      />

      {/* Admin Management Dashboard */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onDestinationsUpdated={reloadDestinations}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
