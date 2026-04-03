"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for students and personal projects.",
    cta: "Get started free",
    features: [
      "Up to 50 tasks/month",
      "Basic AI task generation",
      "List & kanban view",
      "3 integrations",
      "Email reminders",
    ],
    excluded: ["Advanced analytics", "AI assistant chat", "Team workspace"],
    highlighted: false,
  },
  {
    name: "Pro",
    monthlyPrice: 12,
    yearlyPrice: 9,
    description: "For freelancers and indie hackers who move fast.",
    cta: "Start Pro trial",
    badge: "Most popular",
    features: [
      "Unlimited tasks",
      "Full AI task generator",
      "Smart deadline suggestions",
      "AI assistant (chat)",
      "Advanced analytics",
      "All integrations",
      "Priority support",
    ],
    excluded: ["Team workspace"],
    highlighted: true,
  },
  {
    name: "Team",
    monthlyPrice: 29,
    yearlyPrice: 22,
    description: "For small startup teams who want to ship faster.",
    cta: "Start Team trial",
    features: [
      "Everything in Pro",
      "Team workspace (up to 10)",
      "Shared kanban boards",
      "Team performance analytics",
      "Admin & permissions",
      "Priority onboarding",
      "Dedicated Slack support",
    ],
    excluded: [],
    highlighted: false,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-28 px-4 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 70% 40%, rgba(124,58,237,0.07) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-[#A78BFA] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full mb-4">
            Simple, transparent pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F8FAFC] mb-4">
            Start free, scale{" "}
            <span className="gradient-text">when you&apos;re ready</span>
          </h2>
          <p className="text-lg text-[#94A3B8] max-w-xl mx-auto mb-8">
            No surprise charges. Cancel any time. Students get 50% off the Pro
            plan with a valid .edu email.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 glass-card px-4 py-2 rounded-xl">
            <button
              onClick={() => setYearly(false)}
              className={`text-sm font-medium px-3 py-1 rounded-lg cursor-pointer transition-all duration-200 ${!yearly ? "bg-[#7C3AED] text-white" : "text-[#94A3B8]"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`text-sm font-medium px-3 py-1 rounded-lg cursor-pointer transition-all duration-200 ${yearly ? "bg-[#7C3AED] text-white" : "text-[#94A3B8]"}`}
            >
              Yearly
            </button>
            {yearly && (
              <span className="text-xs text-emerald-400 font-semibold">
                Save 25%
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map(
            ({
              name,
              monthlyPrice,
              yearlyPrice,
              description,
              cta,
              badge,
              features,
              excluded,
              highlighted,
            }) => (
              <div
                key={name}
                className={`relative rounded-2xl p-6 flex flex-col gap-5 transition-transform duration-300 hover:-translate-y-1 ${
                  highlighted
                    ? "gradient-border bg-[#0D0D14]"
                    : "glass-card"
                }`}
                style={
                  highlighted
                    ? {
                        boxShadow:
                          "0 0 40px rgba(124,58,237,0.15), 0 2px 32px rgba(0,0,0,0.5)",
                      }
                    : undefined
                }
              >
                {badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold gradient-bg text-white rounded-full">
                    {badge}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-[#F8FAFC] mb-1">
                    {name}
                  </h3>
                  <p className="text-sm text-[#94A3B8]">{description}</p>
                </div>

                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-[#F8FAFC]">
                    ${yearly ? yearlyPrice : monthlyPrice}
                  </span>
                  <span className="text-[#94A3B8] text-sm mb-1">/ month</span>
                </div>

                <Link
                  href="#"
                  className={`block text-center py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 ${
                    highlighted
                      ? "gradient-bg text-white hover:opacity-90 shadow-lg shadow-violet-700/30"
                      : "bg-white/8 text-[#F8FAFC] hover:bg-white/15"
                  }`}
                >
                  {cta}
                </Link>

                <div className="space-y-2.5">
                  {features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <Check
                        className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5"
                        strokeWidth={2.5}
                      />
                      <span className="text-sm text-[#F8FAFC]">{f}</span>
                    </div>
                  ))}
                  {excluded.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 opacity-40">
                      <div className="w-4 h-4 flex-shrink-0 mt-0.5 flex items-center justify-center">
                        <div className="w-3 h-[1.5px] bg-[#94A3B8] rounded" />
                      </div>
                      <span className="text-sm text-[#94A3B8] line-through">
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
