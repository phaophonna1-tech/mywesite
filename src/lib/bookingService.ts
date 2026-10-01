import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Destination } from '../types';

export interface BookingRecord {
  id: string;
  code: string;
  userId: string;
  userEmail: string;
  userName: string;
  destinationId: string;
  destinationName: string;
  travelers: number;
  tier: string;
  durationDays: number;
  estimatedTotal: number;
  startDate: string;
  notes: string;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const ADMIN_EMAIL = 'phaophonna.1@gmail.com';
const BOOKINGS_KEY = 'ad_dmc_bookings_cache';
const CUSTOM_DESTINATIONS_KEY = 'ad_dmc_custom_destinations';

// Helper to get cached bookings from localStorage
export function getLocalBookings(): BookingRecord[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Helper to save bookings to localStorage
export function saveLocalBookings(bookings: BookingRecord[]) {
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  } catch {
    // ignore
  }
}

// Create a new booking
export async function createBooking(
  bookingData: Omit<BookingRecord, 'id' | 'code' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<BookingRecord> {
  const id = `book-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const code = `AD-DMC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const newBooking: BookingRecord = {
    ...bookingData,
    id,
    code,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  // 1. Try to persist to Firestore
  try {
    const bookingDoc = doc(db, 'bookings', id);
    await setDoc(bookingDoc, newBooking);
  } catch (err) {
    console.warn('Firestore write failed, using resilient offline storage:', err);
  }

  // 2. Always persist locally for offline resilience
  const localList = getLocalBookings();
  localList.unshift(newBooking);
  saveLocalBookings(localList);

  return newBooking;
}

// Update booking status by Admin
export async function updateBookingStatus(
  bookingId: string,
  newStatus: BookingRecord['status'],
  adminNotes?: string
): Promise<void> {
  const now = new Date().toISOString();

  // Try Firestore update
  try {
    const docRef = doc(db, 'bookings', bookingId);
    await updateDoc(docRef, {
      status: newStatus,
      adminNotes: adminNotes || '',
      updatedAt: now,
    });
  } catch (err) {
    console.warn('Firestore status update error (using local storage):', err);
  }

  // Update local storage
  const list = getLocalBookings().map((b) => {
    if (b.id === bookingId) {
      return {
        ...b,
        status: newStatus,
        adminNotes: adminNotes ?? b.adminNotes,
        updatedAt: now,
      };
    }
    return b;
  });
  saveLocalBookings(list);
}

// Generate Email for Status Update back to Customer
export function generateStatusEmailLink(
  booking: BookingRecord,
  status: 'approved' | 'paid' | 'cancelled'
): string {
  const subject = encodeURIComponent(
    `[Asia Destination DMC] Itinerary ${booking.code} Status Update: ${status.toUpperCase()}`
  );

  let statusMessage = '';
  if (status === 'approved') {
    statusMessage = `Great news! Your luxury itinerary request for ${booking.destinationName} has been officially APPROVED by our Senior Regional Curator.

Itinerary Reference: ${booking.code}
Destination: ${booking.destinationName}
Number of Guests: ${booking.travelers} Guests
Estimated Investment: $${booking.estimatedTotal.toLocaleString()}
Curator Notes: ${booking.adminNotes || 'All bespoke arrangements and private transfers are tentatively reserved.'}

Please review your travel dossier and proceed with final confirmation.`;
  } else if (status === 'paid') {
    statusMessage = `Thank you! Payment for itinerary ${booking.code} (${booking.destinationName}) has been received and confirmed by Asia Destination DMC.

Official Receipt / Voucher: ${booking.code}
Status: PAID & GUARANTEED
Total Confirmed: $${booking.estimatedTotal.toLocaleString()}
Travelers: ${booking.travelers} Guests

Your private guides, luxury heritage stays, and vip fast-track transfers are locked in. We look forward to hosting you on this unforgettable Asian journey!`;
  } else {
    statusMessage = `Your reservation request ${booking.code} for ${booking.destinationName} has been updated to CANCELLED.

If you have any questions or would like to explore alternative dates or destinations across Asia, please do not hesitate to reach out.`;
  }

  const body = encodeURIComponent(`Dear ${booking.userName},

${statusMessage}

Warm regards,
Asia Destination DMC
Official Admin: ${ADMIN_EMAIL}
Headquarters: Tokyo | Bangkok | Kyoto | Singapore`);

  return `mailto:${booking.userEmail}?cc=${ADMIN_EMAIL}&subject=${subject}&body=${body}`;
}

// Generate Admin Notification Email Link for new bookings
export function generateAdminNotificationEmail(booking: BookingRecord): string {
  const subject = encodeURIComponent(
    `[NEW EXPEDITION INQUIRY] ${booking.code} - ${booking.destinationName} (${booking.userName})`
  );

  const body = encodeURIComponent(`Attention Asia Destination DMC Executive Team,

A new high-value bespoke itinerary has been submitted:

--- EXPEDITION DOSSIER ---
Booking Code: ${booking.code}
Client Name: ${booking.userName}
Client Email: ${booking.userEmail}
Destination: ${booking.destinationName}
Selected Tier: ${booking.tier}
Number of Travelers: ${booking.travelers} Guests
Estimated Investment: $${booking.estimatedTotal.toLocaleString()}
Client Notes: ${booking.notes || 'No special requests specified.'}
Submitted At: ${new Date(booking.createdAt).toLocaleString()}

Admin Console: Access your dashboard to review, approve, or mark this booking as paid.

Asia Destination DMC Operations`);

  return `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
}

// --- Custom Destinations Management for Admin ---

export function getLocalCustomDestinations(): Destination[] {
  try {
    const raw = localStorage.getItem(CUSTOM_DESTINATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalCustomDestinations(destinations: Destination[]) {
  try {
    localStorage.setItem(CUSTOM_DESTINATIONS_KEY, JSON.stringify(destinations));
  } catch {
    // ignore
  }
}

export async function addCustomDestination(destination: Destination): Promise<void> {
  const current = getLocalCustomDestinations();
  const updated = [destination, ...current.filter((d) => d.id !== destination.id)];
  saveLocalCustomDestinations(updated);

  try {
    await setDoc(doc(db, 'destinations', destination.id), {
      name: destination.name,
      country: destination.country,
      region: destination.region,
      tagline: destination.tagline,
      heroImage: destination.heroImage,
      priceFrom: destination.priceFrom,
      duration: destination.duration,
      description: destination.description,
      bestSeason: destination.bestSeason,
      badge: destination.badge || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore destination create error (saved locally):', err);
  }
}

export async function updateCustomDestination(destination: Destination): Promise<void> {
  const current = getLocalCustomDestinations();
  const updated = current.map((d) => (d.id === destination.id ? destination : d));
  saveLocalCustomDestinations(updated);

  try {
    await updateDoc(doc(db, 'destinations', destination.id), {
      name: destination.name,
      country: destination.country,
      region: destination.region,
      tagline: destination.tagline,
      heroImage: destination.heroImage,
      priceFrom: destination.priceFrom,
      duration: destination.duration,
      description: destination.description,
      bestSeason: destination.bestSeason,
      badge: destination.badge || '',
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore destination update error (saved locally):', err);
  }
}

export async function deleteCustomDestination(destinationId: string): Promise<void> {
  const current = getLocalCustomDestinations();
  const updated = current.filter((d) => d.id !== destinationId);
  saveLocalCustomDestinations(updated);

  try {
    await deleteDoc(doc(db, 'destinations', destinationId));
  } catch (err) {
    console.warn('Firestore destination delete error:', err);
  }
}
