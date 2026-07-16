import React, { useState, useTransition } from "react";
import { Compass, Calendar, CreditCard, ChevronRight, MapPin, Building, Sparkles, ArrowLeft } from "lucide-react";
import { Itinerary } from "../types";

interface ItinerariesViewProps {
  itineraries: Itinerary[];
  selectedItinerary: Itinerary | null;
  onSelectItinerary: (itinerary: Itinerary | null) => void;
  onPlanNewTrip: () => void;
}

export default function ItinerariesView({
  itineraries,
  selectedItinerary,
  onSelectItinerary,
  onPlanNewTrip
}: ItinerariesViewProps) {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [, startTransition] = useTransition();

  const handleSelectDay = (idx: number) => {
    startTransition(() => {
      setActiveDayIdx(idx);
    });
  };

  // If viewing a specific itinerary details
  if (selectedItinerary) {
    const activeDay = selectedItinerary.days[activeDayIdx] || selectedItinerary.days[0];

    return (
      <div className="w-full max-w-5xl mx-auto p-4 md:p-6 animate-fade-in">
        {/* Navigation back and header */}
        <button
          onClick={() => onSelectItinerary(null)}
          className="flex items-center gap-2 mb-6 text-xs font-bold text-brand-primary hover:text-[#00f0ff] uppercase tracking-wider transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Trips
        </button>

        {/* Itinerary Header Hero Card */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Sparkles className="w-24 h-24 text-brand-primary" />
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/20 px-2.5 py-1 rounded uppercase tracking-wider font-mono">
                Manifest Verified
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface mt-2.5">
                {selectedItinerary.destination}
              </h2>
              <p className="font-display text-xs font-bold text-brand-primary tracking-wider uppercase mt-1">
                {selectedItinerary.country}
              </p>
            </div>

            <div className="flex flex-col sm:items-end text-sm text-on-surface-variant font-medium shrink-0 gap-1 bg-white/[0.02] border border-white/5 rounded-xl p-3">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-brand-primary" /> Best Season: <strong className="text-on-surface">{selectedItinerary.bestSeason}</strong></span>
              <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-brand-secondary" /> Budget Range: <strong className="text-on-surface">{selectedItinerary.estimatedTotalCost}</strong></span>
            </div>
          </div>

          <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed mt-4 max-w-3xl border-t border-white/5 pt-4">
            {selectedItinerary.description}
          </p>
        </div>

        {/* Day-by-Day Segment Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Days Selector Rail (3 cols) */}
          <div className="md:col-span-3 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible no-scrollbar shrink-0">
            {selectedItinerary.days.map((day, idx) => {
              const isActive = activeDayIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectDay(idx)}
                  className={`px-4 py-3 rounded-xl border text-left flex items-center justify-between min-w-[110px] md:min-w-0 transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-brand-primary/10 border-brand-primary text-brand-primary shadow-[0_0_12px_rgba(0,219,233,0.1)]"
                      : "bg-[#1e1e31]/20 border-white/5 text-on-surface-variant hover:text-on-surface hover:border-white/10"
                  }`}
                >
                  <div>
                    <p className="font-display text-[10px] uppercase tracking-widest font-mono opacity-60">Day</p>
                    <p className="font-display text-base font-bold">0{day.dayNumber}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 hidden md:block transition-transform ${isActive ? "translate-x-1" : "opacity-40"}`} />
                </button>
              );
            })}
          </div>

          {/* Center Day Details Area (9 cols) */}
          <div className="md:col-span-9 space-y-6">
            {activeDay ? (
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-5 animate-fade-in">
                {/* Day Theme */}
                <div className="border-b border-white/10 pb-4">
                  <span className="text-[10px] font-bold text-brand-tertiary bg-brand-tertiary/10 border border-brand-tertiary/20 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                    Primary Vector
                  </span>
                  <h3 className="font-display text-lg md:text-xl font-bold text-on-surface mt-2 flex items-center gap-2">
                    <span className="text-brand-primary">Day {activeDay.dayNumber}:</span> {activeDay.theme}
                  </h3>
                </div>

                {/* Day Activities */}
                <div className="space-y-4">
                  {activeDay.activities.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row gap-4 items-start"
                    >
                      <span className="px-3 py-1 rounded bg-[#1e1e31]/80 border border-white/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest font-mono shrink-0">
                        {act.time}
                      </span>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-display font-semibold text-sm text-on-surface flex items-center gap-1.5 flex-wrap">
                          {act.title}
                          <span className="text-[11px] font-normal text-on-surface-variant flex items-center gap-1">
                            · <MapPin className="w-3 h-3 text-brand-secondary inline" /> {act.locationName}
                          </span>
                        </h4>
                        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                          {act.description}
                        </p>
                        <span className="inline-block text-[10px] font-mono font-bold text-brand-tertiary uppercase mt-1">
                          Est. Cost: <strong className="text-on-surface">{act.cost}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Recommendations Row (Hotels & Transit Flight Tips) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Hotel list card */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h4 className="font-display font-bold text-sm text-on-surface flex items-center gap-2 border-b border-white/10 pb-2">
                  <Building className="w-4 h-4 text-brand-primary" /> Suitable Accommodations
                </h4>
                <div className="space-y-3">
                  {selectedItinerary.hotels?.map((hotel, hIdx) => (
                    <div key={hIdx} className="p-3 rounded-xl bg-white/[0.01] border border-white/5 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h5 className="font-display font-semibold text-xs text-on-surface leading-tight">{hotel.name}</h5>
                        <span className="text-[10px] font-mono text-brand-secondary shrink-0 font-bold">{hotel.pricePerNight}</span>
                      </div>
                      <p className="font-sans text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">{hotel.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transit Flight Tips */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h4 className="font-display font-bold text-sm text-on-surface flex items-center gap-2 border-b border-white/10 pb-2">
                  <Sparkles className="w-4 h-4 text-brand-secondary" /> Lyu Flight Hacks
                </h4>
                <div className="p-4 rounded-xl bg-[#00dbe9]/5 border border-[#00dbe9]/10 text-xs text-on-surface-variant leading-relaxed">
                  {selectedItinerary.flightTips}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise list itineraries (saved or standard ones)
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h2 className="font-display font-bold text-xl text-on-surface">My Manifests</h2>
          <p className="font-sans text-xs text-on-surface-variant mt-1">
            Browse and access itineraries constructed by your AI Travel Partner.
          </p>
        </div>
        <button
          onClick={onPlanNewTrip}
          className="px-4 py-2 bg-brand-primary text-bg-darker font-display font-bold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer tactile-btn"
        >
          Plan New
        </button>
      </div>

      {itineraries.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center max-w-md mx-auto border border-white/5 mt-8">
          <Compass className="w-12 h-12 text-brand-primary/50 mx-auto mb-4 animate-spin-slow" />
          <h4 className="font-display font-bold text-sm text-on-surface mb-2">No active journeys plotted</h4>
          <p className="font-sans text-xs text-on-surface-variant mb-6 leading-relaxed">
            Configure your destination coordinates to let Lyu generate custom, detailed flight plans and itineraries.
          </p>
          <button
            onClick={onPlanNewTrip}
            className="px-6 py-2.5 bg-brand-primary text-bg-darker font-display font-bold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer tactile-btn"
          >
            Create Itinerary
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {itineraries.map((it, idx) => (
            <div
              key={idx}
              onClick={() => onSelectItinerary(it)}
              className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-all duration-300 group cursor-pointer flex flex-col justify-between h-44"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[9px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded uppercase font-mono">
                    {it.durationDays} Days · {it.budgetLevel}
                  </span>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-display font-bold text-[17px] text-on-surface mt-2.5 group-hover:text-brand-primary transition-colors">
                  {it.destination}
                </h3>
                <p className="font-display text-[11px] text-brand-secondary/80 font-semibold uppercase tracking-wider">
                  {it.country}
                </p>
              </div>

              <p className="font-sans text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed border-t border-white/5 pt-2">
                {it.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
