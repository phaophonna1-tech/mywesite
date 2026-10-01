import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Mail, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  DollarSign, 
  Image as ImageIcon, 
  Globe, 
  Sparkles,
  ExternalLink,
  Send,
  Check,
  AlertTriangle
} from 'lucide-react';
import { 
  BookingRecord, 
  getLocalBookings, 
  updateBookingStatus, 
  generateStatusEmailLink,
  getLocalCustomDestinations,
  addCustomDestination,
  updateCustomDestination,
  deleteCustomDestination
} from '../lib/bookingService';
import { DESTINATIONS as initialDestinations } from '../data/destinations';
import { Destination } from '../types';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDestinationsUpdated: () => void;
}

export function AdminDashboard({ isOpen, onClose, onDestinationsUpdated }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'destinations'>('bookings');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForNotes, setSelectedBookingForNotes] = useState<string | null>(null);
  const [curatorNoteInput, setCuratorNoteInput] = useState('');
  const [statusActionSuccess, setStatusActionSuccess] = useState<string | null>(null);

  // Destinations Management state
  const [destinationsList, setDestinationsList] = useState<Destination[]>([]);
  const [isAddingDestination, setIsAddingDestination] = useState(false);
  const [editingDestId, setEditingDestId] = useState<string | null>(null);

  // New Destination Form state
  const [destForm, setDestForm] = useState({
    name: '',
    country: '',
    region: 'Southeast Asia',
    tagline: '',
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80',
    priceFrom: 4500,
    duration: '8 Days / 7 Nights',
    description: '',
    bestSeason: 'Nov – Apr',
    badge: 'Curated',
    highlights: 'Private VIP Temple Access, Luxury Heritage Stays, Private Chauffeur & Yacht',
  });

  // Load Bookings
  const refreshBookings = () => {
    const local = getLocalBookings();
    setBookings(local);
  };

  // Load Destinations (merged default + custom)
  const refreshDestinations = () => {
    const customs = getLocalCustomDestinations();
    const merged = [...customs, ...initialDestinations.filter((d) => !customs.some((c) => c.id === d.id))];
    setDestinationsList(merged);
  };

  useEffect(() => {
    if (!isOpen) return;
    refreshBookings();
    refreshDestinations();

    // Firestore live updates
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snap) => {
          if (!snap.empty) {
            const live: BookingRecord[] = [];
            snap.forEach((doc) => live.push(doc.data() as BookingRecord));
            setBookings(live);
          }
        },
        (err) => console.warn('Admin bookings listener fallback:', err)
      );
      return () => unsub();
    } catch {
      // fallback to local
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = filterStatus === 'all' || b.status === filterStatus;
    const matchesSearch =
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.destinationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate Metrics
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const approvedCount = bookings.filter((b) => b.status === 'approved').length;
  const paidCount = bookings.filter((b) => b.status === 'paid').length;
  const totalRevenue = bookings
    .filter((b) => b.status === 'paid')
    .reduce((sum, b) => sum + (b.estimatedTotal || 0), 0);

  // Status Update Handlers
  const handleApprove = async (booking: BookingRecord) => {
    const note = curatorNoteInput || 'Approved by Senior Curator. Ready for final reservation.';
    await updateBookingStatus(booking.id, 'approved', note);
    refreshBookings();
    setSelectedBookingForNotes(null);
    setCuratorNoteInput('');

    // Trigger email back to customer
    const emailLink = generateStatusEmailLink({ ...booking, adminNotes: note }, 'approved');
    setStatusActionSuccess(`Booking ${booking.code} APPROVED! Opening email to notify customer...`);
    window.open(emailLink, '_blank');
    setTimeout(() => setStatusActionSuccess(null), 4000);
  };

  const handleMarkPaid = async (booking: BookingRecord) => {
    const note = curatorNoteInput || 'Full payment received and guaranteed.';
    await updateBookingStatus(booking.id, 'paid', note);
    refreshBookings();
    setSelectedBookingForNotes(null);
    setCuratorNoteInput('');

    // Trigger payment receipt email back to customer
    const emailLink = generateStatusEmailLink({ ...booking, adminNotes: note }, 'paid');
    setStatusActionSuccess(`Booking ${booking.code} marked as PAID! Opening confirmation email to customer...`);
    window.open(emailLink, '_blank');
    setTimeout(() => setStatusActionSuccess(null), 4000);
  };

  const handleSendStatusEmail = (booking: BookingRecord) => {
    const status = booking.status === 'paid' ? 'paid' : booking.status === 'approved' ? 'approved' : 'cancelled';
    const emailLink = generateStatusEmailLink(booking, status);
    window.open(emailLink, '_blank');
  };

  // Add Destination
  const handleSaveNewDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destForm.name.trim()) return;

    const newId = destForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newDest: Destination = {
      id: newId,
      name: destForm.name,
      country: destForm.country,
      region: destForm.region,
      category: 'cultural',
      tagline: destForm.tagline,
      heroImage: destForm.heroImage,
      priceFrom: Number(destForm.priceFrom),
      duration: destForm.duration,
      description: destForm.description || `Experience private luxury and bespoke expeditions across ${destForm.name}.`,
      bestSeason: destForm.bestSeason,
      groupSize: 'Max 8 Guests',
      rating: 5.0,
      reviewsCount: 1,
      accentColor: 'from-amber-500/20 to-orange-500/30',
      bgGradient: 'bg-gradient-to-br from-amber-950/80 via-stone-900 to-stone-950',
      heroSvgType: 'hero',
      badge: destForm.badge,
      highlights: destForm.highlights.split(',').map((s) => s.trim()),
      itinerary: [
        {
          day: 1,
          title: `Arrival & Private Welcome in ${destForm.country}`,
          description: 'VIP tarmac welcome, luxury transfer to your private sanctuary, and welcome tasting dinner.',
        },
        {
          day: 2,
          title: 'Curated Heritage & Signature Access',
          description: 'Exclusive access to historical monuments followed by private sunset champagne viewing.',
        },
      ],
      included: [
        'VIP Airport Meet & Tarmac Fast-Track',
        'Private Luxury Chauffeur & English Specialist Guide',
        'Exclusive Heritage Stays & 5-Star Sanctuaries',
        'Bespoke Culinary & Cultural Access',
      ],
    };

    await addCustomDestination(newDest);
    refreshDestinations();
    onDestinationsUpdated();
    setIsAddingDestination(false);
    setStatusActionSuccess(`New destination "${newDest.name}" added successfully!`);
    setTimeout(() => setStatusActionSuccess(null), 3000);
  };

  // Inline Price & Image change
  const handleUpdatePrice = async (dest: Destination, newPrice: number) => {
    const updated = { ...dest, priceFrom: newPrice };
    await updateCustomDestination(updated);
    refreshDestinations();
    onDestinationsUpdated();
  };

  const handleUpdateImage = async (dest: Destination, newImage: string) => {
    const updated = { ...dest, heroImage: newImage };
    await updateCustomDestination(updated);
    refreshDestinations();
    onDestinationsUpdated();
  };

  const handleDeleteDestination = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove destination "${name}"?`)) {
      await deleteCustomDestination(id);
      refreshDestinations();
      onDestinationsUpdated();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative z-10 bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Top Bar */}
          <div className="p-5 sm:p-6 border-b border-stone-800 bg-stone-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-400 text-stone-950">
                  ADMIN CONSOLE
                </span>
                <span className="text-xs text-stone-400">
                  Super Admin: <strong className="text-amber-400">phaophonna.1@gmail.com</strong>
                </span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                Asia Destination Management System
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex p-1 bg-stone-900 border border-stone-800 rounded-xl">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'bookings'
                      ? 'bg-amber-400 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Bookings ({bookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('destinations')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'destinations'
                      ? 'bg-amber-400 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Destinations & Pricing ({destinationsList.length})
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Success Toast */}
          {statusActionSuccess && (
            <div className="bg-emerald-950 border-b border-emerald-500/30 px-6 py-2.5 text-xs font-medium text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {statusActionSuccess}
              </div>
              <button
                onClick={() => setStatusActionSuccess(null)}
                className="text-emerald-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {activeTab === 'bookings' ? (
              <>
                {/* Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-stone-950 border border-stone-800 rounded-xl p-4">
                    <span className="text-xs text-stone-500 uppercase tracking-wider block">
                      Total Inquiries
                    </span>
                    <span className="text-2xl font-serif font-bold text-white mt-1 block">
                      {totalBookings}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 block">All customer proposals</span>
                  </div>

                  <div className="bg-stone-950 border border-amber-500/20 rounded-xl p-4">
                    <span className="text-xs text-amber-400 uppercase tracking-wider block">
                      Pending Review
                    </span>
                    <span className="text-2xl font-serif font-bold text-amber-400 mt-1 block">
                      {pendingCount}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 block">Awaiting curator action</span>
                  </div>

                  <div className="bg-stone-950 border border-sky-500/20 rounded-xl p-4">
                    <span className="text-xs text-sky-400 uppercase tracking-wider block">
                      Approved
                    </span>
                    <span className="text-2xl font-serif font-bold text-sky-400 mt-1 block">
                      {approvedCount}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 block">Sent to travelers</span>
                  </div>

                  <div className="bg-stone-950 border border-emerald-500/20 rounded-xl p-4">
                    <span className="text-xs text-emerald-400 uppercase tracking-wider block">
                      Confirmed Revenue
                    </span>
                    <span className="text-2xl font-mono font-bold text-emerald-400 mt-1 block">
                      ${totalRevenue.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 block">
                      {paidCount} Paid & Guaranteed
                    </span>
                  </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-stone-950/60 p-3 rounded-xl border border-stone-800">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search code, guest name, email, destination..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {['all', 'pending', 'approved', 'paid', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer whitespace-nowrap ${
                          filterStatus === status
                            ? 'bg-amber-400 text-stone-950 font-bold'
                            : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                  {filteredBookings.length === 0 ? (
                    <div className="text-center py-12 bg-stone-950/40 rounded-xl border border-stone-800">
                      <p className="text-sm text-stone-400">No bookings match the selected criteria.</p>
                    </div>
                  ) : (
                    filteredBookings.map((b) => (
                      <div
                        key={b.id}
                        className="bg-stone-950 border border-stone-800 rounded-xl p-5 hover:border-stone-700 transition-all space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-800/80">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-amber-400 tracking-wider">
                                {b.code}
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                  b.status === 'paid'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : b.status === 'approved'
                                    ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                                    : b.status === 'cancelled'
                                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                    : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                }`}
                              >
                                {b.status}
                              </span>
                            </div>
                            <h4 className="text-lg font-serif font-bold text-white mt-1">
                              {b.destinationName}
                            </h4>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-xs text-stone-500 block">Total Investment</span>
                            <span className="font-mono text-lg font-bold text-amber-400">
                              ${b.estimatedTotal.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Customer & Itinerary Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-stone-900/60 p-3 rounded-lg border border-stone-800/50">
                          <div>
                            <span className="text-stone-500 block">Client Information</span>
                            <span className="text-white font-medium block">{b.userName}</span>
                            <a
                              href={`mailto:${b.userEmail}`}
                              className="text-amber-400 hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <Mail className="w-3 h-3" /> {b.userEmail}
                            </a>
                          </div>

                          <div>
                            <span className="text-stone-500 block">Trip Particulars</span>
                            <span className="text-stone-200 block">
                              {b.travelers} Guests • Tier: {b.tier}
                            </span>
                            <span className="text-stone-400 block mt-0.5">
                              Submitted: {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div>
                            <span className="text-stone-500 block">Client Special Notes</span>
                            <span className="text-stone-300 italic block line-clamp-2">
                              {b.notes || 'None specified.'}
                            </span>
                          </div>
                        </div>

                        {/* Existing Curator Note */}
                        {b.adminNotes && (
                          <div className="text-xs bg-amber-400/5 border border-amber-400/20 p-2.5 rounded-lg text-stone-300">
                            <strong className="text-amber-400">Curator Note on Record:</strong>{' '}
                            {b.adminNotes}
                          </div>
                        )}

                        {/* Action Control Panel */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="flex items-center gap-2">
                            {/* Approve button */}
                            {b.status !== 'approved' && b.status !== 'paid' && (
                              <button
                                onClick={() => handleApprove(b)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Email Customer
                              </button>
                            )}

                            {/* Mark Paid button */}
                            {b.status !== 'paid' && (
                              <button
                                onClick={() => handleMarkPaid(b)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                              >
                                <CreditCard className="w-3.5 h-3.5" /> Mark Paid & Send Receipt
                              </button>
                            )}

                            {/* Direct Email Customer button */}
                            <button
                              onClick={() => handleSendStatusEmail(b)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs rounded-lg transition-colors cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" /> Email Status to Customer
                            </button>
                          </div>

                          <span className="text-[11px] text-stone-500">
                            Auto-notifies admin: <strong className="text-stone-400">phaophonna.1@gmail.com</strong>
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              /* TAB 2: DESTINATIONS & PRICING MANAGER */
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-stone-950/70 p-4 rounded-xl border border-stone-800">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">
                      Curated Destinations & Pricing Engine
                    </h3>
                    <p className="text-xs text-stone-400">
                      Add new Asian itineraries, adjust starting prices per person, and update luxury hero imagery.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddingDestination(!isAddingDestination)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg"
                  >
                    <Plus className="w-4 h-4" /> {isAddingDestination ? 'Close Form' : 'Add New Destination'}
                  </button>
                </div>

                {/* Add New Destination Form */}
                {isAddingDestination && (
                  <form
                    onSubmit={handleSaveNewDestination}
                    className="bg-stone-950 border border-amber-500/30 rounded-xl p-6 space-y-4"
                  >
                    <div className="flex items-center gap-2 text-amber-400 text-sm font-bold pb-2 border-b border-stone-800">
                      <Sparkles className="w-4 h-4" /> Create New Bespoke Destination
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-stone-400 mb-1">Destination Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Hokkaido Winter Sanctuary"
                          value={destForm.name}
                          onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-stone-400 mb-1">Country *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Japan"
                          value={destForm.country}
                          onChange={(e) => setDestForm({ ...destForm, country: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-stone-400 mb-1">Region</label>
                        <select
                          value={destForm.region}
                          onChange={(e) => setDestForm({ ...destForm, region: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="East Asia">East Asia</option>
                          <option value="Southeast Asia">Southeast Asia</option>
                          <option value="Indochina">Indochina</option>
                          <option value="Himalayas">Himalayas</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-stone-400 mb-1">Price From (USD per person) *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs">$</span>
                          <input
                            type="number"
                            required
                            min="500"
                            step="100"
                            value={destForm.priceFrom}
                            onChange={(e) => setDestForm({ ...destForm, priceFrom: Number(e.target.value) })}
                            className="w-full pl-7 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-stone-400 mb-1">Typical Duration</label>
                        <input
                          type="text"
                          value={destForm.duration}
                          onChange={(e) => setDestForm({ ...destForm, duration: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-stone-400 mb-1">Badge (optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. VIP Access, New Release"
                          value={destForm.badge}
                          onChange={(e) => setDestForm({ ...destForm, badge: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-stone-400 mb-1">Tagline</label>
                      <input
                        type="text"
                        placeholder="e.g. Powder snow sanctuaries, private onsen estates, and Michelin kaiseki"
                        value={destForm.tagline}
                        onChange={(e) => setDestForm({ ...destForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-stone-400 mb-1">Hero Image URL *</label>
                      <input
                        type="url"
                        required
                        value={destForm.heroImage}
                        onChange={(e) => setDestForm({ ...destForm, heroImage: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Preset Image suggestions */}
                    <div>
                      <span className="text-[11px] text-stone-500 block mb-1.5">
                        Or pick from curated luxury image presets:
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {[
                          { name: 'Kyoto Zen', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
                          { name: 'Tokyo Neon', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80' },
                          { name: 'Bali Estate', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' },
                          { name: 'Angkor Wat', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
                          { name: 'Halong Bay', url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80' },
                          { name: 'Himalayas', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
                        ].map((preset) => (
                          <button
                            type="button"
                            key={preset.name}
                            onClick={() => setDestForm({ ...destForm, heroImage: preset.url })}
                            className="text-left group cursor-pointer"
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-full h-12 object-cover rounded border border-stone-800 group-hover:border-amber-400 transition-colors"
                            />
                            <span className="text-[10px] text-stone-400 group-hover:text-amber-400 truncate block mt-0.5">
                              {preset.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-stone-800">
                      <button
                        type="button"
                        onClick={() => setIsAddingDestination(false)}
                        className="px-4 py-2 bg-stone-900 text-stone-400 hover:text-white text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md"
                      >
                        Publish Destination
                      </button>
                    </div>
                  </form>
                )}

                {/* Destinations List with Price & Image Editors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destinationsList.map((dest) => (
                    <div
                      key={dest.id}
                      className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden flex flex-col hover:border-stone-700 transition-all"
                    >
                      <div className="relative h-44 group">
                        <img
                          src={dest.heroImage}
                          alt={dest.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950">
                            {dest.country}
                          </span>
                          {dest.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-900/80 text-amber-300 border border-amber-400/30">
                              {dest.badge}
                            </span>
                          )}
                        </div>

                        {/* Quick Image Change Button */}
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={() => {
                              const newImg = window.prompt(
                                `Enter new Image URL for ${dest.name}:`,
                                dest.heroImage
                              );
                              if (newImg && newImg.trim()) {
                                handleUpdateImage(dest, newImg.trim());
                              }
                            }}
                            className="p-1.5 bg-stone-900/80 hover:bg-amber-400 hover:text-stone-950 text-white rounded-lg transition-colors cursor-pointer backdrop-blur-sm"
                            title="Change Image URL"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                          <div>
                            <span className="text-[11px] text-amber-400 uppercase tracking-widest block font-medium">
                              {dest.region}
                            </span>
                            <h4 className="text-lg font-serif font-bold text-white">
                              {dest.name}
                            </h4>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <p className="text-xs text-stone-400 line-clamp-2">
                          {dest.tagline || dest.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-stone-800/80">
                          {/* Price Editor */}
                          <div>
                            <span className="text-[10px] text-stone-500 block uppercase tracking-wider">
                              Starting Price
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-base font-bold text-amber-400">
                                ${dest.priceFrom.toLocaleString()}
                              </span>
                              <button
                                onClick={() => {
                                  const promptPrice = window.prompt(
                                    `Update starting price for ${dest.name} (USD):`,
                                    String(dest.priceFrom)
                                  );
                                  if (promptPrice && !isNaN(Number(promptPrice))) {
                                    handleUpdatePrice(dest, Number(promptPrice));
                                  }
                                }}
                                className="p-1 text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
                                title="Edit Price"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const newImg = window.prompt(
                                  `Enter new Image URL for ${dest.name}:`,
                                  dest.heroImage
                                );
                                if (newImg && newImg.trim()) {
                                  handleUpdateImage(dest, newImg.trim());
                                }
                              }}
                              className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <ImageIcon className="w-3 h-3" /> Change Image
                            </button>

                            <button
                              onClick={() => handleDeleteDestination(dest.id, dest.name)}
                              className="p-1.5 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete Destination"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
