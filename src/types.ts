export interface Destination {
  id: string;
  name: string;
  region: string;
  category: 'coastal' | 'alpine' | 'cultural' | 'wildlife';
  country: string;
  tagline: string;
  description: string;
  priceFrom: number;
  duration: string;
  bestSeason: string;
  groupSize: string;
  rating: number;
  reviewsCount: number;
  accentColor: string;
  bgGradient: string;
  heroSvgType: 'islands' | 'mountains' | 'temple' | 'caldera' | 'savanna' | 'bamboo' | 'angkor' | 'halong' | 'bhutan' | 'hero';
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  included: string[];
}

export interface TravelPackage {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  price: number;
  destinations: string[];
  difficulty: 'Easy Pace' | 'Moderate' | 'Active Exploration';
  season: string;
  schedule: {
    day: string;
    title: string;
    detail: string;
    activity: string;
  }[];
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  trip: string;
  year: string;
  quote: string;
  rating: number;
  highlight: string;
}

export interface SearchFilters {
  query: string;
  category: string;
  season: string;
  budgetMax: number;
}

export interface BookingFormData {
  destinationId: string;
  travelDate: string;
  travelers: number;
  travelStyle: 'Comfort' | 'Signature Luxury' | 'Ultra-Private Expedition';
  durationDays: number;
  name: string;
  email: string;
  notes: string;
  includePrivateGuide: boolean;
  includeCarbonOffset: boolean;
}
