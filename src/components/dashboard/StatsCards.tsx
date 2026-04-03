import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatsCards({ tasks }: { tasks: any[] }) {
  const completed = tasks.filter((t) => t.status === "done").length;
  const overdue = tasks.filter((t) => t.status !== "done" && t.dueDate && new Date(t.dueDate) < new Date()).length;
  const productivity = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const stats = [
    { label: "Total Tasks", value: tasks.length, change: "Current sprint", trend: "neutral" },
    { label: "Completed", value: completed, change: "Current sprint", trend: completed > 0 ? "up" : "neutral" },
    { label: "Productivity", value: `${productivity}%`, change: "Completion rate", trend: productivity > 50 ? "up" : "down" },
    { label: "Overdue", value: overdue, change: "Requires attention", trend: overdue > 0 ? "down" : "up" },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const TrendIcon =
          stat.trend === "up"
            ? TrendingUp
            : stat.trend === "down"
            ? TrendingDown
            : Minus;
        const trendColor =
          stat.trend === "up"
            ? "text-emerald-400"
            : stat.trend === "down"
            ? stat.label === "Overdue"
              ? "text-red-400"
              : "text-red-400"
            : "text-[#94A3B8]";

        return (
          <div
            key={stat.label}
            className="glass-card p-5 hover:border-white/15 transition-all duration-300 cursor-default group"
          >
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-medium text-[#64748B] uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-[#F8FAFC] tabular-nums">
                {stat.value}
              </p>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}
              >
                <TrendIcon size={12} />
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
