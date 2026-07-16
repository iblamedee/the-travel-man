import { Heart, Compass, ArrowUpRight, Flame } from "lucide-react";
import { Destination } from "../types";
import { initialDestinations } from "../destinationsData";

interface FavoritesViewProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onExplore: (name: string, id?: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function FavoritesView({
  favorites,
  toggleFavorite,
  onExplore,
  setActiveTab
}: FavoritesViewProps) {
  // Filter destinations that are favorited
  const favoritedDestinations = initialDestinations.filter((dest) =>
    favorites.includes(dest.id)
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-8 animate-fade-in">
      <div className="border-b border-white/10 pb-4">
        <h2 className="font-display font-bold text-xl text-on-surface">Bookmarked Stations</h2>
        <p className="font-sans text-xs text-on-surface-variant mt-1">
          Your saved spatial coordinates and favorite travel sectors.
        </p>
      </div>

      {favoritedDestinations.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center max-w-md mx-auto border border-white/5 mt-8">
          <Heart className="w-12 h-12 text-brand-secondary/40 mx-auto mb-4 animate-pulse" />
          <h4 className="font-display font-bold text-sm text-on-surface mb-2">The Terminal is Empty</h4>
          <p className="font-sans text-xs text-on-surface-variant mb-6 leading-relaxed font-medium">
            Browse coordinates in the Exploration hub and touch the Heart icon on any destination card to bookmark it here.
          </p>
          <button
            onClick={() => setActiveTab("explore")}
            className="px-6 py-2.5 bg-brand-primary text-bg-darker font-display font-bold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer tactile-btn"
          >
            Go Explore
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {favoritedDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onExplore(dest.name, dest.id)}
              className="glass-panel rounded-2xl border border-white/10 overflow-hidden group cursor-pointer hover:border-brand-primary/30 transition-all duration-300 relative h-60 flex flex-col justify-end"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${dest.imageUrl}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-darker/95 via-bg-darker/35 to-transparent" />

              {/* Top Row Favorite Heart Icon */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(dest.id);
                  }}
                  className="w-9 h-9 rounded-full bg-brand-secondary/15 border border-brand-secondary/45 text-brand-secondary flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-brand-secondary" />
                </button>
              </div>

              {/* Bottom text */}
              <div className="p-5 z-10">
                <span className="text-[9px] font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded uppercase tracking-wide font-mono">
                  {dest.tags[0]} · {dest.tags[1] || "Sector"}
                </span>
                <div className="flex justify-between items-end mt-2">
                  <div>
                    <h3 className="font-display font-bold text-[17px] text-on-surface group-hover:text-brand-primary transition-colors">
                      {dest.name}
                    </h3>
                    <p className="font-display text-[11px] font-semibold text-on-surface-variant leading-none">
                      {dest.country}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full glass-panel border border-white/10 flex items-center justify-center text-on-surface backdrop-blur-md group-hover:bg-brand-primary group-hover:text-bg-darker transition-colors duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
