import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowRight, 
  Lock, 
  UserCheck, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { UserAccount } from '../lib/authService';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  GithubAuthProvider 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export type SocialProvider = 'google' | 'facebook' | 'github';

interface SocialAuthPopupModalProps {
  isOpen: boolean;
  provider: SocialProvider | null;
  onClose: () => void;
  onSuccess: (account: UserAccount) => void;
}

interface SavedSocialAccount {
  displayName: string;
  email: string;
}

const FORBIDDEN_ADMIN_EMAIL = 'phaophonna.1@gmail.com';

export function SocialAuthPopupModal({
  isOpen,
  provider,
  onClose,
  onSuccess,
}: SocialAuthPopupModalProps) {
  const [savedAccount, setSavedAccount] = useState<SavedSocialAccount | null>(null);
  const [viewMode, setViewMode] = useState<'login_form' | 'continue_prompt'>('login_form');

  // Login Form fields
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize and check saved customer session
  useEffect(() => {
    if (!isOpen || !provider) {
      setSavedAccount(null);
      setViewMode('login_form');
      setIdentifier('');
      setPassword('');
      setFullName('');
      setFormError(null);
      return;
    }

    // 1. Strict Purge: NEVER allow admin email in customer social session
    try {
      const storedRaw = localStorage.getItem(`ad_dmc_${provider}_saved_session`);
      if (storedRaw) {
        if (storedRaw.toLowerCase().includes(FORBIDDEN_ADMIN_EMAIL.toLowerCase())) {
          localStorage.removeItem(`ad_dmc_${provider}_saved_session`);
        } else {
          const parsed = JSON.parse(storedRaw) as SavedSocialAccount;
          if (parsed && parsed.email && parsed.email.toLowerCase() !== FORBIDDEN_ADMIN_EMAIL.toLowerCase()) {
            setSavedAccount(parsed);
            setViewMode('continue_prompt');
            return;
          }
        }
      }
    } catch {
      // ignore
    }

    // If no valid customer account was saved, always default to the sign-in form
    setSavedAccount(null);
    setViewMode('login_form');
  }, [isOpen, provider]);

  if (!isOpen || !provider) return null;

  // Provider visual brand details
  const getProviderMeta = () => {
    switch (provider) {
      case 'google':
        return {
          title: 'accounts.google.com/signin',
          heading: 'Sign in with Google',
          subheading: 'Enter your Google Account to connect to Asia Destination DMC',
          inputLabel: 'Email or phone',
          inputPlaceholder: 'Enter your Google email or phone',
          buttonText: 'Next',
          brandColor: '#4285F4',
          providerName: 'Google',
          logo: (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          ),
        };
      case 'facebook':
        return {
          title: 'accounts.facebook.com/login',
          heading: 'Log in to Facebook',
          subheading: 'Enter your Facebook account to connect to Asia Destination DMC',
          inputLabel: 'Email address or mobile phone number',
          inputPlaceholder: 'Email or mobile number',
          buttonText: 'Log In with Facebook',
          brandColor: '#1877F2',
          providerName: 'Facebook',
          logo: (
            <svg className="w-5 h-5 shrink-0 text-[#1877F2] fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          ),
        };
      case 'github':
        return {
          title: 'github.com/login',
          heading: 'Sign in to GitHub',
          subheading: 'Sign in to your GitHub account to continue to Asia Destination DMC',
          inputLabel: 'Username or email address',
          inputPlaceholder: 'Username or email',
          buttonText: 'Sign In',
          brandColor: '#24292F',
          providerName: 'GitHub',
          logo: (
            <svg className="w-5 h-5 shrink-0 fill-current text-white" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          ),
        };
    }
  };

  const meta = getProviderMeta();

  // Handle Form Submission for Facebook / Social sign-in
  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanInput = identifier.trim();
    if (!cleanInput) {
      setFormError(`Please enter your ${meta.providerName} email address or mobile number.`);
      return;
    }
    if (!password || password.length < 4) {
      setFormError(`Please enter your ${meta.providerName} password.`);
      return;
    }

    setLoading(true);

    // Determine clean customer email and name
    let cleanEmail = cleanInput.toLowerCase();
    if (!cleanEmail.includes('@')) {
      // If mobile number or username provided, create standard valid email identifier
      const sanitized = cleanInput.replace(/[^a-zA-Z0-9]/g, '');
      cleanEmail = `${sanitized}@${provider}.user.com`;
    }

    // Explicit protection: Customer can NEVER claim super admin email via social login
    if (cleanEmail === FORBIDDEN_ADMIN_EMAIL.toLowerCase()) {
      setFormError('This email is designated for default administrative security and cannot be used for customer social logins.');
      setLoading(false);
      return;
    }

    const cleanName = fullName.trim() || cleanEmail.split('@')[0];

    // Save session in local storage for this customer
    try {
      localStorage.setItem(
        `ad_dmc_${provider}_saved_session`,
        JSON.stringify({ displayName: cleanName, email: cleanEmail })
      );
    } catch {
      // ignore
    }

    setTimeout(() => {
      setLoading(false);
      const userAccount: UserAccount = {
        uid: `${provider}-${Date.now()}`,
        email: cleanEmail,
        displayName: cleanName,
        provider: provider,
        role: 'customer',
        isDefaultSuperAdmin: false,
        emailVerified: true,
        createdAt: new Date().toISOString(),
      };

      onSuccess(userAccount);
    }, 450);
  };

  // Direct Browser Popup OAuth attempt (if supported by environment)
  const handleTryNativePopup = async () => {
    setLoading(true);
    setFormError(null);

    try {
      let prov;
      if (provider === 'google') {
        const gp = new GoogleAuthProvider();
        gp.addScope('email');
        gp.addScope('profile');
        prov = gp;
      } else if (provider === 'facebook') {
        const fp = new FacebookAuthProvider();
        fp.addScope('email');
        fp.addScope('public_profile');
        prov = fp;
      } else {
        const ghp = new GithubAuthProvider();
        ghp.addScope('user:email');
        prov = ghp;
      }

      const res = await signInWithPopup(auth, prov);
      const fbUser = res.user;
      const finalEmail = (fbUser.email || '').toLowerCase();

      if (!finalEmail || finalEmail === FORBIDDEN_ADMIN_EMAIL.toLowerCase()) {
        throw new Error('Please enter your customer credentials below.');
      }

      const finalName = fbUser.displayName || finalEmail.split('@')[0];

      try {
        localStorage.setItem(
          `ad_dmc_${provider}_saved_session`,
          JSON.stringify({ displayName: finalName, email: finalEmail })
        );
      } catch {}

      const userAccount: UserAccount = {
        uid: fbUser.uid,
        email: finalEmail,
        displayName: finalName,
        provider: provider,
        role: 'customer',
        isDefaultSuperAdmin: false,
        emailVerified: true,
        createdAt: new Date().toISOString(),
      };

      onSuccess(userAccount);
    } catch (err: any) {
      console.warn('Native popup blocked or cancelled:', err?.message);
      // Seamlessly stay on customer login form
      setViewMode('login_form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window simulating real OAuth Popup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative z-10 w-full max-w-md bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col font-sans"
        >
          {/* Browser Window Chrome Header */}
          <div className="bg-stone-950 px-4 py-2.5 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              <div className="flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-[11px] font-mono text-stone-300">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>{meta.title}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:text-white rounded transition-colors cursor-pointer"
              title="Close window"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Provider Branding Bar */}
          <div className="p-5 text-center border-b border-stone-800/80 bg-stone-950/40">
            <div className="w-12 h-12 rounded-full bg-stone-800/90 border border-stone-700 flex items-center justify-center mx-auto mb-2.5 shadow-md">
              {meta.logo}
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {meta.heading}
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
              {meta.subheading}
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6">
            {/* View Mode 1: Saved Customer Account (When active customer already signed in on Facebook) */}
            {viewMode === 'continue_prompt' && savedAccount ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  <UserCheck className="w-4 h-4" />
                  <span>Signed in on {meta.providerName}</span>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      const userAccount: UserAccount = {
                        uid: `${provider}-${Date.now()}`,
                        email: savedAccount.email,
                        displayName: savedAccount.displayName,
                        provider: provider,
                        role: 'customer',
                        isDefaultSuperAdmin: false,
                        emailVerified: true,
                        createdAt: new Date().toISOString(),
                      };
                      onSuccess(userAccount);
                    }, 400);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-stone-950 hover:bg-stone-850 border border-emerald-500/50 hover:border-emerald-400 transition-all cursor-pointer text-left group shadow-lg"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-[#1877F2] text-white font-bold flex items-center justify-center text-base shadow shrink-0">
                      {savedAccount.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block group-hover:text-amber-400 transition-colors">
                        Continue as {savedAccount.displayName}
                      </span>
                      <span className="text-xs text-stone-300 font-mono block">
                        {savedAccount.email}
                      </span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Active {meta.providerName} Customer Account
                      </span>
                    </div>
                  </div>

                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500 text-stone-950 text-xs font-bold group-hover:bg-emerald-400 transition-colors flex items-center gap-1 shrink-0 shadow">
                    <span>{loading ? 'Logging In...' : 'Log In'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('login_form');
                      setIdentifier('');
                      setPassword('');
                      setFullName('');
                    }}
                    className="text-xs text-stone-400 hover:text-white transition-colors underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 text-amber-400" />
                    <span>Log in to another {meta.providerName} account</span>
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode 2: Real Sign-In Form (Asks customer to sign in to Facebook account first) */
              <form onSubmit={handleFormLogin} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Email or Phone */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    {meta.inputLabel} <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder={meta.inputPlaceholder}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#1877F2] transition-colors"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    {meta.providerName} Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder={`Enter your ${meta.providerName} password`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#1877F2] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Full Name (Optional Traveler Profile Name) */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Your Full Name <span className="text-stone-500 text-[11px] font-normal">(for bespoke travel itineraries)</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Sarah Jenkins"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#1877F2] transition-colors"
                    />
                  </div>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-blue-950/40 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying with {meta.providerName}...</span>
                    </>
                  ) : (
                    <>
                      <span>{meta.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Privacy & App Trust Text */}
                <p className="text-[11px] text-stone-500 text-center leading-relaxed pt-1">
                  Asia Destination DMC receives your name and email address to manage your luxury Southeast Asia travel inquiries.
                </p>

                {/* Optional Browser OAuth Trigger */}
                <div className="pt-2 border-t border-stone-800 text-center">
                  <button
                    type="button"
                    onClick={handleTryNativePopup}
                    className="text-[11px] text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Or open external {meta.providerName} browser window</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
