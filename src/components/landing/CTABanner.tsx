import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="py-28 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div
          className="rounded-3xl p-12 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(59,130,246,0.2) 100%)",
            border: "1px solid rgba(124,58,237,0.3)",
            boxShadow: "0 0 60px rgba(124,58,237,0.15)",
          }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-[#A78BFA] bg-[#7C3AED]/20 border border-[#7C3AED]/30 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Your AI-powered future starts now
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-[#F8FAFC] mb-6 leading-tight">
              Ready to work smarter?
              <br />
              <span className="gradient-text">Start for free today.</span>
            </h2>

            <p className="text-lg text-[#94A3B8] mb-10 max-w-xl mx-auto">
              Join 50,000+ students, freelancers, and teams who already use
              TaskFlow AI to crush their goals. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white gradient-bg rounded-2xl cursor-pointer hover:opacity-90 transition-all duration-200 shadow-lg shadow-violet-700/30"
              >
                Get started free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-[#F8FAFC] glass-card cursor-pointer hover:bg-white/10 transition-all duration-200"
              >
                Watch a demo
              </Link>
            </div>

            <p className="mt-6 text-sm text-[#94A3B8]">
              Free plan forever. Pro trial — 14 days, no card needed. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
