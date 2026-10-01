import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../lib/firebase';

export type UserRole = 'customer' | 'admin';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
}

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  role: UserRole | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInQuickRole: (role: UserRole, customEmail?: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const ADMIN_EMAIL = 'phaophonna.1@gmail.com';

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  role: null,
  isAdmin: false,
  loading: true,
  signInWithGoogle: async () => {},
  signInQuickRole: async () => {},
  signOutUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check saved guest/demo session in localStorage for local testing fallback
  const loadLocalUser = (): AppUser | null => {
    try {
      const saved = localStorage.getItem('ad_dmc_active_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const email = fbUser.email || '';
        const isUserAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        const role: UserRole = isUserAdmin ? 'admin' : 'customer';

        const appUserData: AppUser = {
          uid: fbUser.uid,
          email,
          displayName: fbUser.displayName || email.split('@')[0] || 'Traveler',
          photoURL: fbUser.photoURL || undefined,
          role,
        };

        // Sync user to Firestore
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (!snap.exists()) {
            await setDoc(userDocRef, {
              uid: appUserData.uid,
              email: appUserData.email,
              displayName: appUserData.displayName,
              photoURL: appUserData.photoURL || '',
              role: appUserData.role,
              createdAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.warn('Could not sync user profile to Firestore:', err);
        }

        setUser(appUserData);
        localStorage.setItem('ad_dmc_active_user', JSON.stringify(appUserData));
      } else {
        const local = loadLocalUser();
        setUser(local);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.warn('Popup sign in error (falling back to quick login):', error?.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Quick switch for easy testing between Customer and Admin (phaophonna.1@gmail.com)
  const signInQuickRole = async (targetRole: UserRole, customEmail?: string) => {
    const email = customEmail || (targetRole === 'admin' ? ADMIN_EMAIL : 'traveler@gmail.com');
    const name = targetRole === 'admin' ? 'Phaophonna (Admin)' : 'Valued Traveler';
    const mockUid = targetRole === 'admin' ? 'admin-phaophonna-uid' : `cust-${Date.now()}`;

    const appUserData: AppUser = {
      uid: mockUid,
      email,
      displayName: name,
      role: targetRole,
    };

    setUser(appUserData);
    localStorage.setItem('ad_dmc_active_user', JSON.stringify(appUserData));
  };

  const signOutUser = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('ad_dmc_active_user');
  };

  const isAdmin = user?.role === 'admin' || user?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        role: user?.role || null,
        isAdmin,
        loading,
        signInWithGoogle,
        signInQuickRole,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
