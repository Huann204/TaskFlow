import {
  Brain,
  CalendarCheck,
  LayoutGrid,
  BarChart3,
  MessageSquare,
  Bell,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Task Generator",
    description:
      "Describe your project in plain English. TaskFlow AI instantly breaks it down into actionable tasks with priorities and subtasks.",
  },
  {
    icon: CalendarCheck,
    title: "Smart Deadlines",
    description:
      "Our AI analyzes your workload and past patterns to suggest realistic deadlines — keeping you productive without burning out.",
  },
  {
    icon: LayoutGrid,
    title: "Kanban + List View",
    description:
      "Visualize your work however you prefer. Switch seamlessly between a drag-and-drop kanban board and a focused list view.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track your productivity trends, completion rates, and time-on-task with beautiful charts that make insights obvious.",
  },
  {
    icon: MessageSquare,
    title: "AI Assistant",
    description:
      "Chat with your built-in AI to reprioritize tasks, get suggestions, summarize your day, or brainstorm new ideas — all in context.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Intelligent reminders that adapt to your schedule. No more missed deadlines — get nudged at the right time, every time.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28 px-4 relative">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-[#A78BFA] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full mb-4">
            Everything you need
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F8FAFC] mb-4">
            Supercharged with{" "}
            <span className="gradient-text">artificial intelligence</span>
          </h2>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
            From idea to done — TaskFlow AI handles the planning so you can
            focus on actually building.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="glass-card gradient-glow p-6 cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/30"
            >
              <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <Icon className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">
                {title}
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
