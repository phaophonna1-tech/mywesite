import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  UserAccount, 
  DEFAULT_SUPER_ADMIN_EMAIL,
  getLocalUsers, 
  loginWithEmailPassword, 
  registerCustomer, 
  sendVerificationCode, 
  verifyCode, 
  resetUserPassword,
  createSecondaryAdmin,
  deleteSecondaryAdmin,
  loginWithProvider,
  signOutAuth
} from '../lib/authService';

interface AuthContextType {
  user: UserAccount | null;
  role: 'customer' | 'admin' | null;
  isAdmin: boolean;
  isDefaultSuperAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string, role?: 'customer' | 'admin') => Promise<UserAccount>;
  register: (name: string, email: string, pass: string) => Promise<UserAccount>;
  sendOtp: (email: string, purpose: 'register' | 'reset_password') => Promise<{ code: string; mailtoUrl: string }>;
  verifyOtp: (email: string, code: string, purpose: 'register' | 'reset_password') => Promise<boolean>;
  resetPassword: (email: string, newPass: string) => Promise<void>;
  loginSocial: (provider: 'google' | 'facebook' | 'github', selectedAccount?: Partial<UserAccount>) => Promise<UserAccount>;
  createAdmin: (name: string, email: string, initialPass: string) => Promise<UserAccount>;
  deleteAdmin: (email: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isAdmin: false,
  isDefaultSuperAdmin: false,
  loading: true,
  login: async () => ({} as UserAccount),
  register: async () => ({} as UserAccount),
  sendOtp: async () => ({ code: '', mailtoUrl: '' }),
  verifyOtp: async () => false,
  resetPassword: async () => {},
  loginSocial: async () => ({} as UserAccount),
  createAdmin: async () => ({} as UserAccount),
  deleteAdmin: async () => {},
  signOutUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize and check persisted session
  useEffect(() => {
    try {
      const activeRaw = localStorage.getItem('ad_dmc_active_session');
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw) as UserAccount;
        setUser(parsed);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string, role?: 'customer' | 'admin') => {
    const account = await loginWithEmailPassword(email, pass, role);
    setUser(account);
    localStorage.setItem('ad_dmc_active_session', JSON.stringify(account));
    return account;
  };

  const register = async (name: string, email: string, pass: string) => {
    const account = await registerCustomer(name, email, pass);
    setUser(account);
    localStorage.setItem('ad_dmc_active_session', JSON.stringify(account));
    return account;
  };

  const sendOtp = async (email: string, purpose: 'register' | 'reset_password') => {
    return await sendVerificationCode(email, purpose);
  };

  const verifyOtp = async (email: string, code: string, purpose: 'register' | 'reset_password') => {
    return await verifyCode(email, code, purpose);
  };

  const resetPassword = async (email: string, newPass: string) => {
    await resetUserPassword(email, newPass);
  };

  const loginSocial = async (provider: 'google' | 'facebook' | 'github', selectedAccount?: Partial<UserAccount>) => {
    const account = await loginWithProvider(provider, selectedAccount);
    setUser(account);
    localStorage.setItem('ad_dmc_active_session', JSON.stringify(account));
    return account;
  };

  const createAdmin = async (name: string, email: string, initialPass: string) => {
    if (!user || user.email.toLowerCase() !== DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase()) {
      throw new Error('Only the default super admin (phaophonna.1@gmail.com) can create administrator accounts.');
    }
    return await createSecondaryAdmin(user.email, name, email, initialPass);
  };

  const deleteAdmin = async (email: string) => {
    if (!user || user.email.toLowerCase() !== DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase()) {
      throw new Error('Only the default super admin can manage administrator accounts.');
    }
    await deleteSecondaryAdmin(user.email, email);
  };

  const signOutUser = async () => {
    setUser(null);
    localStorage.removeItem('ad_dmc_active_session');
    await signOutAuth();
  };

  const isAdmin = user?.role === 'admin' || user?.email.toLowerCase() === DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase();
  const isDefaultSuperAdmin = user?.email.toLowerCase() === DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase() || user?.isDefaultSuperAdmin === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAdmin,
        isDefaultSuperAdmin,
        loading,
        login,
        register,
        sendOtp,
        verifyOtp,
        resetPassword,
        loginSocial,
        createAdmin,
        deleteAdmin,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
