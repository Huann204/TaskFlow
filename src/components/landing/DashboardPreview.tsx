import { CheckCircle, Layers, Cpu, BarChart2 } from "lucide-react";

const callouts = [
  { label: "AI suggestions", x: "5%",  y: "18%", icon: Cpu },
  { label: "Kanban board",   x: "60%", y: "8%",  icon: Layers },
  { label: "Analytics",      x: "68%", y: "78%", icon: BarChart2 },
  { label: "Task completed", x: "2%",  y: "72%", icon: CheckCircle },
];

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="py-28 px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-[#A78BFA] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full mb-4">
            See it in action
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F8FAFC] mb-4">
            Your entire workflow,{" "}
            <span className="gradient-text">one beautiful view</span>
          </h2>
          <p className="text-lg text-[#94A3B8] max-w-xl mx-auto">
            A productivity dashboard that&apos;s simple enough for a student and
            powerful enough for a startup team.
          </p>
        </div>

        {/* App preview */}
        <div className="relative">
          <div
            className="rounded-2xl overflow-hidden glass-card"
            style={{
              boxShadow:
                "0 0 0 1px rgba(124,58,237,0.15), 0 40px 80px rgba(0,0,0,0.7)",
            }}
          >
            {/* Browser bar */}
            <div className="bg-[#0D0D14] px-5 py-3 flex items-center gap-2 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <div className="ml-4 flex-1 max-w-xs bg-white/5 rounded-md px-3 py-1 text-xs text-[#94A3B8]">
                app.taskflow.ai/dashboard
              </div>
            </div>

            {/* Dashboard content */}
            <div className="bg-[#0D0D14] flex" style={{ minHeight: 480 }}>
              {/* Sidebar */}
              <div className="hidden lg:flex flex-col w-52 bg-[#090910] border-r border-white/5 p-4 gap-1 flex-shrink-0">
                <div className="flex items-center gap-2 mb-6 px-2">
                  <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold">T</div>
                  <span className="text-sm font-semibold text-[#F8FAFC]">TaskFlow AI</span>
                </div>
                {["Dashboard","My Tasks","AI Assistant","Kanban","Analytics","Settings"].map((item, i) => (
                  <div key={item} className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${i === 0 ? "bg-[#7C3AED]/20 text-[#A78BFA] font-medium" : "text-[#94A3B8] hover:bg-white/5"}`}>
                    {item}
                  </div>
                ))}
              </div>

              {/* Main */}
              <div className="flex-1 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-semibold text-[#F8FAFC]">Good morning, Alex 👋</h4>
                    <p className="text-xs text-[#94A3B8]">You have 4 tasks due today</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400 font-medium">AI Active</span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: "Total Tasks", value: "32" },
                    { label: "Completed",   value: "24", accent: true },
                    { label: "In Progress", value: "5" },
                    { label: "On Hold",     value: "3" },
                  ].map((s) => (
                    <div key={s.label} className={`rounded-xl p-4 ${s.accent ? "gradient-bg" : "bg-white/5"}`}>
                      <div className="text-2xl font-bold text-[#F8FAFC]">{s.value}</div>
                      <div className="text-xs text-[#94A3B8]">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Two-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Task list */}
                  <div className="lg:col-span-2 bg-white/3 rounded-xl p-4">
                    <h5 className="text-sm font-semibold text-[#F8FAFC] mb-3">Today&apos;s Tasks</h5>
                    <div className="space-y-2">
                      {[
                        { text: "Finalize API integration", priority: "High", done: true },
                        { text: "Write product documentation",  priority: "Medium", done: true },
                        { text: "Review design mockups",       priority: "High", done: false },
                        { text: "Deploy to staging server",    priority: "Low",  done: false },
                      ].map(({ text, priority, done }, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${done ? "bg-[#7C3AED] border-[#7C3AED]" : "border-white/20"}`}>
                            {done && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                          </div>
                          <span className={`text-sm flex-1 ${done ? "line-through text-[#94A3B8]" : "text-[#F8FAFC]"}`}>{text}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${priority === "High" ? "bg-red-500/20 text-red-400" : priority === "Medium" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                            {priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI panel */}
                  <div className="bg-white/3 rounded-xl p-4 flex flex-col">
                    <h5 className="text-sm font-semibold text-[#F8FAFC] mb-3">AI Suggestions</h5>
                    <div className="space-y-2 flex-1">
                      {[
                        "Move \"Review design mockups\" to tomorrow — your calendar shows no free blocks today.",
                        "You&apos;re on track to hit your weekly goal of 20 tasks! 🎯",
                      ].map((s, i) => (
                        <div key={i} className="p-3 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-lg text-xs text-[#94A3B8] leading-relaxed">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating callout labels */}
          {callouts.map(({ label, x, y, icon: Icon }) => (
            <div
              key={label}
              className="absolute hidden lg:flex items-center gap-1.5 px-3 py-1.5 glass-card text-xs font-medium text-[#F8FAFC] animate-float"
              style={{ left: x, top: y, animationDelay: `${Math.random()}s` }}
            >
              <Icon className="w-3.5 h-3.5 text-[#A78BFA]" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
