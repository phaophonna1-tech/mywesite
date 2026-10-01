import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, UserCheck, Mail, Sparkles, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'customer' | 'admin';
}

export function AuthModal({ isOpen, onClose, defaultRole = 'customer' }: AuthModalProps) {
  const { signInWithGoogle, signInQuickRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'admin'>(defaultRole);
  const [customEmail, setCustomEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setError('Google Sign In popup closed or blocked. You can use the Quick Sign In buttons below.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'customer' | 'admin', email?: string) => {
    setLoading(true);
    await signInQuickRole(role, email);
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Asia Destination Portal
            </span>
            <h3 className="text-2xl font-serif font-bold text-white">
              Welcome to Asia DMC
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Select your role to access bespoke bookings and administrative controls
            </p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-950 rounded-xl border border-stone-800 mb-6">
            <button
              onClick={() => setSelectedRole('customer')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedRole === 'customer'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Customer Login
            </button>
            <button
              onClick={() => setSelectedRole('admin')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Admin Console
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
              {error}
            </div>
          )}

          {/* Role specific description */}
          {selectedRole === 'admin' ? (
            <div className="bg-stone-950/80 border border-amber-500/20 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                <ShieldCheck className="w-4 h-4" /> Administrator Privileges
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Linked super admin: <strong className="text-white">phaophonna.1@gmail.com</strong>.
                Allows reviewing all customer bookings, approving reservations, marking payments, and adding/editing destinations and prices.
              </p>
            </div>
          ) : (
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                <UserCheck className="w-4 h-4" /> Traveler / Customer
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                View your active and previous booking itineraries, monitor approval and payment status in real-time, and download your travel vouchers.
              </p>
            </div>
          )}

          {/* Quick Sign In Buttons */}
          <div className="space-y-3">
            {selectedRole === 'admin' ? (
              <button
                disabled={loading}
                onClick={() => handleQuickLogin('admin', 'phaophonna.1@gmail.com')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-amber-400/20"
              >
                <ShieldCheck className="w-4 h-4" /> Sign In as Admin (phaophonna.1@gmail.com)
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={() => handleQuickLogin('customer', customEmail || 'guest.traveler@gmail.com')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-amber-400/20"
              >
                <UserCheck className="w-4 h-4" /> Sign In as Customer
              </button>
            )}

            {/* Google Authentication via Firebase */}
            <button
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stone-950 hover:bg-stone-800 text-stone-200 border border-stone-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google Account
            </button>
          </div>

          {/* Custom email alternative */}
          <div className="mt-5 pt-5 border-t border-stone-800">
            <label className="block text-[11px] font-medium text-stone-400 mb-1 text-left">
              Or sign in with custom email:
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your.email@example.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="flex-1 px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={() => handleQuickLogin(selectedRole, customEmail || undefined)}
                className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Go
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
