import { Bell, Wallet, LogOut } from "lucide-react";

interface MobileHeaderProps {
  username: string;
  onLogout: () => void;
}

export default function MobileHeader({ username, onLogout }: MobileHeaderProps) {
  return (
    <header className="md:hidden flex justify-between items-center px-6 w-full sticky top-0 z-40 bg-[#1e1e31]/85 backdrop-blur-md h-16 border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
      <h1 className="font-display text-[22px] font-extrabold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent tracking-tighter">
        Lyu
      </h1>
      <div className="flex items-center gap-4">
        <button className="text-on-surface-variant hover:text-brand-primary transition-colors cursor-pointer relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-brand-secondary"></span>
        </button>
        <button className="text-on-surface-variant hover:text-brand-primary transition-colors cursor-pointer">
          <Wallet className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary font-display font-bold text-xs uppercase shrink-0">
          {username ? username.slice(0, 2) : "TR"}
        </div>
        <button
          onClick={onLogout}
          title="Log Out"
          className="text-on-surface-variant/60 hover:text-brand-secondary p-1 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
