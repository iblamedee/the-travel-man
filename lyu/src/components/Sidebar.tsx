import { Compass, MessageSquare, Map, Heart, Settings, Plus, Star } from "lucide-react";
import { TravelPreferences } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onPlanNewTrip: () => void;
  preferences: TravelPreferences;
}

export default function Sidebar({ activeTab, setActiveTab, onPlanNewTrip, preferences }: SidebarProps) {
  const menuItems = [
    { id: "explore", label: "Exploration", icon: Compass },
    { id: "chat", label: "Chat History", icon: MessageSquare },
    { id: "itineraries", label: "Itineraries", icon: Map },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col bg-[#1e1e31]/60 backdrop-blur-xl border-r border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] z-40 justify-between">
      {/* Brand Header */}
      <div className="p-6 flex flex-col gap-1 border-b border-white/10">
        <h1 className="font-display text-[28px] font-bold text-brand-primary tracking-tighter leading-none glow-cyan-sm">
          Lyu
        </h1>
        <p className="font-sans text-[12px] text-on-surface-variant tracking-wide uppercase font-medium">
          AI Travel Partner
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 py-3.5 px-6 font-display text-[14px] font-semibold tracking-wide transition-all duration-300 relative group text-left ${
                isActive
                  ? "bg-brand-primary/10 text-brand-primary border-r-4 border-brand-primary shadow-[inset_-15px_0_15px_-10px_rgba(0,219,233,0.15)]"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-brand-primary" : ""}`} />
              {item.label}
              {item.id === "chat" && (
                <span className="ml-auto flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User / CTA Area */}
      <div className="p-6 border-t border-white/10 flex flex-col gap-4">
        <button
          onClick={onPlanNewTrip}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-primary to-[#00a3ff] text-bg-darker font-display font-bold text-[14px] tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,219,233,0.4)] tactile-btn"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          Plan New Trip
        </button>

        {/* Commander Shepard Avatar block */}
        <div className="flex items-center gap-3 mt-2 glass-panel p-2.5 rounded-xl border border-white/5 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
          <div className="relative">
            <img
              alt="Commander Shepard Profile"
              className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-inner group-hover:scale-105 transition-transform duration-300"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNvLFu0pX0YjRnCuhsSvueXm_G1MQseJ56H_ecyZVL_PhVOLf0KvOdHoIxhk_qhgvdKV_oHqr17awMz4rmUYuqRzwlDWNvcTXJ4dG2kk06-pRxMSCEpHf20hRD7_oq3nHOlLSWP71IzQ0KkejFQekYc67r1w_8fko5Pv3BqUxaYvEF7G3JiPD_EQQjylqExzyeoIXqzoBcz2nzPYGnGdwdHdrrld2yf4a7IO0FWG6FEUs3_6bxZxaL32Tq2YU6pzdiCltW4zOoFHTB"
            />
            <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-3 h-3 rounded-full border-2 border-bg-dark"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-[13px] text-on-surface truncate">
              Commander Shepard
            </p>
            <p className="font-sans text-[11px] text-on-surface-variant font-medium flex items-center gap-1 uppercase tracking-wider">
              <Star className="w-2.5 h-2.5 fill-brand-secondary stroke-none" />
              Pro Tier
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
