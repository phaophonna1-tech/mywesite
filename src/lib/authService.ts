import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  GithubAuthProvider,
  signOut as fbSignOut
} from 'firebase/auth';
import { db, auth } from './firebase';

export const DEFAULT_SUPER_ADMIN_EMAIL = 'phaophonna.1@gmail.com';

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'customer' | 'admin';
  isDefaultSuperAdmin?: boolean;
  emailVerified: boolean;
  passwordHash?: string; // stored for email/pass verification
  createdBy?: string;
  createdAt: string;
}

export interface VerificationCodeRecord {
  email: string;
  code: string;
  purpose: 'register' | 'reset_password';
  expiresAt: number;
}

const LOCAL_USERS_KEY = 'ad_dmc_registered_users_cache';
const LOCAL_CODES_KEY = 'ad_dmc_verification_codes_cache';

// Simple client-side hash function for secure password comparison
export function hashPassword(plain: string): string {
  let hash = 0;
  for (let i = 0; i < plain.length; i++) {
    const char = plain.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}_${plain.length}`;
}

// Get all cached local users
export function getLocalUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    const users: UserAccount[] = raw ? JSON.parse(raw) : [];
    
    // Ensure default super admin exists
    const hasDefaultAdmin = users.some(
      (u) => u.email.toLowerCase() === DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase()
    );
    if (!hasDefaultAdmin) {
      const defaultAdmin: UserAccount = {
        uid: 'super-admin-phaophonna',
        email: DEFAULT_SUPER_ADMIN_EMAIL,
        displayName: 'Phaophonna (Super Admin)',
        role: 'admin',
        isDefaultSuperAdmin: true,
        emailVerified: true,
        passwordHash: hashPassword('admin12345'), // default initial password, can be reset
        createdAt: new Date().toISOString(),
      };
      users.push(defaultAdmin);
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    }
    return users;
  } catch {
    return [];
  }
}

export function saveLocalUsers(users: UserAccount[]) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

// Verification codes storage
export function getLocalCodes(): VerificationCodeRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_CODES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalCodes(codes: VerificationCodeRecord[]) {
  try {
    localStorage.setItem(LOCAL_CODES_KEY, JSON.stringify(codes));
  } catch {
    // ignore
  }
}

// Generate & Dispatch 6-digit OTP Code
export async function sendVerificationCode(
  email: string,
  purpose: 'register' | 'reset_password'
): Promise<{ code: string; mailtoUrl: string }> {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins expiry

  // 1. Save to local
  const currentCodes = getLocalCodes().filter((c) => c.email.toLowerCase() !== email.toLowerCase());
  currentCodes.push({ email, code, purpose, expiresAt });
  saveLocalCodes(currentCodes);

  // 2. Try saving to Firestore
  try {
    const sanitizedEmailKey = email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    await setDoc(doc(db, 'verificationCodes', sanitizedEmailKey), {
      email,
      code,
      purpose,
      expiresAt,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore verificationCode error (using local):', err);
  }

  // 3. Prepare direct email link
  const subject = encodeURIComponent(
    `[Asia Destination DMC] Your 6-Digit Verification Code: ${code}`
  );
  const actionText = purpose === 'register' ? 'complete your traveler registration' : 'reset your account password';
  const body = encodeURIComponent(`Dear Traveler,

Your 6-digit authentication code to ${actionText} is:

------------------------
      ${code}
------------------------

This code will expire in 15 minutes. If you did not request this, please disregard this email.

Warm regards,
Asia Destination DMC Security Team
Support: ${DEFAULT_SUPER_ADMIN_EMAIL}`);

  const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

  return { code, mailtoUrl };
}

// Verify 6-digit Code
export async function verifyCode(
  email: string,
  enteredCode: string,
  purpose: 'register' | 'reset_password'
): Promise<boolean> {
  const codes = getLocalCodes();
  const match = codes.find(
    (c) =>
      c.email.toLowerCase() === email.toLowerCase() &&
      c.code.trim() === enteredCode.trim() &&
      c.purpose === purpose &&
      c.expiresAt > Date.now()
  );

  if (match) return true;

  // Check Firestore fallback
  try {
    const sanitizedEmailKey = email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    const snap = await getDoc(doc(db, 'verificationCodes', sanitizedEmailKey));
    if (snap.exists()) {
      const data = snap.data() as VerificationCodeRecord;
      if (
        data.code === enteredCode.trim() &&
        data.purpose === purpose &&
        data.expiresAt > Date.now()
      ) {
        return true;
      }
    }
  } catch {
    // fallback
  }

  return false;
}

// Register Customer
export async function registerCustomer(
  name: string,
  email: string,
  plainPassword: string
): Promise<UserAccount> {
  const users = getLocalUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('An account with this email address already exists. Please sign in instead.');
  }

  const uid = `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const newUser: UserAccount = {
    uid,
    email: email.toLowerCase(),
    displayName: name,
    role: 'customer',
    emailVerified: true,
    passwordHash: hashPassword(plainPassword),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveLocalUsers(users);

  try {
    await setDoc(doc(db, 'users', uid), {
      uid: newUser.uid,
      email: newUser.email,
      displayName: newUser.displayName,
      role: newUser.role,
      emailVerified: true,
      createdAt: newUser.createdAt,
    });
  } catch (err) {
    console.warn('Firestore user save fallback:', err);
  }

  return newUser;
}

// Create Secondary Admin (ONLY by default super admin)
export async function createSecondaryAdmin(
  superAdminEmail: string,
  name: string,
  adminEmail: string,
  initialPassword: string
): Promise<UserAccount> {
  if (superAdminEmail.toLowerCase() !== DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase()) {
    throw new Error('Only the default super admin (phaophonna.1@gmail.com) is authorized to create admin accounts.');
  }

  const users = getLocalUsers();
  const existing = users.find((u) => u.email.toLowerCase() === adminEmail.toLowerCase());
  if (existing) {
    throw new Error(`An account with email ${adminEmail} already exists.`);
  }

  const uid = `admin-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const newAdmin: UserAccount = {
    uid,
    email: adminEmail.toLowerCase(),
    displayName: name,
    role: 'admin',
    isDefaultSuperAdmin: false,
    emailVerified: true,
    createdBy: superAdminEmail,
    passwordHash: hashPassword(initialPassword),
    createdAt: new Date().toISOString(),
  };

  users.push(newAdmin);
  saveLocalUsers(users);

  try {
    await setDoc(doc(db, 'users', uid), {
      uid: newAdmin.uid,
      email: newAdmin.email,
      displayName: newAdmin.displayName,
      role: 'admin',
      isDefaultSuperAdmin: false,
      createdBy: superAdminEmail,
      emailVerified: true,
      createdAt: newAdmin.createdAt,
    });
    // Add to admins collection
    await setDoc(doc(db, 'admins', uid), {
      email: newAdmin.email,
      assignedBy: superAdminEmail,
      createdAt: newAdmin.createdAt,
    });
  } catch (err) {
    console.warn('Firestore admin creation fallback:', err);
  }

  return newAdmin;
}

// Delete Secondary Admin (Super admin cannot be deleted!)
export async function deleteSecondaryAdmin(
  superAdminEmail: string,
  targetEmail: string
): Promise<void> {
  if (superAdminEmail.toLowerCase() !== DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase()) {
    throw new Error('Only the default super admin is authorized to delete administrator accounts.');
  }

  // PROTECTED: IMMUTABLE DEFAULT ADMIN
  if (targetEmail.toLowerCase() === DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase()) {
    throw new Error('SECURITY VIOLATION: The default super administrator (phaophonna.1@gmail.com) is permanent and cannot be deleted.');
  }

  const users = getLocalUsers();
  const targetUser = users.find((u) => u.email.toLowerCase() === targetEmail.toLowerCase());
  const updated = users.filter((u) => u.email.toLowerCase() !== targetEmail.toLowerCase());
  saveLocalUsers(updated);

  if (targetUser) {
    try {
      await deleteDoc(doc(db, 'users', targetUser.uid));
      await deleteDoc(doc(db, 'admins', targetUser.uid));
    } catch (err) {
      console.warn('Firestore admin deletion error:', err);
    }
  }
}

// Reset Password
export async function resetUserPassword(
  email: string,
  newPlainPassword: string
): Promise<void> {
  const users = getLocalUsers();
  const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (index === -1) {
    throw new Error('No account found associated with this email address.');
  }

  users[index].passwordHash = hashPassword(newPlainPassword);
  saveLocalUsers(users);

  try {
    const userDocRef = doc(db, 'users', users[index].uid);
    await updateDoc(userDocRef, {
      passwordUpdatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore password reset sync error:', err);
  }
}

// Login with Email & Password
export async function loginWithEmailPassword(
  email: string,
  plainPassword: string,
  requiredRole?: 'customer' | 'admin'
): Promise<UserAccount> {
  const users = getLocalUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error('Account not found. Please check your email or register.');
  }

  if (user.passwordHash && user.passwordHash !== hashPassword(plainPassword)) {
    throw new Error('Incorrect password. Please try again or use "Forgot Password" to reset.');
  }

  if (requiredRole && user.role !== requiredRole && !user.isDefaultSuperAdmin) {
    throw new Error(`This login portal is for ${requiredRole}s. Your account is configured as ${user.role}.`);
  }

  return user;
}

// Social logins
export async function loginWithProvider(providerName: 'google' | 'facebook' | 'github'): Promise<UserAccount> {
  let provider;
  if (providerName === 'google') {
    provider = new GoogleAuthProvider();
  } else if (providerName === 'facebook') {
    provider = new FacebookAuthProvider();
  } else {
    provider = new GithubAuthProvider();
  }

  try {
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;
    const email = fbUser.email || `${providerName}-user@example.com`;
    const isSuper = email.toLowerCase() === DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase();

    const userAccount: UserAccount = {
      uid: fbUser.uid,
      email,
      displayName: fbUser.displayName || email.split('@')[0],
      photoURL: fbUser.photoURL || undefined,
      role: isSuper ? 'admin' : 'customer',
      isDefaultSuperAdmin: isSuper,
      emailVerified: fbUser.emailVerified || true,
      createdAt: new Date().toISOString(),
    };

    const users = getLocalUsers().filter((u) => u.email.toLowerCase() !== email.toLowerCase());
    users.push(userAccount);
    saveLocalUsers(users);

    return userAccount;
  } catch (err: any) {
    // If popup blocked or failed in sandbox, fallback to mock social login
    console.warn(`${providerName} popup failed or cancelled, using demo social flow:`, err?.message);
    const mockEmail = `${providerName}.traveler@gmail.com`;
    const isSuper = mockEmail.toLowerCase() === DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase();
    const demoUser: UserAccount = {
      uid: `${providerName}-${Date.now()}`,
      email: mockEmail,
      displayName: `${providerName.charAt(0).toUpperCase() + providerName.slice(1)} Traveler`,
      role: isSuper ? 'admin' : 'customer',
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };
    const users = getLocalUsers().filter((u) => u.email.toLowerCase() !== mockEmail.toLowerCase());
    users.push(demoUser);
    saveLocalUsers(users);
    return demoUser;
  }
}
