import { Bell, Wallet } from "lucide-react";

export default function MobileHeader() {
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
        <img
          alt="Mobile User Avatar"
          className="w-8 h-8 rounded-full object-cover border border-white/20"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDInlTjzX3WU4bGFXI5uDwTL0bjElJcX1Mdq-iE6LiKPu2AaxAv0loYi2lg3ogBHe7MywXDvzuE6HSTqwwc0_J34SEj5V0_1I5O47A7xDj89o6MDNhLQiZOzRQnmeKizHDKttmg-kZ0Ns6GBApdBCkVCWTML650zEpULg0bqI51_0l_m9f4_QqP0ADxAd5yTjP3L0zdieGTB1gz1-8xaK0wD-rVGCFOiJJnrqltpQ6M3puPHh3ut7raGE7cJO7Rh2gPeTwee6sNZa0L"
        />
      </div>
    </header>
  );
}
