"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Users, Clock } from "lucide-react";

const stats = [
  { value: "50K+", label: "Active users", icon: Users },
  { value: "10×", label: "Faster planning", icon: TrendingUp },
  { value: "3 hrs", label: "Saved per week", icon: Clock },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-16 overflow-hidden">
      {/* Radial background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.25) 0%, transparent 65%)",
        }}
      />
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-[#A78BFA] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by AI — built for makers
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-[#F8FAFC] mb-6">
          Work smarter,
          <br />
          <span className="gradient-text">not harder</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
          TaskFlow AI turns your ideas into structured plans instantly. Set
          smart deadlines, track your progress, and let AI handle the heavy
          lifting — so you can focus on building.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="#pricing"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white gradient-bg rounded-2xl cursor-pointer hover:opacity-90 transition-all duration-200 shadow-lg shadow-violet-700/30 hover:shadow-violet-700/50"
          >
            Start for free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-[#F8FAFC] glass-card cursor-pointer hover:bg-white/10 transition-all duration-200"
          >
            See how it works
          </Link>
        </div>

        {/* Floating stat cards */}
        <div className="flex flex-wrap justify-center gap-4">
          {stats.map(({ value, label, icon: Icon }, index) => (
            <div
              key={label}
              className="glass-card px-5 py-3.5 flex items-center gap-3 animate-float"
              style={{
                animationDelay: `${index * 0.5}s`,
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#A78BFA]" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-[#F8FAFC]">{value}</div>
                <div className="text-xs text-[#94A3B8]">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard mockup */}
      <div className="relative mt-20 max-w-5xl w-full mx-auto px-4">
        <div
          className="w-full rounded-2xl overflow-hidden glass-card p-1 animate-glow"
          style={{
            boxShadow:
              "0 0 0 1px rgba(124,58,237,0.2), 0 32px 64px rgba(0,0,0,0.6)",
          }}
        >
          {/* Fake browser chrome */}
          <div className="bg-[#111118] rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <div className="ml-3 flex-1 bg-white/5 rounded-md px-3 py-1 text-xs text-[#94A3B8] max-w-xs">
                app.taskflow.ai
              </div>
            </div>
            {/* Dashboard UI mockup */}
            <div className="flex h-[380px] md:h-[460px]">
              {/* Sidebar */}
              <div className="hidden md:flex flex-col w-56 bg-[#0D0D14] border-r border-white/5 p-4 gap-2">
                <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest px-2 mb-2">
                  Workspace
                </div>
                {[
                  "Dashboard",
                  "My Tasks",
                  "AI Assistant",
                  "Analytics",
                  "Team",
                ].map((item, i) => (
                  <div
                    key={item}
                    className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${
                      i === 0
                        ? "bg-[#7C3AED]/20 text-[#A78BFA] font-medium"
                        : "text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-[#F8FAFC]">My Dashboard</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-[#94A3B8]">AI Active</span>
                  </div>
                </div>
                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Tasks Today", value: "12", color: "#7C3AED" },
                    { label: "Completed", value: "8", color: "#10B981" },
                    { label: "In Progress", value: "4", color: "#3B82F6" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/5 rounded-xl p-3">
                      <div className="text-xl font-bold text-[#F8FAFC]">
                        {s.value}
                      </div>
                      <div className="text-xs" style={{ color: s.color }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Task list */}
                <div className="space-y-2">
                  {[
                    { text: "Design landing page hero section", done: true },
                    { text: "Set up CI/CD pipeline for staging", done: true },
                    { text: "Write unit tests for auth module", done: false },
                    { text: "Review pull request from @alex", done: false },
                  ].map(({ text, done }, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5"
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${done ? "border-[#7C3AED] bg-[#7C3AED]" : "border-white/20"}`}
                      >
                        {done && (
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path
                              d="M2 5l2.5 2.5L8 3"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-sm ${done ? "line-through text-[#94A3B8]" : "text-[#F8FAFC]"}`}
                      >
                        {text}
                      </span>
                      <div
                        className={`ml-auto w-2 h-2 rounded-full flex-shrink-0 ${done ? "bg-emerald-400" : i % 2 === 0 ? "bg-amber-400" : "bg-[#7C3AED]"}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
