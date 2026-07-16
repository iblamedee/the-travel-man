import React, { useState } from "react";
import { X, Plane, Sparkles, Loader2, Compass, MapPin, Calendar, CreditCard, Flame } from "lucide-react";
import { Itinerary, TravelPreferences } from "../types";

interface PlanTripModalProps {
  onClose: () => void;
  onItineraryGenerated: (itinerary: Itinerary) => void;
  defaultPreferences: TravelPreferences;
}

export default function PlanTripModal({
  onClose,
  onItineraryGenerated,
  defaultPreferences
}: PlanTripModalProps) {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState<"budget" | "moderate" | "luxury">(defaultPreferences.budget);
  const [style, setStyle] = useState<"adventure" | "cyberpunk" | "nature" | "cultural" | "relaxed">(defaultPreferences.style);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const surpriseDestinations = [
    "Holographic Osaka Sub-Grid",
    "Bioluminescent Fjord Sanctum",
    "Stellar Station-9 Floating Spire",
    "Volcanic Neo-Utopia",
    "Reykjavík Ice-Dome",
    "Ancient Meguro Digital Canal",
    "Deep Coral Reef Floating Village"
  ];

  const handleSurpriseMe = () => {
    const randomDest = surpriseDestinations[Math.floor(Math.random() * surpriseDestinations.length)];
    setDestination(randomDest);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/itinerary/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: destination.trim(),
          duration: duration,
          budget: budget,
          style: style,
          preferences: defaultPreferences
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Sub-orbital link lost. Ensure API Key is configured.");
      }

      const generatedItinerary: Itinerary = await res.json();
      onItineraryGenerated(generatedItinerary);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Lyu encountered an atmospheric anomaly while generating this itinerary. Please verify your Gemini API key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-bg-darker/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Card Dialog */}
      <div className="w-full max-w-xl glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col shadow-2xl relative animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center border border-white/10 cursor-pointer transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 text-brand-primary">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-display text-xs font-extrabold uppercase tracking-widest font-mono">
              Lyu Manifest Constructor
            </span>
          </div>
          <h3 className="font-display text-xl font-bold text-on-surface mt-2">
            Plan a New Journey
          </h3>
          <p className="font-sans text-xs text-on-surface-variant mt-1">
            Configure target coordinates and let Lyu model your flight path.
          </p>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center gap-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
              <Plane className="w-5 h-5 text-brand-secondary absolute inset-0 m-auto animate-bounce" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-on-surface animate-pulse">
                Constructing Itinerary Grid...
              </p>
              <div className="w-48 h-1 bg-white/5 rounded-full mt-3 overflow-hidden mx-auto">
                <div className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary w-2/3 rounded-full animate-pulse" />
              </div>
              <p className="font-sans text-[11px] text-on-surface-variant mt-3 max-w-xs mx-auto leading-relaxed">
                Consulting global hotel boards, local secrets database, and generating high-fidelity day blocks with custom Gemini API logic...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[70vh] no-scrollbar">
            {error && (
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-xs text-red-200 leading-relaxed flex gap-2">
                <X className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <div>
                  <p className="font-bold">constructor error</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Destination Name Input */}
            <div className="space-y-2">
              <label className="font-display text-xs font-bold text-on-surface flex items-center justify-between">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Target Destination</span>
                <button
                  type="button"
                  onClick={handleSurpriseMe}
                  className="text-brand-secondary hover:text-brand-secondary/80 font-mono text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                >
                  ✨ Surprise Me
                </button>
              </label>
              <input
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-on-surface text-sm placeholder:text-on-surface-variant/30 focus:border-brand-primary/40 focus:ring-1 focus:ring-brand-primary/20 focus:outline-none"
                placeholder="Enter city, region, or cyberpunk coordinate..."
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>

            {/* Duration and Budget Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-display text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Duration (Days)
                </label>
                <select
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-on-surface text-sm focus:border-brand-primary/40 focus:outline-none"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 10].map((days) => (
                    <option key={days} value={days} className="bg-bg-dark">
                      {days} {days === 1 ? "Day" : "Days"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-display text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> Budget Level
                </label>
                <select
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-on-surface text-sm focus:border-brand-primary/40 focus:outline-none"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value as any)}
                >
                  <option value="budget" className="bg-bg-dark">Budget</option>
                  <option value="moderate" className="bg-bg-dark">Moderate</option>
                  <option value="luxury" className="bg-bg-dark">Luxury</option>
                </select>
              </div>
            </div>

            {/* Style Selector */}
            <div className="space-y-2">
              <label className="font-display text-xs font-bold text-on-surface flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Navigation Core Style
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: "adventure", label: "Adventure" },
                  { id: "cyberpunk", label: "Cyberpunk" },
                  { id: "nature", label: "Nature" },
                  { id: "cultural", label: "Culture" },
                  { id: "relaxed", label: "Relaxed" }
                ].map((s) => {
                  const isSelected = style === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStyle(s.id as any)}
                      className={`py-2 rounded-xl border font-display text-[11px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-brand-primary/10 border-brand-primary text-brand-primary"
                          : "bg-white/[0.01] border-white/5 text-on-surface-variant hover:border-white/20 hover:text-on-surface"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Block */}
            <button
              type="submit"
              disabled={!destination.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-primary via-[#00f0ff] to-[#00a3ff] text-bg-darker font-display font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,219,233,0.3)] hover:shadow-[0_0_30px_rgba(0,219,233,0.55)] cursor-pointer disabled:opacity-40 disabled:pointer-events-none transition-all duration-300 tactile-btn"
            >
              <Flame className="w-4 h-4 fill-bg-darker stroke-none" />
              Launch Manifest Builder
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
