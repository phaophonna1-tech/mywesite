import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  Mail, 
  Lock, 
  Sparkles, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Send,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_SUPER_ADMIN_EMAIL } from '../lib/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'customer' | 'admin';
}

type AuthMode = 'customer_login' | 'customer_register' | 'admin_login' | 'forgot_password';

export function AuthModal({ isOpen, onClose, defaultRole = 'customer' }: AuthModalProps) {
  const { 
    login, 
    register, 
    sendOtp, 
    verifyOtp, 
    resetPassword, 
    loginSocial 
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>(
    defaultRole === 'admin' ? 'admin_login' : 'customer_login'
  );

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification state
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [generatedOtpDisplay, setGeneratedOtpDisplay] = useState<string | null>(null);
  const [mailtoUrl, setMailtoUrl] = useState<string | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Reset local form states on switch
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccessMsg(null);
    setIsOtpSent(false);
    setGeneratedOtpDisplay(null);
    setOtpCode('');
    if (newMode === 'admin_login' && !email) {
      setEmail(DEFAULT_SUPER_ADMIN_EMAIL);
      setPassword('admin12345');
    }
  };

  // 1. Customer Sign In
  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await login(email, password, 'customer');
      setSuccessMsg('Successfully signed in as Customer!');
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Admin Sign In
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your administrator email and password.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await login(email, password, 'admin');
      setSuccessMsg('Welcome, Administrator!');
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      setError(err?.message || 'Admin login failed.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Customer Registration - Step 1: Send OTP to Email
  const handleSendRegistrationOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await sendOtp(email, 'register');
      setIsOtpSent(true);
      setGeneratedOtpDisplay(res.code);
      setMailtoUrl(res.mailtoUrl);
      setSuccessMsg(`A 6-digit authentication code has been dispatched to ${email}.`);
    } catch (err: any) {
      setError(err?.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Customer Registration - Step 2: Verify Code and Create Account
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const valid = await verifyOtp(email, otpCode, 'register');
      if (!valid) {
        setError('Invalid or expired verification code. Please check and try again.');
        setLoading(false);
        return;
      }

      await register(name, email, password);
      setSuccessMsg('Email verified! Account created successfully.');
      setTimeout(() => onClose(), 1000);
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Forgot Password - Step 1: Send Reset Code
  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter your registered email address.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await sendOtp(email, 'reset_password');
      setIsOtpSent(true);
      setGeneratedOtpDisplay(res.code);
      setMailtoUrl(res.mailtoUrl);
      setSuccessMsg(`Password reset code sent to ${email}.`);
    } catch (err: any) {
      setError(err?.message || 'Failed to dispatch reset code.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password - Step 2: Verify & Set New Password
  const handleVerifyAndResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit reset code.');
      return;
    }
    if (password.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const valid = await verifyOtp(email, otpCode, 'reset_password');
      if (!valid) {
        setError('Invalid or expired reset code.');
        setLoading(false);
        return;
      }

      await resetPassword(email, password);
      setSuccessMsg('Your password has been successfully updated! You can now sign in.');
      setTimeout(() => switchMode('customer_login'), 1500);
    } catch (err: any) {
      setError(err?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Social Login Handler
  const handleSocial = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      setLoading(true);
      setError(null);
      await loginSocial(provider);
      setSuccessMsg(`Signed in with ${provider}!`);
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      setError(`Failed to sign in with ${provider}.`);
    } finally {
      setLoading(false);
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
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Asia Destination DMC Access
            </span>
            <h3 className="text-2xl font-serif font-bold text-white">
              {mode === 'customer_login' && 'Customer Sign In'}
              {mode === 'customer_register' && 'Traveler Registration'}
              {mode === 'admin_login' && 'Administrator Portal'}
              {mode === 'forgot_password' && 'Reset Your Password'}
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              {mode === 'customer_login' && 'Sign in with your email and password to track your bookings'}
              {mode === 'customer_register' && 'Create your account with email authentication code'}
              {mode === 'admin_login' && 'Secure authentication for authorized destination managers'}
              {mode === 'forgot_password' && 'Enter your email to receive a 6-digit reset code'}
            </p>
          </div>

          {/* Navigation Mode Pill Tabs */}
          {mode !== 'forgot_password' && (
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-950 rounded-xl border border-stone-800 mb-5">
              <button
                onClick={() => switchMode('customer_login')}
                className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'customer_login'
                    ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Customer Sign In
              </button>
              <button
                onClick={() => switchMode('customer_register')}
                className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'customer_register'
                    ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Register (OTP)
              </button>
              <button
                onClick={() => switchMode('admin_login')}
                className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'admin_login'
                    ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Admin Login
              </button>
            </div>
          )}

          {/* Notification Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* OTP Code Display Helper for local / demo testing */}
          {isOtpSent && generatedOtpDisplay && (
            <div className="mb-5 p-3.5 bg-amber-400/10 border border-amber-400/30 rounded-xl text-left">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1">
                <span>Code Dispatched to {email}</span>
                {mailtoUrl && (
                  <a
                    href={mailtoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] underline hover:text-amber-200 flex items-center gap-1"
                  >
                    Open Mail App <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-[11px] text-stone-300 mb-2">
                Authentication Code:
              </p>
              <div className="flex items-center justify-between bg-stone-950 p-2 rounded-lg border border-amber-400/20 font-mono text-base font-bold text-amber-400 tracking-widest text-center">
                <span className="w-full text-center">{generatedOtpDisplay}</span>
              </div>
            </div>
          )}

          {/* ==================== 1. CUSTOMER SIGN IN FORM ==================== */}
          {mode === 'customer_login' && (
            <form onSubmit={handleCustomerLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Customer Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="traveler@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-stone-400">Password</label>
                  <button
                    type="button"
                    onClick={() => switchMode('forgot_password')}
                    className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-amber-400/20"
              >
                {loading ? 'Authenticating...' : 'Sign In with Email & Password'}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-stone-500">Not registered yet? </span>
                <button
                  type="button"
                  onClick={() => switchMode('customer_register')}
                  className="text-xs text-amber-400 font-semibold hover:underline cursor-pointer"
                >
                  Register with Email Code
                </button>
              </div>
            </form>
          )}

          {/* ==================== 2. CUSTOMER REGISTRATION FORM (WITH 6-DIGIT OTP) ==================== */}
          {mode === 'customer_register' && (
            <div className="space-y-4">
              {!isOtpSent ? (
                <form onSubmit={handleSendRegistrationOtp} className="space-y-3.5">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="eleanor@luxurytravel.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Create Password (min. 6 characters)</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-amber-400/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Send 6-Digit Authentication Code
                  </button>

                  <div className="text-center pt-1">
                    <span className="text-xs text-stone-500">Already have an account? </span>
                    <button
                      type="button"
                      onClick={() => switchMode('customer_login')}
                      className="text-xs text-amber-400 font-semibold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                  <div className="text-left bg-stone-950 p-3 rounded-xl border border-stone-800">
                    <span className="text-[11px] text-stone-400 block mb-1">
                      Enter the 6-digit authentication code sent to:
                    </span>
                    <strong className="text-amber-400 text-xs">{email}</strong>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-300 font-semibold mb-1.5">
                      6-Digit Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 bg-stone-950 border border-amber-400/40 rounded-xl text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOtpSent(false)}
                      className="w-1/3 py-2.5 bg-stone-800 text-stone-300 text-xs rounded-xl hover:bg-stone-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-2/3 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg"
                    >
                      {loading ? 'Verifying...' : 'Verify & Register'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ==================== 3. ADMIN SIGN IN FORM ==================== */}
          {mode === 'admin_login' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-3 text-left">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs mb-1">
                  <ShieldCheck className="w-4 h-4" /> Protected Administrator Access
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  Default Super Admin: <strong className="text-white">phaophonna.1@gmail.com</strong> (Protected from deletion). Secondary admins must be created by the default admin.
                </p>
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Admin Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-stone-400">Admin Password</label>
                  <button
                    type="button"
                    onClick={() => switchMode('forgot_password')}
                    className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-amber-400/20"
              >
                {loading ? 'Authenticating Admin...' : 'Sign In as Administrator'}
              </button>
            </form>
          )}

          {/* ==================== 4. FORGOT PASSWORD FLOW ==================== */}
          {mode === 'forgot_password' && (
            <div className="space-y-4">
              {!isOtpSent ? (
                <form onSubmit={handleSendResetOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Registered Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg"
                  >
                    {loading ? 'Sending Code...' : 'Send 6-Digit Password Reset Code'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => switchMode('customer_login')}
                      className="text-xs text-stone-400 hover:text-white"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyAndResetPassword} className="space-y-3.5">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Enter 6-Digit Reset Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full text-center tracking-[0.4em] font-mono text-xl py-2 bg-stone-950 border border-amber-400/40 rounded-xl text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">New Password (min 6 chars)</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOtpSent(false)}
                      className="w-1/3 py-2.5 bg-stone-800 text-stone-300 text-xs rounded-xl hover:bg-stone-700"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-2/3 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl shadow-lg"
                    >
                      {loading ? 'Updating...' : 'Set New Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ==================== 5. SOCIAL AUTHENTICATION OPTIONS ==================== */}
          {mode !== 'forgot_password' && (
            <div className="mt-6 pt-5 border-t border-stone-800/80">
              <span className="block text-[11px] font-medium text-stone-400 mb-3 text-center">
                Or continue with social account
              </span>
              <div className="grid grid-cols-3 gap-2">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleSocial('google')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs text-stone-300 transition-colors cursor-pointer"
                  title="Sign in with Google"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
                  Google
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={() => handleSocial('facebook')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs text-stone-300 transition-colors cursor-pointer"
                  title="Sign in with Facebook"
                >
                  <svg className="w-3.5 h-3.5 shrink-0 text-blue-500 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>

                {/* GitHub */}
                <button
                  type="button"
                  onClick={() => handleSocial('github')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs text-stone-300 transition-colors cursor-pointer"
                  title="Sign in with GitHub"
                >
                  <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
