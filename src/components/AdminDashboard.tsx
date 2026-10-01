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
  AlertTriangle,
  Lock,
  UserPlus,
  Users,
  Phone,
  User,
  Copy,
  ChevronDown,
  ChevronUp,
  Ban,
  UserX
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
import { useAuth } from '../context/AuthContext';
import { 
  DEFAULT_SUPER_ADMIN_EMAIL, 
  getLocalUsers, 
  UserAccount, 
  updateCustomerStatus, 
  deleteCustomerUser, 
  updateCustomerProfile 
} from '../lib/authService';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface CustomerData {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  provider: string;
  status: 'active' | 'inactive';
  createdAt: string;
  emailVerified: boolean;
  bookings: BookingRecord[];
  totalSpend: number;
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDestinationsUpdated: () => void;
}

export function AdminDashboard({ isOpen, onClose, onDestinationsUpdated }: AdminDashboardProps) {
  const { user, isDefaultSuperAdmin, createAdmin, deleteAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'destinations' | 'customers' | 'admins'>('bookings');
  
  // Bookings state
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusActionSuccess, setStatusActionSuccess] = useState<string | null>(null);

  // Customers state (viewable and manageable by all administrators)
  const [customersList, setCustomersList] = useState<CustomerData[]>([]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [customerProviderFilter, setCustomerProviderFilter] = useState<'all' | 'facebook' | 'google' | 'email'>('all');
  const [customerStatusFilter, setCustomerStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);
  const [copiedCustomerEmail, setCopiedCustomerEmail] = useState<string | null>(null);

  // Customer Management Modals (Active, Inactive, Delete, Edit)
  const [customerToDelete, setCustomerToDelete] = useState<CustomerData | null>(null);
  const [customerToEdit, setCustomerToEdit] = useState<CustomerData | null>(null);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');
  const [editCustomerStatus, setEditCustomerStatus] = useState<'active' | 'inactive'>('active');
  const [isProcessingCustomer, setIsProcessingCustomer] = useState(false);

  // Destinations Management state
  const [destinationsList, setDestinationsList] = useState<Destination[]>([]);
  const [isAddingDestination, setIsAddingDestination] = useState(false);

  // Admin Team state
  const [adminUsers, setAdminUsers] = useState<UserAccount[]>([]);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [adminActionError, setAdminActionError] = useState<string | null>(null);

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

  // Load Admins list
  const refreshAdmins = () => {
    const all = getLocalUsers();
    setAdminUsers(all.filter((u) => u.role === 'admin' || u.email.toLowerCase() === DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase()));
  };

  // Load Customers list (aggregated from customer user accounts and inquiries)
  const refreshCustomers = (currentBookings: BookingRecord[] = bookings) => {
    const allUsers = getLocalUsers();
    const customerUsers = allUsers.filter((u) => u.role === 'customer' || u.role !== 'admin');

    const map = new Map<string, CustomerData>();

    // 1. Add all registered customer users
    for (const u of customerUsers) {
      const emailLower = u.email.toLowerCase();
      const userBookings = currentBookings.filter(
        (b) => b.userEmail.toLowerCase() === emailLower || (b.userId && b.userId === u.uid)
      );
      const phone = userBookings.find((b) => b.userPhone)?.userPhone;
      const totalSpend = userBookings.reduce((sum, b) => sum + (b.estimatedTotal || 0), 0);

      map.set(emailLower, {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName || u.email.split('@')[0],
        phone: u.phone || phone,
        provider: u.provider || 'email',
        status: u.status || 'active',
        createdAt: u.createdAt || new Date().toISOString(),
        emailVerified: u.emailVerified ?? true,
        bookings: userBookings,
        totalSpend,
      });
    }

    // 2. Also incorporate any customer who submitted a booking inquiry
    for (const b of currentBookings) {
      const emailLower = b.userEmail.toLowerCase();
      if (!map.has(emailLower)) {
        const userBookings = currentBookings.filter((item) => item.userEmail.toLowerCase() === emailLower);
        const totalSpend = userBookings.reduce((sum, item) => sum + (item.estimatedTotal || 0), 0);
        map.set(emailLower, {
          uid: b.userId || `cust-bk-${b.id}`,
          email: b.userEmail,
          displayName: b.userName || b.userEmail.split('@')[0],
          phone: b.userPhone,
          provider: 'email',
          status: 'active',
          createdAt: b.createdAt,
          emailVerified: true,
          bookings: userBookings,
          totalSpend,
        });
      }
    }

    setCustomersList(Array.from(map.values()));
  };

  useEffect(() => {
    if (!isOpen) return;
    refreshBookings();
    refreshDestinations();
    refreshAdmins();
    const currentLocal = getLocalBookings();
    refreshCustomers(currentLocal);

    // Firestore live updates for bookings
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snap) => {
          if (!snap.empty) {
            const live: BookingRecord[] = [];
            snap.forEach((doc) => live.push(doc.data() as BookingRecord));
            setBookings(live);
            refreshCustomers(live);
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

  // Filter Customers (for All Admins Customer Directory)
  const filteredCustomers = customersList.filter((c) => {
    const q = customerSearchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.displayName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.toLowerCase().includes(q));

    const matchesProvider =
      customerProviderFilter === 'all' ||
      (customerProviderFilter === 'facebook' && c.provider === 'facebook') ||
      (customerProviderFilter === 'google' && c.provider === 'google') ||
      (customerProviderFilter === 'email' && (c.provider === 'email' || c.provider === 'credentials' || !c.provider));

    const matchesStatus =
      customerStatusFilter === 'all' || c.status === customerStatusFilter;

    return matchesSearch && matchesProvider && matchesStatus;
  });

  const handleCopyCustomerEmail = (email: string) => {
    navigator.clipboard?.writeText(email);
    setCopiedCustomerEmail(email);
    setTimeout(() => setCopiedCustomerEmail(null), 2000);
  };

  // Toggle Customer Active / Inactive Status (All Admins)
  const handleToggleCustomerStatus = async (cust: CustomerData, targetStatus: 'active' | 'inactive') => {
    setIsProcessingCustomer(true);
    try {
      await updateCustomerStatus(cust.email, targetStatus);
      setStatusActionSuccess(
        `Customer "${cust.displayName}" (${cust.email}) account is now marked as ${targetStatus === 'active' ? 'Active' : 'Inactive / Suspended'}.`
      );
      refreshCustomers();
    } catch (err: any) {
      alert(err?.message || 'Failed to update customer status');
    } finally {
      setIsProcessingCustomer(false);
    }
  };

  // Permanently Delete Customer Account (All Admins)
  const handleConfirmDeleteCustomer = async () => {
    if (!customerToDelete) return;
    setIsProcessingCustomer(true);
    try {
      await deleteCustomerUser(customerToDelete.email);
      setStatusActionSuccess(
        `Customer account for "${customerToDelete.displayName}" (${customerToDelete.email}) was permanently deleted.`
      );
      setCustomerToDelete(null);
      refreshCustomers();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete customer');
    } finally {
      setIsProcessingCustomer(false);
    }
  };

  // Open Edit Customer Info Modal
  const handleOpenEditCustomer = (cust: CustomerData) => {
    setCustomerToEdit(cust);
    setEditCustomerName(cust.displayName);
    setEditCustomerPhone(cust.phone || '');
    setEditCustomerStatus(cust.status);
  };

  // Save Customer Profile Updates
  const handleSaveCustomerEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerToEdit) return;
    setIsProcessingCustomer(true);
    try {
      await updateCustomerProfile(customerToEdit.email, {
        displayName: editCustomerName,
        phone: editCustomerPhone,
        status: editCustomerStatus,
      });
      setStatusActionSuccess(`Customer "${editCustomerName}" details updated successfully.`);
      setCustomerToEdit(null);
      refreshCustomers();
    } catch (err: any) {
      alert(err?.message || 'Failed to update customer details');
    } finally {
      setIsProcessingCustomer(false);
    }
  };

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
    const note = window.prompt('Add Curator note for approval:', 'Approved by Senior Curator. All bespoke arrangements reserved.') || '';
    await updateBookingStatus(booking.id, 'approved', note);
    refreshBookings();

    // Trigger email back to customer
    const emailLink = generateStatusEmailLink({ ...booking, adminNotes: note }, 'approved');
    setStatusActionSuccess(`Booking ${booking.code} APPROVED! Opening email to notify customer ${booking.userEmail}...`);
    window.open(emailLink, '_blank');
    setTimeout(() => setStatusActionSuccess(null), 5000);
  };

  const handleMarkPaid = async (booking: BookingRecord) => {
    const note = window.prompt('Add receipt confirmation note:', 'Full payment received and guaranteed by Asia Destination DMC.') || '';
    await updateBookingStatus(booking.id, 'paid', note);
    refreshBookings();

    // Trigger payment receipt email back to customer
    const emailLink = generateStatusEmailLink({ ...booking, adminNotes: note }, 'paid');
    setStatusActionSuccess(`Booking ${booking.code} marked as PAID! Opening confirmation receipt to ${booking.userEmail}...`);
    window.open(emailLink, '_blank');
    setTimeout(() => setStatusActionSuccess(null), 5000);
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

  // Add Secondary Admin Handler (Default Admin Only)
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminActionError(null);
    if (!newAdminEmail.trim() || !newAdminPassword.trim()) {
      setAdminActionError('Please provide an email and initial password for the new admin.');
      return;
    }
    if (newAdminPassword.length < 6) {
      setAdminActionError('Initial password must be at least 6 characters.');
      return;
    }

    try {
      await createAdmin(newAdminName || 'Regional Manager', newAdminEmail, newAdminPassword);
      refreshAdmins();
      setIsAddingAdmin(false);
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      setStatusActionSuccess(`New administrator account ${newAdminEmail} created successfully!`);
      setTimeout(() => setStatusActionSuccess(null), 4000);
    } catch (err: any) {
      setAdminActionError(err?.message || 'Failed to create administrator account.');
    }
  };

  // Delete Secondary Admin Handler
  const handleDeleteAdmin = async (emailToDelete: string) => {
    if (emailToDelete.toLowerCase() === DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase()) {
      alert('SECURITY CONSTRAINT: The default super administrator (phaophonna.1@gmail.com) is immutable and cannot be deleted.');
      return;
    }
    if (window.confirm(`Revoke admin access for ${emailToDelete}?`)) {
      try {
        await deleteAdmin(emailToDelete);
        refreshAdmins();
        setStatusActionSuccess(`Administrator ${emailToDelete} removed.`);
        setTimeout(() => setStatusActionSuccess(null), 3000);
      } catch (err: any) {
        alert(err?.message || 'Could not delete administrator.');
      }
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
                  Super Admin: <strong className="text-amber-400">{DEFAULT_SUPER_ADMIN_EMAIL}</strong>
                </span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                Asia Destination Management System
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex p-1 bg-stone-900 border border-stone-800 rounded-xl overflow-x-auto">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'bookings'
                      ? 'bg-amber-400 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Bookings ({bookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('destinations')}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'destinations'
                      ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Destinations & Pricing ({destinationsList.length})
                </button>
                <button
                  onClick={() => setActiveTab('customers')}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'customers'
                      ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Customers ({customersList.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('admins')}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'admins'
                      ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Admin Team ({adminUsers.length})
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
            
            {/* ================= TAB 1: CUSTOMER BOOKINGS ================= */}
            {activeTab === 'bookings' && (
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
                    filteredBookings.map((b, idx) => (
                      <div
                        key={`b-${b.id || b.code || idx}-${idx}`}
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
                            Auto-notifies admin: <strong className="text-stone-400">{DEFAULT_SUPER_ADMIN_EMAIL}</strong>
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* ================= TAB 2: DESTINATIONS & PRICING ENGINE ================= */}
            {activeTab === 'destinations' && (
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
                  {destinationsList.map((dest, idx) => (
                    <div
                      key={`dest-${dest.id}-${idx}`}
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

            {/* ================= TAB 3: ALL CUSTOMER USER INFORMATION (VISIBLE TO ALL ADMINS) ================= */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                {/* Header Policy Banner */}
                <div className="bg-stone-950 border border-amber-400/30 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
                      <Users className="w-4 h-4" /> Comprehensive Customer & Traveler Directory
                    </div>
                    <p className="text-xs text-stone-300 max-w-3xl leading-relaxed">
                      All administrators have full authority to view all registered customers, social identity providers (Facebook, Google, Email), verified identities, contact phone numbers, and luxury journey booking histories across Asia Destination DMC.
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-xs shrink-0 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Admin Visibility: Full Access</span>
                  </div>
                </div>

                {/* Customer Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-stone-950 border border-stone-800 rounded-xl p-4">
                    <span className="text-xs text-stone-500 uppercase tracking-wider block">
                      Total Customers
                    </span>
                    <span className="text-2xl font-serif font-bold text-white mt-1 block">
                      {customersList.length}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 block">Active customer profiles</span>
                  </div>

                  <div className="bg-stone-950 border border-emerald-500/20 rounded-xl p-4">
                    <span className="text-xs text-emerald-400 uppercase tracking-wider block">
                      Booked Travelers
                    </span>
                    <span className="text-2xl font-serif font-bold text-emerald-400 mt-1 block">
                      {customersList.filter((c) => c.bookings.length > 0).length}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 block">Submitted journey requests</span>
                  </div>

                  <div className="bg-stone-950 border border-amber-500/20 rounded-xl p-4">
                    <span className="text-xs text-amber-400 uppercase tracking-wider block">
                      Total Pipeline Value
                    </span>
                    <span className="text-2xl font-mono font-bold text-amber-400 mt-1 block">
                      ${customersList.reduce((sum, c) => sum + c.totalSpend, 0).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 block">Customer booking portfolio</span>
                  </div>

                  <div className="bg-stone-950 border border-sky-500/20 rounded-xl p-4">
                    <span className="text-xs text-sky-400 uppercase tracking-wider block">
                      Social Accounts
                    </span>
                    <span className="text-2xl font-serif font-bold text-sky-400 mt-1 block">
                      {customersList.filter((c) => c.provider === 'facebook' || c.provider === 'google').length}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 block">Facebook & Google SSO</span>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-stone-950/60 border border-stone-800 p-3 rounded-xl">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search customers by name, email, or phone..."
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Filter */}
                    <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 p-1 rounded-lg">
                      {(['all', 'active', 'inactive'] as const).map((st) => (
                        <button
                          key={`cust-status-${st}`}
                          onClick={() => setCustomerStatusFilter(st)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                            customerStatusFilter === st
                              ? 'bg-amber-400 text-stone-950 font-bold'
                              : 'text-stone-400 hover:text-white'
                          }`}
                        >
                          {st === 'all' ? 'All Status' : st}
                        </button>
                      ))}
                    </div>

                    {/* Provider Filter */}
                    <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 p-1 rounded-lg">
                      {(['all', 'facebook', 'google', 'email'] as const).map((prov) => (
                        <button
                          key={`prov-filter-${prov}`}
                          onClick={() => setCustomerProviderFilter(prov)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                            customerProviderFilter === prov
                              ? 'bg-amber-400 text-stone-950 font-bold'
                              : 'text-stone-400 hover:text-white'
                          }`}
                        >
                          {prov === 'all' ? 'All Providers' : prov}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Customers Cards & Details */}
                <div className="space-y-4">
                  {filteredCustomers.length === 0 ? (
                    <div className="text-center py-12 bg-stone-950/40 rounded-xl border border-stone-800">
                      <Users className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                      <p className="text-sm text-stone-400">No customers match the current filter or search criteria.</p>
                    </div>
                  ) : (
                    filteredCustomers.map((cust, idx) => {
                      const isExpanded = expandedCustomerId === cust.uid;
                      const isFacebook = cust.provider === 'facebook';
                      const isGoogle = cust.provider === 'google';
                      const isInactive = cust.status === 'inactive';

                      return (
                        <div
                          key={`cust-card-${cust.uid || cust.email}-${idx}`}
                          className={`bg-stone-950 border rounded-xl p-5 hover:border-stone-700 transition-all space-y-4 ${
                            isInactive ? 'border-rose-900/40 opacity-80' : 'border-stone-800'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Profile Left */}
                            <div className="flex items-start sm:items-center gap-3.5">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base shadow shrink-0 ${
                                  isFacebook
                                    ? 'bg-[#1877F2] text-white'
                                    : isGoogle
                                    ? 'bg-white text-stone-900'
                                    : 'bg-stone-800 text-amber-400 border border-stone-700'
                                }`}
                              >
                                {cust.displayName ? cust.displayName.charAt(0).toUpperCase() : 'C'}
                              </div>

                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-base font-bold text-white">
                                    {cust.displayName}
                                  </h4>
                                  
                                  {/* Provider Tag */}
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                                      isFacebook
                                        ? 'bg-[#1877F2]/15 text-[#1877F2] border border-[#1877F2]/30'
                                        : isGoogle
                                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                        : 'bg-stone-800 text-stone-300 border border-stone-700'
                                    }`}
                                  >
                                    {isFacebook ? 'Facebook SSO' : isGoogle ? 'Google Account' : 'Email Customer'}
                                  </span>

                                  {/* Status Badge (Active / Inactive) */}
                                  {isInactive ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Inactive / Suspended
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
                                    </span>
                                  )}

                                  {cust.emailVerified && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400 mt-1 font-mono">
                                  <div className="flex items-center gap-1.5 text-stone-300">
                                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{cust.email}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyCustomerEmail(cust.email)}
                                      className="text-stone-500 hover:text-white ml-1 cursor-pointer"
                                      title="Copy email"
                                    >
                                      {copiedCustomerEmail === cust.email ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>

                                  {cust.phone && (
                                    <div className="flex items-center gap-1.5 text-stone-300">
                                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                                      <span>{cust.phone}</span>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                                    <Clock className="w-3 h-3 text-stone-600" />
                                    <span>Joined: {new Date(cust.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Stats & Actions Right */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                              <div className="bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-right">
                                <span className="text-[9px] text-stone-400 uppercase tracking-wider block font-semibold">
                                  Bookings
                                </span>
                                <span className="text-xs font-bold text-white block">
                                  {cust.bookings.length} {cust.bookings.length === 1 ? 'Trip' : 'Trips'}
                                </span>
                              </div>

                              <div className="bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-right">
                                <span className="text-[9px] text-stone-400 uppercase tracking-wider block font-semibold">
                                  Total Spend
                                </span>
                                <span className="text-xs font-mono font-bold text-amber-400 block">
                                  ${cust.totalSpend.toLocaleString()}
                                </span>
                              </div>

                              {/* Toggle Active / Inactive (All Admins) */}
                              {isInactive ? (
                                <button
                                  type="button"
                                  disabled={isProcessingCustomer}
                                  onClick={() => handleToggleCustomerStatus(cust, 'active')}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow"
                                  title="Re-activate customer account"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Activate</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled={isProcessingCustomer}
                                  onClick={() => handleToggleCustomerStatus(cust, 'inactive')}
                                  className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-rose-950/40 border border-stone-700 hover:border-rose-500/40 text-stone-300 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Deactivate customer account"
                                >
                                  <Ban className="w-3.5 h-3.5 text-rose-400" />
                                  <span>Set Inactive</span>
                                </button>
                              )}

                              {/* Edit Customer Details (All Admins) */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditCustomer(cust)}
                                className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Edit customer profile"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>

                              {/* Delete Customer (All Admins) */}
                              <button
                                type="button"
                                disabled={isProcessingCustomer}
                                onClick={() => setCustomerToDelete(cust)}
                                className="p-1.5 rounded-lg bg-stone-900 hover:bg-rose-950/40 border border-stone-700 hover:border-rose-500/40 text-stone-400 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                                title="Permanently delete customer account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <a
                                href={`mailto:${cust.email}?subject=Asia%20Destination%20DMC%20-%20Bespoke%20Travel%20Concierge`}
                                className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white text-xs transition-colors cursor-pointer"
                                title="Email customer directly"
                              >
                                <Mail className="w-3.5 h-3.5 text-amber-400" />
                              </a>

                              {cust.bookings.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => setExpandedCustomerId(isExpanded ? null : cust.uid)}
                                  className="px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow"
                                >
                                  <span>{isExpanded ? 'Hide' : `Trips (${cust.bookings.length})`}</span>
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Expandable Booking Details for this Customer */}
                          {isExpanded && cust.bookings.length > 0 && (
                            <div className="pt-4 border-t border-stone-800/80 space-y-3">
                              <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" /> Luxury Journey Inquiries & Proposals for {cust.displayName}
                              </h5>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {cust.bookings.map((b, bIdx) => (
                                  <div
                                    key={`cust-bk-item-${b.id}-${bIdx}`}
                                    className="bg-stone-900/80 border border-stone-800 rounded-lg p-3.5 text-xs space-y-2 hover:border-stone-700 transition-colors"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-mono text-xs font-bold text-amber-400">
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

                                    <div>
                                      <span className="font-bold text-white text-sm block">
                                        {b.destinationName}
                                      </span>
                                      <span className="text-stone-400 text-[11px] block mt-0.5">
                                        {b.travelers} Guests · {b.tier} · Est. ${b.estimatedTotal.toLocaleString()}
                                      </span>
                                    </div>

                                    {b.notes && (
                                      <p className="text-[11px] text-stone-300 italic bg-stone-950/60 p-2 rounded border border-stone-800/80">
                                        "{b.notes}"
                                      </p>
                                    )}

                                    <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500">
                                      <span>Date: {new Date(b.createdAt).toLocaleDateString()}</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveTab('bookings');
                                          setSearchQuery(b.code);
                                        }}
                                        className="text-amber-400 hover:underline font-semibold cursor-pointer"
                                      >
                                        Open in Bookings →
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 4: ADMIN TEAM & ROLES (PROTECTED SUPER ADMIN) ================= */}
            {activeTab === 'admins' && (
              <div className="space-y-6">
                <div className="bg-stone-950 border border-amber-400/30 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
                      <ShieldCheck className="w-4 h-4" /> Administrative Hierarchy & Access Policy
                    </div>
                    <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
                      Default Super Admin (<strong className="text-white">{DEFAULT_SUPER_ADMIN_EMAIL}</strong>) is permanently protected and <strong>cannot be deleted by any user or administrator</strong>. Only the default admin has the authority to create new secondary administrators with email & password.
                    </p>
                  </div>

                  {isDefaultSuperAdmin && (
                    <button
                      onClick={() => setIsAddingAdmin(!isAddingAdmin)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shrink-0"
                    >
                      <UserPlus className="w-4 h-4" /> {isAddingAdmin ? 'Close Form' : 'Create New Admin'}
                    </button>
                  )}
                </div>

                {adminActionError && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>{adminActionError}</span>
                  </div>
                )}

                {/* Create Secondary Admin Form */}
                {isAddingAdmin && isDefaultSuperAdmin && (
                  <form
                    onSubmit={handleCreateAdmin}
                    className="bg-stone-950 border border-stone-800 rounded-xl p-5 space-y-4"
                  >
                    <div className="flex items-center gap-2 text-white font-serif font-bold text-sm pb-2 border-b border-stone-800">
                      <UserPlus className="w-4 h-4 text-amber-400" /> Register Secondary Administrator Account
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-stone-400 mb-1">Admin Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Kenji Sato"
                          value={newAdminName}
                          onChange={(e) => setNewAdminName(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-stone-400 mb-1">Admin Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="kenji.sato@asiadmc.travel"
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-stone-400 mb-1">Initial Password (min 6 chars) *</label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          placeholder="••••••••"
                          value={newAdminPassword}
                          onChange={(e) => setNewAdminPassword(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingAdmin(false)}
                        className="px-4 py-2 bg-stone-900 text-stone-400 hover:text-white text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md"
                      >
                        Create Administrator
                      </button>
                    </div>
                  </form>
                )}

                {/* Admins Table */}
                <div className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden">
                  <div className="px-5 py-3.5 bg-stone-900/60 border-b border-stone-800 text-xs font-semibold text-stone-400 flex items-center justify-between">
                    <span>Authorized System Administrators</span>
                    <span>Role & Security Status</span>
                  </div>

                  <div className="divide-y divide-stone-800/80">
                    {adminUsers.map((admin, idx) => {
                      const isDefault = admin.email.toLowerCase() === DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase();

                      return (
                        <div
                          key={`admin-${admin.uid || admin.email || idx}-${idx}`}
                          className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isDefault ? 'bg-amber-400/5' : 'hover:bg-stone-900/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                              isDefault ? 'bg-amber-400 text-stone-950' : 'bg-stone-800 text-stone-200'
                            }`}>
                              {admin.displayName ? admin.displayName.charAt(0).toUpperCase() : 'A'}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white text-xs sm:text-sm">
                                  {admin.displayName}
                                </span>
                                {isDefault ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-stone-950">
                                    <Lock className="w-3 h-3" /> DEFAULT SUPER ADMIN
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-stone-800 text-stone-300 border border-stone-700">
                                    Secondary Admin
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-stone-400 font-mono block">
                                {admin.email}
                              </span>
                              {admin.createdBy && (
                                <span className="text-[10px] text-stone-500 block">
                                  Created by: {admin.createdBy}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {isDefault ? (
                              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold px-3 py-1 bg-amber-400/10 rounded-lg border border-amber-400/20">
                                <Lock className="w-3.5 h-3.5" /> Immutable & Protected (Cannot Delete)
                              </div>
                            ) : (
                              isDefaultSuperAdmin && (
                                <button
                                  onClick={() => handleDeleteAdmin(admin.email)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-900 hover:bg-rose-950/60 text-stone-400 hover:text-rose-400 border border-stone-800 hover:border-rose-500/40 rounded-lg text-xs transition-colors cursor-pointer"
                                  title="Revoke Admin Access"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Revoke Access
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Delete Customer Confirmation Modal */}
        <AnimatePresence>
          {customerToDelete && (
            <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCustomerToDelete(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative z-10 w-full max-w-md bg-stone-900 border border-rose-500/40 rounded-2xl p-6 text-stone-100 shadow-2xl space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Permanently Delete Customer?</h3>
                    <p className="text-xs text-stone-400">This action will remove the customer profile from the system.</p>
                  </div>
                </div>

                <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 space-y-1 text-xs">
                  <div className="text-stone-300 font-semibold">{customerToDelete.displayName}</div>
                  <div className="font-mono text-stone-400">{customerToDelete.email}</div>
                  {customerToDelete.bookings.length > 0 && (
                    <div className="text-amber-400 text-[11px] pt-1">
                      ⚠️ Note: This customer has {customerToDelete.bookings.length} travel booking inquiry records in the database.
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCustomerToDelete(null)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isProcessingCustomer}
                    onClick={handleConfirmDeleteCustomer}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-lg shadow-rose-950"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isProcessingCustomer ? 'Deleting...' : 'Delete Customer Account'}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit Customer Profile Modal */}
        <AnimatePresence>
          {customerToEdit && (
            <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCustomerToEdit(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative z-10 w-full max-w-md bg-stone-900 border border-stone-700 rounded-2xl p-6 text-stone-100 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-amber-400" />
                    <h3 className="text-base font-bold text-white">Edit Customer Profile</h3>
                  </div>
                  <button
                    onClick={() => setCustomerToEdit(null)}
                    className="text-stone-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveCustomerEdit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Customer Email (Permanent)</label>
                    <input
                      type="text"
                      disabled
                      value={customerToEdit.email}
                      className="w-full px-3 py-2 bg-stone-950/60 border border-stone-800 rounded-lg text-stone-400 font-mono text-xs cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editCustomerName}
                      onChange={(e) => setEditCustomerName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Contact Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +855 12 345 678"
                      value={editCustomerPhone}
                      onChange={(e) => setEditCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1.5">Account Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setEditCustomerStatus('active')}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                          editCustomerStatus === 'active'
                            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Active</span>
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5">Can sign in and submit inquiries</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditCustomerStatus('inactive')}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                          editCustomerStatus === 'inactive'
                            ? 'bg-rose-950/40 border-rose-500/60 text-rose-300'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5">
                          <Ban className="w-3.5 h-3.5 text-rose-400" />
                          <span>Inactive</span>
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5">Account suspended / locked</div>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                    <button
                      type="button"
                      onClick={() => setCustomerToEdit(null)}
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessingCustomer}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isProcessingCustomer ? 'Saving...' : 'Save Customer Changes'}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
