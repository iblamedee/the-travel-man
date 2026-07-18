import { useState, useEffect } from "react";
import { X, Map, Compass, BookOpen, Sparkles, Loader2, Info, Check } from "lucide-react";
import { ExploreDetails } from "../types";
import { prebakedExploreDetails } from "../destinationsData";

interface ExploreModalProps {
  destinationName: string;
  destinationId?: string;
  onClose: () => void;
  onGenerateItinerary: (destinationName: string) => void;
}

export default function ExploreModal({
  destinationName,
  destinationId,
  onClose,
  onGenerateItinerary
}: ExploreModalProps) {
  const [details, setDetails] = useState<ExploreDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"highlights" | "secrets" | "food" | "culture">("highlights");

  useEffect(() => {
    async function fetchExploreDetails() {
      setIsLoading(true);
      setError(null);

      // Check prebaked first for instantaneous premium loading
      const normalizedId = destinationId || destinationName.toLowerCase().replace(/\s+/g, "-");
      if (prebakedExploreDetails[normalizedId]) {
        // Yield momentarily to simulate scanning (giving a high-tech premium feel)
        await new Promise((r) => setTimeout(r, 600));
        setDetails(prebakedExploreDetails[normalizedId]);
        setIsLoading(false);
        return;
      }

      // Query Gemini API if not prebaked
      try {
        const token = localStorage.getItem("lyu_token");
        const res = await fetch("/api/explore/details", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ destination: destinationName })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to contact sub-orbital services.");
        }

        const data = await res.json();
        setDetails(data);
      } catch (err: any) {
        console.error(err);
        setError("Lyu failed to complete the deep atmospheric scan. Showing default generic fallback coordinates.");
        // Basic fallback details so the UI never breaks
        setDetails({
          destination: destinationName,
          localSecrets: [
            "Ask local micro-shuttle operators about the off-peak transit shortcuts.",
            "Visit the central observatory deck exactly 10 minutes before local sunset for maximum stellar refraction.",
            "Find the oldest tea house hidden behind the holographic market square."
          ],
          signatureFoods: [
            { name: "Synthetic Street Gyoza", description: "Crisp pocket dumplings infused with local organic herbs and thermal spices." },
            { name: "Quantum Nectar Tea", description: "Brewed tea leaves that change aroma dynamically with temperature changes." }
          ],
          culturalEtiquette: [
            "Do not record neural telemetry inside standard religious or heritage spaces.",
            "Keep personal communications focused on local frequencies."
          ],
          highlights: [
            { name: "The Holographic Plaza", tagline: "The dynamic cultural hub", description: "A gorgeous square filled with floating light artworks and local artists." },
            { name: "The Ancient Quarter", tagline: "Traditional architecture preserved", description: "Wander through centuries-old alleys perfectly preserved amidst neon scrapers." }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchExploreDetails();
  }, [destinationName, destinationId]);

  return (
    <div className="fixed inset-0 bg-bg-darker/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Container Card */}
      <div className="w-full max-w-3xl h-[85vh] glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col shadow-2xl relative animate-scale-up">
        {/* Header Block with background visual */}
        <div className="relative h-44 shrink-0 flex items-end p-6 bg-gradient-to-t from-bg-dark to-transparent">
          <div className="absolute inset-0 bg-[#1e1e31]/70" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center border border-white/10 cursor-pointer transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="relative z-10">
            <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-1 rounded-md uppercase tracking-widest font-mono">
              Deep Planetary Scan
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface mt-2">
              {destinationName}
            </h2>
            <p className="font-sans text-xs text-on-surface-variant font-medium mt-1">
              Analyzing hidden sub-grids, cultural indices, and delicacies
            </p>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
            <div className="text-center">
              <p className="font-display font-semibold text-sm text-on-surface animate-pulse">
                Initiating Lyu Quantum Sensor Array...
              </p>
              <p className="font-sans text-xs text-on-surface-variant mt-1">
                Parsing localized sub-ether logs for hidden secrets
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Nav Tabs */}
            <div className="flex border-b border-white/10 px-6 bg-bg-dark/30 overflow-x-auto no-scrollbar shrink-0 gap-2">
              {[
                { id: "highlights", label: "Highlights", icon: Compass },
                { id: "secrets", label: "Local Secrets", icon: Sparkles },
                { id: "food", label: "Culinary", icon: BookOpen },
                { id: "culture", label: "Etiquette", icon: Info }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 px-4 font-display text-xs font-bold border-b-2 tracking-wide transition-all cursor-pointer ${
                      isActive
                        ? "border-brand-primary text-brand-primary bg-brand-primary/5"
                        : "border-transparent text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Error Message banner */}
            {error && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-yellow-950/20 border border-yellow-500/20 text-[11px] text-yellow-300 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-yellow-400" />
                {error}
              </div>
            )}

            {/* Tab Contents Scrollable Block */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 no-scrollbar">
              {activeTab === "highlights" && details && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {details.highlights?.map((hl, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-primary/20 transition-all"
                    >
                      <h4 className="font-display font-bold text-sm text-on-surface flex items-center gap-2">
                        <span className="flex h-5 w-5 rounded-md bg-brand-primary/10 text-brand-primary items-center justify-center text-[10px] font-mono">
                          0{idx + 1}
                        </span>
                        {hl.name}
                      </h4>
                      <p className="font-display text-[10px] font-bold text-brand-secondary/80 mt-1 uppercase tracking-wider">
                        {hl.tagline}
                      </p>
                      <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed">
                        {hl.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "secrets" && details && (
                <div className="space-y-3">
                  {details.localSecrets?.map((secret, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/10 flex gap-3 items-start"
                    >
                      <Sparkles className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-display font-bold text-xs text-brand-primary tracking-wide uppercase">
                          Secret Log {idx + 1}
                        </h4>
                        <p className="font-sans text-xs text-on-surface mt-1 leading-relaxed">
                          {secret}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "food" && details && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {details.signatureFoods?.map((food, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center flex flex-col justify-between"
                    >
                      <div className="h-10 w-10 rounded-full bg-brand-secondary/15 text-brand-secondary flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-xs text-on-surface mb-1">
                          {food.name}
                        </h4>
                        <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed">
                          {food.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "culture" && details && (
                <div className="space-y-3">
                  {details.culturalEtiquette?.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3 items-center"
                    >
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <p className="font-sans text-xs text-on-surface leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Panel CTA */}
            <div className="p-4 border-t border-white/10 bg-bg-darker/60 flex items-center justify-between shrink-0">
              <p className="font-sans text-[11px] text-on-surface-variant font-medium">
                Ready to chart your flight vector?
              </p>
              <button
                onClick={() => {
                  onGenerateItinerary(destinationName);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-brand-primary text-bg-darker font-display font-bold text-xs flex items-center gap-1.5 transition-all hover:opacity-95 hover:shadow-[0_0_15px_rgba(0,219,233,0.3)] cursor-pointer tactile-btn"
              >
                <Map className="w-3.5 h-3.5" />
                Generate Full Itinerary
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
