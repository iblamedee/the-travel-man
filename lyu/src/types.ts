export interface Destination {
  id: string;
  name: string;
  country: string;
  tagline: string;
  tags: string[];
  imageUrl: string;
  description: string;
  isHot?: boolean;
}

export interface TravelPreferences {
  homeAirport: string;
  budget: "budget" | "moderate" | "luxury";
  style: "adventure" | "cyberpunk" | "nature" | "cultural" | "relaxed";
  interests: string[];
}

export interface Activity {
  time: string; // Morning, Afternoon, Evening
  title: string;
  description: string;
  cost: string;
  locationName: string;
}

export interface DayItinerary {
  dayNumber: number;
  theme: string;
  activities: Activity[];
}

export interface Hotel {
  name: string;
  description: string;
  pricePerNight: string;
  rating?: string;
}

export interface Itinerary {
  destination: string;
  country: string;
  durationDays: number;
  bestSeason: string;
  budgetLevel: string;
  description: string;
  estimatedTotalCost: string;
  days: DayItinerary[];
  hotels: Hotel[];
  flightTips: string;
}

export interface ExploreDetails {
  destination: string;
  localSecrets: string[];
  signatureFoods: {
    name: string;
    description: string;
  }[];
  culturalEtiquette: string[];
  highlights: {
    name: string;
    tagline: string;
    description: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}
