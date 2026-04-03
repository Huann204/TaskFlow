import { Plug, Wand2, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Plug,
    title: "Connect your workspace",
    description:
      "Sign up in seconds and connect your existing tools — Google Calendar, Notion, GitHub, Slack. TaskFlow AI learns your workflow from day one.",
    accent: "#7C3AED",
  },
  {
    number: "02",
    icon: Wand2,
    title: "Let AI create your plan",
    description:
      "Describe your project or paste a brief. Our AI instantly generates a structured task list, assigns priorities, and suggests realistic deadlines based on your schedule.",
    accent: "#6D28D9",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Execute and optimize",
    description:
      "Track your progress with real-time dashboards. The AI adapts your plan as things change — moving deadlines, re-prioritizing tasks, and celebrating your wins.",
    accent: "#3B82F6",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-4 relative">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 80% 50%, rgba(59,130,246,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-[#A78BFA] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full mb-4">
            Simple as 1, 2, 3
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F8FAFC] mb-4">
            From idea to{" "}
            <span className="gradient-text">done in minutes</span>
          </h2>
          <p className="text-lg text-[#94A3B8] max-w-xl mx-auto">
            No complex setup. No learning curve. Just describe what you need and
            watch TaskFlow AI handle the rest.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px"
               style={{ background: "linear-gradient(90deg, #7C3AED, #3B82F6)" }} />

          {steps.map(({ number, icon: Icon, title, description, accent }) => (
            <div key={number} className="relative flex flex-col items-center md:items-start text-center md:text-left group">
              {/* Step number circle */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative z-10 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}
              >
                <Icon className="w-7 h-7" style={{ color: accent }} strokeWidth={1.5} />
                <span
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                  style={{ background: accent }}
                >
                  {number.slice(1)}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-3">{title}</h3>
              <p className="text-[#94A3B8] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
