import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  Compass, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  CreditCard,
  Copy,
  Check,
  Send,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BookingRecord, getLocalBookings, updateBookingStatus } from '../lib/bookingService';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CustomerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onNewBookingClick: () => void;
}

export function CustomerDashboard({ isOpen, onClose, onNewBookingClick }: CustomerDashboardProps) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // First load from local storage
    const loadFromLocal = () => {
      const all = getLocalBookings();
      if (user) {
        const filtered = all.filter(
          (b) => b.userId === user.uid || b.userEmail.toLowerCase() === user.email.toLowerCase()
        );
        setBookings(filtered);
      } else {
        setBookings(all.slice(0, 3)); // preview
      }
    };
    loadFromLocal();

    // Try live Firestore listener if user authenticated
    if (user) {
      try {
        const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            if (!snapshot.empty) {
              const live: BookingRecord[] = [];
              snapshot.forEach((doc) => live.push(doc.data() as BookingRecord));
              setBookings(live);
            }
          },
          (err) => {
            console.warn('Customer bookings listener fallback:', err);
          }
        );
        return () => unsubscribe();
      } catch (e) {
        // use local
      }
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking request?')) {
      await updateBookingStatus(bookingId, 'cancelled', 'Cancelled by traveler');
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    }
  };

  const getStatusBadge = (status: BookingRecord['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed & Paid
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved by DMC
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Clock className="w-3.5 h-3.5" /> Under Curator Review
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative z-10 bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
                  Customer Travel Portal
                </span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                My Bookings & Expeditions
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 mt-1">
                <span>Account:</span>
                <strong className="text-white">{user?.displayName || 'Traveler'}</strong>
                <span className="text-stone-600">•</span>
                <span className="text-amber-400 font-mono font-medium">{user?.email || 'guest@asiadmc.travel'}</span>
                {user?.provider && (
                  <span className="uppercase text-[10px] bg-stone-800 text-stone-300 font-bold px-2 py-0.5 rounded border border-stone-700">
                    via {user.provider}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bookings List */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Compass className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                <h4 className="text-lg font-serif font-bold text-white mb-1">
                  No Active Bookings Yet
                </h4>
                <p className="text-xs text-stone-400 max-w-sm mx-auto mb-6">
                  Ready to experience bespoke luxury across Asia? Plan an expedition or select an itinerary to submit your first proposal.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onNewBookingClick();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg"
                >
                  <Sparkles className="w-4 h-4" /> Design Your Bespoke Journey
                </button>
              </div>
            ) : (
              bookings.map((booking, idx) => (
                <div
                  key={`cb-${booking.id || booking.code || idx}-${idx}`}
                  className="bg-stone-950 border border-stone-800 rounded-xl p-5 hover:border-stone-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800/80">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-amber-400 tracking-wider">
                          {booking.code}
                        </span>
                        <button
                          onClick={() => handleCopy(booking.code)}
                          className="p-1 text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
                          title="Copy reference code"
                        >
                          {copiedCode === booking.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <h4 className="text-lg font-serif font-bold text-white">
                        {booking.destinationName}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
                    <div>
                      <span className="text-stone-500 block">Travelers</span>
                      <span className="text-stone-200 font-medium">{booking.travelers} Guests</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Tier Level</span>
                      <span className="text-stone-200 font-medium">{booking.tier}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Estimated Investment</span>
                      <span className="font-mono font-bold text-amber-400">
                        ${booking.estimatedTotal.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Submitted On</span>
                      <span className="text-stone-300">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Curator feedback & Notes */}
                  {booking.adminNotes && (
                    <div className="mt-2 p-3 bg-stone-900 border border-amber-500/20 rounded-lg text-xs">
                      <span className="text-amber-400 font-semibold block mb-0.5">
                        Senior Curator Message:
                      </span>
                      <p className="text-stone-300 italic">{booking.adminNotes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
                    <span className="text-stone-500">
                      Agency support: <a href="mailto:phaophonna.1@gmail.com" className="text-amber-400 underline">phaophonna.1@gmail.com</a>
                    </span>
                    <div className="flex items-center gap-3">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          Cancel Request
                        </button>
                      )}
                      {booking.status === 'approved' && (
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Payment
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Total bookings: {bookings.length}
            </span>
            <button
              onClick={() => {
                onClose();
                onNewBookingClick();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Request Another Itinerary
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
