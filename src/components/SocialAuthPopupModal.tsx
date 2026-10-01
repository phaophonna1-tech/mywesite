import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Check, ArrowRight, Lock, ExternalLink, AlertCircle, User, Mail } from 'lucide-react';
import { UserAccount } from '../lib/authService';

export type SocialProvider = 'google' | 'facebook' | 'github';

interface SocialAuthPopupModalProps {
  isOpen: boolean;
  provider: SocialProvider | null;
  onClose: () => void;
  onSuccess: (account: UserAccount) => void;
}

export function SocialAuthPopupModal({
  isOpen,
  provider,
  onClose,
  onSuccess,
}: SocialAuthPopupModalProps) {
  const [accountEmail, setAccountEmail] = useState('');
  const [accountName, setAccountName] = useState('');
  const [step, setStep] = useState<'choose' | 'authorize'>('choose');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !provider) return null;

  // Defaults per provider
  const getProviderInfo = () => {
    switch (provider) {
      case 'google':
        return {
          title: 'Google Accounts',
          heading: 'Sign in with Google',
          subheading: 'Choose your Google account to authorize Asia Destination DMC',
          accentColor: '#4285F4',
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
          permissions: [
            'Name, profile picture, and Google Account identity',
            'Primary Google Account email address',
            'Connect and sync personalized itinerary bookings',
          ],
          defaultAccount: {
            name: 'Phaophonna',
            email: 'phaophonna@gmail.com',
          },
        };
      case 'facebook':
        return {
          title: 'Facebook Login',
          heading: 'Log in with Facebook',
          subheading: 'Asia Destination DMC will receive your Facebook name, profile picture and email address',
          accentColor: '#1877F2',
          providerName: 'Facebook',
          logo: (
            <svg className="w-5 h-5 shrink-0 text-[#1877F2] fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          ),
          permissions: [
            'Public Facebook Profile (Name and avatar)',
            'Verified email address linked to your Facebook account',
          ],
          defaultAccount: {
            name: 'Phaophonna',
            email: 'phaophonna@gmail.com',
          },
        };
      case 'github':
        return {
          title: 'GitHub Authorization',
          heading: 'Authorize Asia Destination DMC',
          subheading: 'Asia Destination DMC wants to access your GitHub account identity and email',
          accentColor: '#24292F',
          providerName: 'GitHub',
          logo: (
            <svg className="w-5 h-5 shrink-0 fill-current text-white" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          ),
          permissions: [
            'Read-only access to user profile information (Name, handle, avatar)',
            'Read-only access to verified GitHub email address',
          ],
          defaultAccount: {
            name: 'Phaophonna',
            email: 'phaophonna@gmail.com',
          },
        };
    }
  };

  const info = getProviderInfo();

  const handleSelectAccount = (selectedName: string, selectedEmail: string) => {
    setAccountName(selectedName);
    setAccountEmail(selectedEmail);
    setStep('authorize');
  };

  const handleAuthorize = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const chosenEmail = (accountEmail.trim() || info.defaultAccount.email).toLowerCase();
      const chosenName = accountName.trim() || (accountEmail.trim() && accountEmail.includes('@') ? accountEmail.split('@')[0] : info.defaultAccount.name);

      // Customer third-party sign-in is ALWAYS customer role with non-admin privileges
      const userAccount: UserAccount = {
        uid: `${provider}-${Date.now()}`,
        email: chosenEmail,
        displayName: chosenName,
        provider: provider,
        role: 'customer',
        isDefaultSuperAdmin: false,
        emailVerified: true,
        createdAt: new Date().toISOString(),
      };

      onSuccess(userAccount);
    }, 500);
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
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="relative z-10 w-full max-w-md bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col font-sans"
        >
          {/* Browser Window Chrome Header */}
          <div className="bg-stone-950 px-4 py-2.5 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-[11px] font-mono text-stone-300">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>accounts.{provider}.com/oauth/authorize</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:text-white rounded transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Provider Branding Bar */}
          <div className="p-6 text-center border-b border-stone-800/80 bg-stone-950/40">
            <div className="w-12 h-12 rounded-full bg-stone-800/80 border border-stone-700 flex items-center justify-center mx-auto mb-3 shadow-md">
              {info.logo}
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {info.heading}
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
              {info.subheading}
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5">
            {step === 'choose' ? (
              <div className="space-y-4">
                <span className="text-xs font-semibold text-stone-400 block uppercase tracking-wider">
                  Select an account to sign in:
                </span>

                {/* Primary Customer Account Card */}
                <button
                  onClick={() => handleSelectAccount(info.defaultAccount.name, info.defaultAccount.email)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-stone-950 hover:bg-stone-800/90 border border-stone-800 hover:border-amber-400/40 transition-all cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-400 text-stone-950 font-bold flex items-center justify-center text-sm shadow">
                      {info.defaultAccount.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-amber-400 transition-colors">
                        {info.defaultAccount.name}
                      </span>
                      <span className="text-xs text-stone-400 font-mono block">
                        {info.defaultAccount.email}
                      </span>
                      <span className="text-[10px] text-amber-400/90 flex items-center gap-1 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-400" /> Customer {info.providerName} Account
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors" />
                </button>

                {/* Or Custom Account Form */}
                <div className="pt-3 border-t border-stone-800/80 space-y-3">
                  <span className="text-xs text-stone-400 block font-medium">
                    Or sign in with another {info.providerName} account:
                  </span>
                  
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">Your {info.providerName} Full Name</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. Phaophonna"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">Your {info.providerName} Email Address</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder={`your.account@${provider === 'google' ? 'gmail.com' : 'example.com'}`}
                        value={accountEmail}
                        onChange={(e) => setAccountEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const finalEmail = accountEmail.trim() || info.defaultAccount.email;
                      const finalName = accountName.trim() || (accountEmail.trim() && accountEmail.includes('@') ? accountEmail.split('@')[0] : info.defaultAccount.name);
                      handleSelectAccount(finalName, finalEmail);
                    }}
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Continue with this {info.providerName} Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Permission Authorization and Consent screen */
              <div className="space-y-4 text-left">
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-stone-950 font-bold flex items-center justify-center text-sm shadow">
                    {(accountName || 'P').charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {accountName || info.defaultAccount.name}
                    </span>
                    <span className="text-xs text-amber-400 font-mono block">
                      {accountEmail || info.defaultAccount.email}
                    </span>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block mt-0.5">
                      Customer Profile • Verified via {info.providerName}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-stone-300 block">
                    Asia Destination DMC will receive:
                  </span>
                  <ul className="space-y-2 text-xs text-stone-400">
                    {info.permissions.map((perm, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 text-[11px] text-stone-400 leading-relaxed">
                  You are authenticating as a traveler client. Your bookings and requests will be saved under this customer account.
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('choose')}
                    className="w-1/3 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleAuthorize}
                    className="w-2/3 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-400/20 flex items-center justify-center gap-1.5"
                  >
                    {loading ? 'Signing in...' : 'Allow & Accept'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
