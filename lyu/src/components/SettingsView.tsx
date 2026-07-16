import React, { useState } from "react";
import { Settings, Save, ShieldCheck, HelpCircle, Check, KeySquare } from "lucide-react";
import { TravelPreferences } from "../types";

interface SettingsViewProps {
  preferences: TravelPreferences;
  onUpdatePreferences: (updated: TravelPreferences) => void;
}

export default function SettingsView({ preferences, onUpdatePreferences }: SettingsViewProps) {
  const [homeAirport, setHomeAirport] = useState(preferences.homeAirport);
  const [budget, setBudget] = useState<"budget" | "moderate" | "luxury">(preferences.budget);
  const [style, setStyle] = useState<"adventure" | "cyberpunk" | "nature" | "cultural" | "relaxed">(preferences.style);
  const [interests, setInterests] = useState<string[]>(preferences.interests);

  const [isSaved, setIsSaved] = useState(false);

  const availableInterests = [
    "Cyberpunk Nights",
    "Bioluminescent Forests",
    "Traditional Temples",
    "Underground Culinary",
    "Retro Artifact Exchanges",
    "Low-gravity Parks",
    "Deep Trench Scuba",
    "Maglev Transits"
  ];

  const handleInterestToggle = (tag: string) => {
    setInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePreferences({
      homeAirport: homeAirport.trim(),
      budget: budget,
      style: style,
      interests: interests
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="w-full max-w-2xl mx-auto p-4 md:p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="font-display font-bold text-xl text-on-surface flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-primary" /> Settings & Protocols
        </h2>
        <p className="font-sans text-xs text-on-surface-variant mt-1 font-medium">
          Configure telemetry factors, travel budget limits, and API encryption keys.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/35 text-emerald-200 text-xs flex items-center gap-2 animate-pulse">
          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          Settings saved successfully! Lyu will immediately personalize all future chat replies and itineraries.
        </div>
      )}

      {/* Preferences Block */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-5">
        <h3 className="font-display font-bold text-xs text-brand-primary uppercase tracking-widest font-mono">
          Travel Preferences
        </h3>

        {/* Home Airport */}
        <div className="space-y-1.5">
          <label className="font-display text-xs font-bold text-on-surface">Home Airport / Launch City</label>
          <input
            className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-on-surface text-sm focus:border-brand-primary/40 focus:ring-1 focus:ring-brand-primary/20 focus:outline-none"
            type="text"
            value={homeAirport}
            onChange={(e) => setHomeAirport(e.target.value)}
            required
            placeholder="E.g., SFO - San Francisco International"
          />
        </div>

        {/* Budget and Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-display text-xs font-bold text-on-surface">Default Budget Level</label>
            <select
              className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-on-surface text-sm focus:border-brand-primary/40 focus:outline-none"
              value={budget}
              onChange={(e) => setBudget(e.target.value as any)}
            >
              <option value="budget" className="bg-bg-dark">Budget (Low Cost)</option>
              <option value="moderate" className="bg-bg-dark">Moderate (Standard)</option>
              <option value="luxury" className="bg-bg-dark">Luxury (High Tier)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-display text-xs font-bold text-on-surface">Primary Travel Style</label>
            <select
              className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-on-surface text-sm focus:border-brand-primary/40 focus:outline-none"
              value={style}
              onChange={(e) => setStyle(e.target.value as any)}
            >
              <option value="adventure" className="bg-bg-dark">Adventure</option>
              <option value="cyberpunk" className="bg-bg-dark">Cyberpunk</option>
              <option value="nature" className="bg-bg-dark">Nature</option>
              <option value="cultural" className="bg-bg-dark">Culture</option>
              <option value="relaxed" className="bg-bg-dark">Relaxed</option>
            </select>
          </div>
        </div>

        {/* Interest tags */}
        <div className="space-y-2">
          <label className="font-display text-xs font-bold text-on-surface">Specific Interest Vectors</label>
          <div className="flex flex-wrap gap-2">
            {availableInterests.map((interest) => {
              const isSelected = interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-3 py-1.5 rounded-lg border font-display text-[11px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand-secondary/15 border-brand-secondary text-brand-secondary shadow-[0_0_12px_rgba(255,36,228,0.1)]"
                      : "bg-white/[0.01] border-white/5 text-on-surface-variant hover:border-white/20 hover:text-on-surface"
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Security and Credentials Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
        <h3 className="font-display font-bold text-xs text-brand-secondary uppercase tracking-widest font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-secondary" /> Encryption & Keys
        </h3>
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
          Lyu operates on an offline-first container layer. All Gemini API prompts are handled server-side via Node proxy. To authenticate your travel partner:
        </p>

        <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 flex gap-3 items-start">
          <KeySquare className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
          <div className="text-[11px] font-sans text-on-surface-variant space-y-1">
            <p className="font-display font-semibold text-on-surface">Automatic Secret Injection</p>
            <p className="leading-relaxed">
              Google AI Studio automatically mounts your <code className="text-brand-primary bg-brand-primary/10 px-1 py-0.5 rounded">GEMINI_API_KEY</code> securely. Configure or view your key in the <strong className="text-brand-primary">Settings &gt; Secrets</strong> panel. You do not need to enter credentials here!
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-bg-darker font-display font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,219,233,0.3)] hover:shadow-[0_0_30px_rgba(255,36,228,0.3)] cursor-pointer transition-all duration-300 tactile-btn"
      >
        <Save className="w-4 h-4" />
        Save Settings
      </button>
    </form>
  );
}
