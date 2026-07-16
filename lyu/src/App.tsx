import { useState, useTransition } from "react";
import Sidebar from "./components/Sidebar";
import MobileHeader from "./components/MobileHeader";
import MobileNav from "./components/MobileNav";
import ExplorationView from "./components/ExplorationView";
import ChatView from "./components/ChatView";
import ItinerariesView from "./components/ItinerariesView";
import FavoritesView from "./components/FavoritesView";
import SettingsView from "./components/SettingsView";
import ExploreModal from "./components/ExploreModal";
import PlanTripModal from "./components/PlanTripModal";

import { TravelPreferences, Itinerary } from "./types";
import { prebakedItineraries } from "./destinationsData";

export default function App() {
  const [activeTab, setActiveTab] = useState("explore");
  const [, startTransition] = useTransition();

  const handleSetActiveTab = (tab: string) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };
  
  // Favorites State (Preloaded with Himalayan Peaks to match initial user preview expectation)
  const [favorites, setFavorites] = useState<string[]>(["himalayan-peaks"]);
  
  // Saved Itineraries State (Preloaded with our high-fidelity, prebaked templates)
  const [itineraries, setItineraries] = useState<Itinerary[]>([
    prebakedItineraries["glacial-echoes"],
    prebakedItineraries["himalayan-peaks"]
  ]);

  // Travel Preferences State
  const [preferences, setPreferences] = useState<TravelPreferences>({
    homeAirport: "SFO - San Francisco",
    budget: "moderate",
    style: "cyberpunk",
    interests: ["Cyberpunk Nights", "Traditional Temples", "Underground Culinary"]
  });

  // Modal / Detailed view toggles
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [exploreDestination, setExploreDestination] = useState<{ name: string; id?: string } | null>(null);
  const [isPlanTripOpen, setIsPlanTripOpen] = useState(false);

  // Toggle favorite bookmark
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add new generated itinerary and show it
  const handleItineraryGenerated = (newItinerary: Itinerary) => {
    setItineraries((prev) => [newItinerary, ...prev]);
    setSelectedItinerary(newItinerary);
    handleSetActiveTab("itineraries");
  };

  // Start exploring a destination name (triggers Explore details modal)
  const handleExploreDestination = (name: string, id?: string) => {
    setExploreDestination({ name, id });
  };

  // Switch to Itineraries tab and directly view that destination's itinerary
  const handleViewItinerary = (name: string, id?: string) => {
    const normalizedId = id || name.toLowerCase().replace(/\s+/g, "-");
    const prebaked = prebakedItineraries[normalizedId];
    
    if (prebaked) {
      setSelectedItinerary(prebaked);
      handleSetActiveTab("itineraries");
    } else {
      // If not prebaked, trigger Plan trip with this destination filled in
      setExploreDestination(null);
      setIsPlanTripOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative ambient-void">
      {/* Sidebar for Desktop */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        onPlanNewTrip={() => setIsPlanTripOpen(true)}
        preferences={preferences}
      />

      {/* Top Bar for Mobile */}
      <MobileHeader />

      {/* Main Content Area */}
      <main className="flex-1 w-full md:pl-64 flex flex-col pb-24 md:pb-6 min-h-screen relative z-10">
        {activeTab === "explore" && (
          <ExplorationView
            onExplore={handleExploreDestination}
            onViewItinerary={handleViewItinerary}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}

        {activeTab === "chat" && (
          <ChatView preferences={preferences} />
        )}

        {activeTab === "itineraries" && (
          <ItinerariesView
            itineraries={itineraries}
            selectedItinerary={selectedItinerary}
            onSelectItinerary={setSelectedItinerary}
            onPlanNewTrip={() => setIsPlanTripOpen(true)}
          />
        )}

        {activeTab === "favorites" && (
          <FavoritesView
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onExplore={handleExploreDestination}
            setActiveTab={handleSetActiveTab}
          />
        )}

        {activeTab === "settings" && (
          <SettingsView
            preferences={preferences}
            onUpdatePreferences={setPreferences}
          />
        )}
      </main>

      {/* Bottom Nav for Mobile */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        onPlanNewTrip={() => setIsPlanTripOpen(true)}
      />

      {/* Explore Details Modal */}
      {exploreDestination && (
        <ExploreModal
          destinationName={exploreDestination.name}
          destinationId={exploreDestination.id}
          onClose={() => setExploreDestination(null)}
          onGenerateItinerary={(name) => {
            // Closes modal and generates itinerary
            handleViewItinerary(name);
          }}
        />
      )}

      {/* Plan New Trip Configuration Wizard Modal */}
      {isPlanTripOpen && (
        <PlanTripModal
          onClose={() => setIsPlanTripOpen(false)}
          onItineraryGenerated={handleItineraryGenerated}
          defaultPreferences={preferences}
        />
      )}
    </div>
  );
}
