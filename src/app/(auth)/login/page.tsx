"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { apiRequest, setAuthToken } = await import("@/lib/api");
      const data = await apiRequest("/auth/login", {
        method: "POST",
        data: { email, password },
      });
      setAuthToken(data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10 animate-fade-up">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-violet-700/30">
          <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-xl text-[#F8FAFC]">
          TaskFlow <span className="gradient-text">AI</span>
        </span>
      </div>

      {/* Card */}
      <div className="glass-card p-8 gradient-border">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#F8FAFC] mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-[#94A3B8]">
            Sign in to continue to your workspace
          </p>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#F8FAFC] bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#F8FAFC] bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-[#94A3B8]">or continue with email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-[#94A3B8]"
            >
              Email address
            </label>
            <div className="relative">
              <Mail
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                  focusedField === "email" ? "text-[#A78BFA]" : "text-[#475569]"
                }`}
              />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="alex@company.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-xl text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition-all duration-200 ${
                  focusedField === "email"
                    ? "border-[#7C3AED]/60 shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
                    : "border-white/10 hover:border-white/20"
                }`}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-[#94A3B8]"
              >
                Password
              </label>
              <Link
                href="#"
                className="text-xs text-[#7C3AED] hover:text-[#A78BFA] transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                  focusedField === "password"
                    ? "text-[#A78BFA]"
                    : "text-[#475569]"
                }`}
              />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-2.5 bg-white/5 border rounded-xl text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition-all duration-200 ${
                  focusedField === "password"
                    ? "border-[#7C3AED]/60 shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
                    : "border-white/10 hover:border-white/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94A3B8] transition-colors duration-200 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 rounded border border-white/20 bg-white/5 accent-[#7C3AED] cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="text-sm text-[#94A3B8] cursor-pointer"
            >
              Keep me signed in
            </label>
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white gradient-bg rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200 shadow-lg shadow-violet-700/30 hover:shadow-violet-700/50 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-[#94A3B8]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[#A78BFA] hover:text-[#7C3AED] font-medium transition-colors duration-200"
          >
            Create one free
          </Link>
        </p>
      </div>

      {/* Trust indicators */}
      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[#475569]">
        <span className="flex items-center gap-1.5">
          <svg className="w-3 h-3 text-emerald-500" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0a6 6 0 110 12A6 6 0 016 0zm2.5 4L5 7.5 3.5 6l-1 1L5 9.5l4.5-4.5L9.5 4z" />
          </svg>
          SOC 2 Compliant
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3 h-3 text-emerald-500" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0a6 6 0 110 12A6 6 0 016 0zm2.5 4L5 7.5 3.5 6l-1 1L5 9.5l4.5-4.5L9.5 4z" />
          </svg>
          256-bit SSL
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3 h-3 text-emerald-500" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 0a6 6 0 110 12A6 6 0 016 0zm2.5 4L5 7.5 3.5 6l-1 1L5 9.5l4.5-4.5L9.5 4z" />
          </svg>
          GDPR Ready
        </span>
      </div>
    </div>
  );
}
