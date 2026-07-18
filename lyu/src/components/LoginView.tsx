import React, { useState } from "react";
import { User, Lock, LogIn, UserPlus, Sparkles } from "lucide-react";

interface LoginViewProps {
  onLogin: (token: string, username: string) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setError(null);
    setIsLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Authentication failed. Try again.");
      }

      const data = await res.json();
      onLogin(data.token, data.username);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-bg-darker w-full">
      {/* Background Neon Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00dbe9]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ff24e4]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md glass-panel rounded-2xl p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 transition-all duration-300">
        {/* Brand/Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary shadow-[0_0_20px_rgba(0,219,233,0.2)] mb-4 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="font-display text-4xl font-extrabold text-on-surface tracking-tighter leading-none glow-cyan-sm">
            Lyu
          </h1>
          <p className="font-sans text-[11px] text-on-surface-variant tracking-widest uppercase font-bold mt-1.5">
            AUTHENTICATE EXPEDITION CREDENTIALS
          </p>
        </div>

        {/* Error panel */}
        {error && (
          <div className="p-3 mb-6 rounded-xl bg-red-950/40 border border-red-500/35 text-red-200 text-xs flex gap-2.5 animate-shake">
            <div className="font-bold shrink-0">Error:</div>
            <div className="leading-relaxed text-red-300">{error}</div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 pl-1">
              Username
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-on-surface-variant/40 absolute left-3.5" />
              <input
                type="text"
                required
                disabled={isLoading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-white/[0.03] border border-white/10 rounded-xl text-on-surface font-sans text-sm focus:border-brand-primary focus:shadow-[0_0_12px_rgba(0,219,233,0.2)] focus:outline-none transition-all"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 pl-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-on-surface-variant/40 absolute left-3.5" />
              <input
                type="password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-white/[0.03] border border-white/10 rounded-xl text-on-surface font-sans text-sm focus:border-brand-primary focus:shadow-[0_0_12px_rgba(0,219,233,0.2)] focus:outline-none transition-all"
                placeholder="Enter password"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="animate-fade-in">
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 pl-1">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-on-surface-variant/40 absolute left-3.5" />
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-white/[0.03] border border-white/10 rounded-xl text-on-surface font-sans text-sm focus:border-brand-primary focus:shadow-[0_0_12px_rgba(0,219,233,0.2)] focus:outline-none transition-all"
                  placeholder="Re-enter password"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-brand-primary to-[#00a3ff] text-bg-darker font-display font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,219,233,0.4)] disabled:opacity-50 disabled:pointer-events-none tactile-btn"
          >
            {isLoading ? (
              <span className="animate-pulse">Accessing mainframe...</span>
            ) : isLogin ? (
              <>
                <LogIn className="w-4 h-4" />
                Initialize Session
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Register Coordinates
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center border-t border-white/5 pt-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-xs text-brand-tertiary hover:text-brand-primary hover:underline transition-colors font-medium cursor-pointer"
          >
            {isLogin
              ? "New Traveler? Register access credentials"
              : "Already registered? Login to existing profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
