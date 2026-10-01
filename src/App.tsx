import { useState } from 'react';
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
import { DESTINATIONS } from './data/destinations';
import { Destination } from './types';
import { Bookmark, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [shortlist, setShortlist] = useState<string[]>(['angkor', 'kyoto']);
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [plannerDestinationId, setPlannerDestinationId] = useState<string>('angkor');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    code: string;
    destinationName: string;
    total: number;
    travelers: number;
    email: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  };

  const handleToggleShortlist = (id: string) => {
    setShortlist((prev) => {
      const exists = prev.includes(id);
      const destName = DESTINATIONS.find((d) => d.id === id)?.name || 'Destination';
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
    const found = DESTINATIONS.find((d) => d.id === destId);
    if (found) {
      setSelectedDestination(found);
    }
  };

  const handleQuickSearch = (destinationQuery: string, _season: string) => {
    if (destinationQuery.trim()) {
      const found = DESTINATIONS.find((d) =>
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
      />

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
          destinations={DESTINATIONS}
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
          selectedDestinationId={plannerDestinationId}
          onBookingSuccess={(confirmation) => setBookingConfirmation(confirmation)}
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
      />
    </div>
  );
}
