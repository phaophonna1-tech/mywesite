import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Copy, Check, X, Compass, Calendar, ArrowRight, Mail, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { BookingRecord, generateAdminNotificationEmail } from '../lib/bookingService';

interface ConfirmationModalProps {
  confirmation: {
    code: string;
    destinationName: string;
    total: number;
    travelers: number;
    email: string;
    bookingRecord?: BookingRecord;
  } | null;
  onClose: () => void;
  onOpenCustomerDashboard?: () => void;
}

export function ConfirmationModal({ confirmation, onClose, onOpenCustomerDashboard }: ConfirmationModalProps) {
  const [copied, setCopied] = useState(false);

  if (!confirmation) return null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(confirmation.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendAdminEmail = () => {
    if (confirmation.bookingRecord) {
      const link = generateAdminNotificationEmail(confirmation.bookingRecord);
      window.open(link, '_blank');
    } else {
      const subject = encodeURIComponent(`[Booking Request] ${confirmation.code} - ${confirmation.destinationName}`);
      const body = encodeURIComponent(`Adminphaophonna.1@gmail.com,\n\nA new booking has been created:\nCode: ${confirmation.code}\nDestination: ${confirmation.destinationName}\nGuests: ${confirmation.travelers}\nTotal: $${confirmation.total}\nClient: ${confirmation.email}`);
      window.open(`mailto:phaophonna.1@gmail.com?subject=${subject}&body=${body}`, '_blank');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl text-center"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-400/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-serif font-bold text-white mb-2">
            Expedition Request Received
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mb-5 leading-relaxed">
            Your personalized itinerary request has been securely recorded and assigned to our senior regional curator. Outline sent to <span className="text-amber-400 font-medium">{confirmation.email}</span>.
          </p>

          {/* Reference Card */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 text-left space-y-3 mb-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <span className="text-xs text-stone-400 uppercase tracking-wider">Itinerary Code</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white tracking-widest">
                  {confirmation.code}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1 hover:text-amber-400 text-stone-400 transition-colors cursor-pointer"
                  title="Copy Itinerary Code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between text-xs text-stone-300">
              <span className="text-stone-400">Destination:</span>
              <span className="font-medium text-white">{confirmation.destinationName}</span>
            </div>

            <div className="flex justify-between text-xs text-stone-300">
              <span className="text-stone-400">Guests:</span>
              <span className="font-medium text-white">{confirmation.travelers} Guests</span>
            </div>

            <div className="flex justify-between text-xs text-stone-300">
              <span className="text-stone-400">Estimated Total:</span>
              <span className="font-mono font-bold text-amber-400 tabular-nums">
                ${confirmation.total.toLocaleString()}
              </span>
            </div>

            <div className="pt-2 border-t border-stone-800 flex justify-between text-[11px] text-stone-400">
              <span>Admin Assigned:</span>
              <span className="text-amber-400 font-medium">phaophonna.1@gmail.com</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {/* Direct Send to Admin Email */}
            <button
              onClick={handleSendAdminEmail}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-400/30 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4 text-amber-400" /> Dispatch Dossier to phaophonna.1@gmail.com
            </button>

            {onOpenCustomerDashboard && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCustomerDashboard();
                }}
                className="w-full py-2.5 bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                View in "My Bookings"
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
