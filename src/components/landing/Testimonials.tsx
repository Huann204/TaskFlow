import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Final-year CS student",
    avatar: "SC",
    quote:
      "TaskFlow AI literally changed how I manage my thesis. I typed in my project brief and it generated a full 3-month task breakdown in seconds. My supervisor was impressed.",
    rating: 5,
    color: "#7C3AED",
  },
  {
    name: "Marcus Rivera",
    role: "Freelance developer",
    avatar: "MR",
    quote:
      "I juggle 4–5 clients at a time. The AI re-prioritization feature alone saves me an hour every morning. It's like having a project manager who actually understands code.",
    rating: 5,
    color: "#3B82F6",
  },
  {
    name: "Priya Sharma",
    role: "Co-founder, LaunchPad",
    avatar: "PS",
    quote:
      "Our 6-person team switched from Notion + Trello to TaskFlow AI. The integrated analytics show us exactly where we're losing time. ROI was obvious within the first week.",
    rating: 5,
    color: "#6D28D9",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-28 px-4 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 20% 60%, rgba(59,130,246,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-[#A78BFA] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full mb-4">
            Real people, real results
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F8FAFC] mb-4">
            Loved by students,{" "}
            <span className="gradient-text">freelancers & teams</span>
          </h2>
          <p className="text-lg text-[#94A3B8] max-w-xl mx-auto">
            Don&apos;t take our word for it — here&apos;s what people actually say after
            switching to TaskFlow AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, avatar, quote, rating, color }) => (
            <div
              key={name}
              className="glass-card p-6 flex flex-col gap-4 cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:border-white/15"
            >
              <StarRating count={rating} />
              <p className="text-[#94A3B8] text-sm leading-relaxed flex-1">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: color }}
                >
                  {avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F8FAFC]">{name}</div>
                  <div className="text-xs text-[#94A3B8]">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
