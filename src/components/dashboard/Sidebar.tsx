"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Settings,
  MessageSquareText,
  ChevronLeft,
  ChevronRight,
  Users,
  Sparkles,
  Settings2,
} from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { label: "AI Assistant", href: "/dashboard/ai", icon: MessageSquareText },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

const teamNavItems = [
  { label: "Team", href: "/dashboard/team", icon: Users },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const personalNavItems = [
  { label: "Workspace", href: "/dashboard/team", icon: Settings2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { activeWorkspace } = useWorkspace();

  return (
    <aside
      className={`relative flex flex-col border-r border-white/[0.06] bg-[#0D0D14] transition-all duration-300 ease-in-out flex-shrink-0 ${
        collapsed ? "w-[68px]" : "w-60"
      }`}
    >
      {/* Top: Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span className="font-bold text-[#F8FAFC] text-sm leading-none">
            TaskFlow <span className="gradient-text">AI</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="text-[10px] font-semibold text-[#475569] uppercase tracking-widest px-3 mb-3">
            Workspace
          </p>
        )}
        {[...navItems, ...(activeWorkspace?.type === 'personal' ? personalNavItems : teamNavItems)].map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer ${
                active
                  ? "bg-[#7C3AED]/20 text-[#A78BFA]"
                  : "text-[#64748B] hover:bg-white/5 hover:text-[#F8FAFC]"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon
                className={`w-4.5 h-4.5 flex-shrink-0 transition-colors duration-200 ${
                  active ? "text-[#A78BFA]" : "text-[#475569] group-hover:text-[#94A3B8]"
                }`}
                size={18}
              />
              {!collapsed && <span>{label}</span>}
              {!collapsed && active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* AI Badge */}
      {!collapsed && (
        <div className="mx-2 mb-3">
          <div className="glass-card p-3 border-[#7C3AED]/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-semibold text-[#F8FAFC]">AI Active</span>
              <span className="ml-auto inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Your AI assistant has 3 new suggestions ready.
            </p>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-[#1A1A2E] border border-white/10 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#F8FAFC] hover:border-white/20 transition-all duration-200 cursor-pointer z-10 shadow-lg"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
