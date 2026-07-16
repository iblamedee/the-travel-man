import { Compass, MessageSquare, Plus, Map, Settings } from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onPlanNewTrip: () => void;
}

export default function MobileNav({ activeTab, setActiveTab, onPlanNewTrip }: MobileNavProps) {
  const tabs = [
    { id: "explore", label: "Explore", icon: Compass },
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "spacer", label: "", icon: null }, // Spacer for floating action button
    { id: "itineraries", label: "Trips", icon: Map },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#1e1e31]/80 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_32px_0_rgba(0,0,0,0.3)]">
      <div className="flex justify-around items-center h-20 px-2 relative">
        {tabs.map((tab, idx) => {
          if (tab.id === "spacer") {
            return (
              <div key="spacer" className="w-14 relative flex justify-center" style={{ contentVisibility: "auto" }}>
                <button
                  onClick={onPlanNewTrip}
                  className="absolute -top-7 w-14 h-14 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-[0_4px_20px_rgba(0,219,233,0.45)] text-bg-darker transition-transform hover:scale-110 active:scale-95 duration-200 cursor-pointer tactile-btn"
                >
                  <Plus className="w-7 h-7 stroke-[3px]" />
                </button>
              </div>
            );
          }

          const Icon = tab.icon!;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 flex-1 py-2 text-center transition-all ${
                isActive ? "text-brand-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <div
                className={`w-12 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? "bg-brand-primary/10" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-display text-[11px] font-bold tracking-wide">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
