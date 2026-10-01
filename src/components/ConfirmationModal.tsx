import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Copy, Check, X, Compass, Calendar, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface ConfirmationModalProps {
  confirmation: {
    code: string;
    destinationName: string;
    total: number;
    travelers: number;
    email: string;
  } | null;
  onClose: () => void;
}

export function ConfirmationModal({ confirmation, onClose }: ConfirmationModalProps) {
  const [copied, setCopied] = useState(false);

  if (!confirmation) return null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(confirmation.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <p className="text-xs sm:text-sm text-stone-300 mb-6 leading-relaxed">
            Your personalized itinerary request has been assigned to our senior regional expedition curator. We have sent an outline to <span className="text-amber-400 font-medium">{confirmation.email}</span>.
          </p>

          {/* Reference Card */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 text-left space-y-3 mb-6">
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
          </div>

          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm rounded-lg transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
