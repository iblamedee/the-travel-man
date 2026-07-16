import React, { useState, useMemo } from "react";
import { Search, PlaneTakeoff, Heart, Flame, ArrowRight, ArrowUpRight } from "lucide-react";
import { Destination } from "../types";
import { initialDestinations } from "../destinationsData";

interface ExplorationViewProps {
  onExplore: (destinationName: string, id?: string) => void;
  onViewItinerary: (destinationName: string, id?: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export default function ExplorationView({
  onExplore,
  onViewItinerary,
  favorites,
  toggleFavorite
}: ExplorationViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Trending");

  const filterChips = ["Trending", "Nature", "Adventures", "Scenic"];

  // Filter logic
  const filteredDestinations = useMemo(() => {
    return initialDestinations.filter((dest) => {
      // Search matching
      const matchesSearch =
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.tagline.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Filter category matching
      if (activeFilter === "Trending") return true;
      if (activeFilter === "Nature") {
        return dest.tags.includes("Nature");
      }
      if (activeFilter === "Adventures") {
        return dest.tags.includes("Adventure");
      }
      if (activeFilter === "Scenic") {
        return dest.tags.includes("Scenic");
      }
      return true;
    });
  }, [searchQuery, activeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Treat search query as a custom request to explore
      onExplore(searchQuery.trim());
    }
  };

  return (
    <div className="w-full">
      {/* Search Hero Section */}
      <section className="relative w-full pt-12 pb-10 px-6 md:px-10 flex flex-col items-center justify-center z-10 text-center">
        <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
          <h2 className="font-display text-[32px] md:text-[48px] font-bold mb-3 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent leading-[1.1] tracking-tight">
            Where to next?
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] text-on-surface-variant font-light max-w-lg mx-auto">
            Discover trending destinations across the hyper-sphere.
          </p>
        </div>

        {/* Heavy Blur Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-3xl glass-panel rounded-full p-2 flex items-center gap-2 border border-white/15 focus-within:border-brand-primary/40 focus-within:shadow-[0_0_20px_rgba(0,219,233,0.15)] transition-all duration-300"
        >
          <div className="pl-4 text-on-surface-variant/70">
            <Search className="w-5 h-5" />
          </div>
          <input
            className="flex-1 bg-transparent border-none text-on-surface font-sans text-[15px] placeholder:text-on-surface-variant/40 focus:ring-0 outline-none w-full h-11"
            placeholder="Search everywhere, anytime..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-brand-primary hover:bg-[#00f0ff] text-bg-darker p-3 rounded-full flex items-center justify-center transition-all shadow-[0_0_15px_rgba(0,219,233,0.35)] hover:shadow-[0_0_25px_rgba(0,219,233,0.6)] cursor-pointer tactile-btn"
            title="Explore destination"
          >
            <PlaneTakeoff className="w-5 h-5" />
          </button>
        </form>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {filterChips.map((chip) => {
            const isActive = activeFilter === chip;
            return (
              <button
                key={chip}
                onClick={() => setActiveFilter(chip)}
                className={`px-5 py-2 rounded-full font-display text-[13px] font-bold transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? "bg-brand-primary/15 border-brand-primary text-brand-primary shadow-[0_0_15px_rgba(0,219,233,0.15)]"
                    : "glass-panel border-white/5 text-on-surface-variant hover:text-on-surface hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </section>

      {/* Bento Grid Destinations */}
      <section className="px-6 md:px-10 pb-20 w-full max-w-[1440px] mx-auto z-10">
        {filteredDestinations.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center max-w-md mx-auto border border-white/5">
            <PlaneTakeoff className="w-12 h-12 text-brand-primary/50 mx-auto mb-4 animate-pulse" />
            <h4 className="font-display font-bold text-lg text-on-surface mb-2">Uncharted Coordinates</h4>
            <p className="font-sans text-sm text-on-surface-variant mb-6">
              Lyu hasn't pre-indexed "{searchQuery}". Launch a real-time hyper-spatial scan to build a custom itinerary!
            </p>
            <button
              onClick={() => onExplore(searchQuery)}
              className="px-6 py-2.5 bg-brand-primary text-bg-darker font-display font-bold text-sm rounded-xl hover:opacity-90 transition-all cursor-pointer tactile-btn"
            >
              Scan with Lyu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:auto-rows-[340px]">
            {/* Conditional grid items mapping */}
            {filteredDestinations.map((dest) => {
              const isFavorited = favorites.includes(dest.id);
              
              // Handle Neo-Tokyo (Large Featured layout)
              if (dest.id === "neo-tokyo") {
                return (
                  <article
                    key={dest.id}
                    className="md:col-span-8 rounded-2xl overflow-hidden relative group glass-card-hover border border-white/10 flex flex-col justify-end min-h-[320px] md:min-h-0"
                  >
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${dest.imageUrl}')` }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-darker/95 via-bg-darker/45 to-transparent z-0" />
                    
                    {/* Floating top tags */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                      {dest.isHot && (
                        <span className="px-3.5 py-1.5 rounded-full bg-bg-darker/60 backdrop-blur-md border border-white/15 text-on-surface font-display text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                          <Flame className="w-3.5 h-3.5 text-brand-secondary animate-pulse fill-brand-secondary stroke-none" />
                          Hot Right Now
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(dest.id);
                        }}
                        className={`w-10 h-10 rounded-full glass-panel border border-white/10 flex items-center justify-center text-on-surface transition-all duration-300 hover:scale-110 cursor-pointer ${
                          isFavorited ? "text-brand-secondary bg-brand-secondary/15 border-brand-secondary/40" : "hover:text-brand-secondary"
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isFavorited ? "fill-brand-secondary text-brand-secondary" : ""}`} />
                      </button>
                    </div>

                    {/* Bottom Info Plate */}
                    <div className="p-6 md:p-8 z-10 w-full">
                      <div className="glass-panel p-5 rounded-2xl w-full md:w-3/4 lg:w-3/5 border border-white/5 shadow-2xl relative overflow-hidden">
                        <h3 className="font-display text-xl md:text-2xl font-bold text-on-surface mb-1">
                          {dest.name}
                        </h3>
                        <p className="font-sans text-sm text-on-surface-variant mb-4 line-clamp-2 leading-relaxed">
                          {dest.tagline}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {dest.tags.slice(0, 2).map((t) => (
                              <span
                                key={t}
                                className="text-[11px] font-bold text-brand-tertiary bg-brand-tertiary/10 border border-brand-tertiary/15 px-2.5 py-0.5 rounded-md"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => onExplore(dest.name, dest.id)}
                            className="font-display text-[13px] font-bold text-brand-primary flex items-center gap-1.5 hover:text-[#00f0ff] transition-all group-hover:translate-x-1 duration-300 cursor-pointer"
                          >
                            Explore <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }

              // Handle Glacial Echoes (Iceland - vertical spanning layout)
              if (dest.id === "glacial-echoes") {
                return (
                  <article
                    key={dest.id}
                    className="md:col-span-4 md:row-span-2 rounded-2xl overflow-hidden relative group glass-card-hover border border-white/10 flex flex-col justify-end min-h-[350px] md:min-h-0"
                  >
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${dest.imageUrl}')` }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-darker/95 via-bg-darker/25 to-transparent z-0" />

                    {/* Floating top tags */}
                    <div className="absolute top-6 left-6 right-6 flex justify-end z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(dest.id);
                        }}
                        className={`w-10 h-10 rounded-full glass-panel border border-white/10 flex items-center justify-center text-on-surface transition-all duration-300 hover:scale-110 cursor-pointer ${
                          isFavorited ? "text-brand-secondary bg-brand-secondary/15 border-brand-secondary/40" : "hover:text-brand-secondary"
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isFavorited ? "fill-brand-secondary text-brand-secondary" : ""}`} />
                      </button>
                    </div>

                    {/* Bottom Info Plate */}
                    <div className="p-6 z-10 w-full">
                      <div className="glass-panel p-5 rounded-2xl border border-white/5 shadow-2xl relative">
                        <h3 className="font-display text-[18px] md:text-xl font-bold text-on-surface mb-0.5">
                          {dest.name}
                        </h3>
                        <p className="font-display text-[11px] font-semibold text-brand-primary mb-3 tracking-wider uppercase">
                          {dest.country}
                        </p>
                        <p className="font-sans text-xs text-on-surface-variant mb-4 line-clamp-3 leading-relaxed">
                          {dest.tagline}
                        </p>
                        <button
                          onClick={() => onViewItinerary(dest.name, dest.id)}
                          className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-on-surface font-display font-semibold text-[13px] transition-all duration-300 cursor-pointer text-center block"
                        >
                          View Itinerary
                        </button>
                      </div>
                    </div>
                  </article>
                );
              }

              // Handle generic grid elements (Amalfi Heights, Zen Gardens - square style)
              return (
                <article
                  key={dest.id}
                  className="md:col-span-4 rounded-2xl overflow-hidden relative group glass-card-hover border border-white/10 flex flex-col justify-end min-h-[260px] md:min-h-0"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${dest.imageUrl}')` }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-darker/95 to-transparent z-0" />

                  {/* Top Heart Button */}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(dest.id);
                      }}
                      className={`w-9 h-9 rounded-full glass-panel border border-white/10 flex items-center justify-center text-on-surface transition-all duration-300 hover:scale-110 cursor-pointer ${
                        isFavorited ? "text-brand-secondary bg-brand-secondary/15 border-brand-secondary/40" : "hover:text-brand-secondary"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorited ? "fill-brand-secondary text-brand-secondary" : ""}`} />
                    </button>
                  </div>

                  {/* Bottom Text */}
                  <div className="p-5 z-10 w-full" onClick={() => onExplore(dest.name, dest.id)}>
                    <div className="flex justify-between items-end gap-3 cursor-pointer">
                      <div>
                        <h3 className="font-display text-lg font-bold text-on-surface leading-snug">
                          {dest.name}
                        </h3>
                        <p className="font-display text-[11px] font-semibold text-brand-secondary/80 mt-0.5 tracking-wider uppercase">
                          {dest.tagline}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full glass-panel border border-white/10 flex items-center justify-center text-on-surface backdrop-blur-md group-hover:bg-brand-primary group-hover:text-bg-darker transition-colors duration-300 shrink-0">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
