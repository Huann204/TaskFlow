"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Clock } from "lucide-react";
import StatsCards from "@/components/dashboard/StatsCards";
import KanbanBoard from "@/components/dashboard/KanbanBoard";
import AIPanel from "@/components/dashboard/AIPanel";
import CreateTaskModal from "@/components/dashboard/CreateTaskModal";
import TaskDetailModal from "@/components/dashboard/TaskDetailModal";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

const recentActivity = [
  {
    text: 'Sam Chen completed "Configure database schema"',
    time: "2 min ago",
    color: "bg-emerald-400",
  },
  {
    text: 'Jordan Lee moved "Refactor task query" to In Progress',
    time: "18 min ago",
    color: "bg-[#3B82F6]",
  },
  {
    text: "AI suggested 3 subtasks for auth module",
    time: "1 hr ago",
    color: "bg-[#7C3AED]",
  },
  {
    text: 'Alex Morgan created "Design onboarding flow"',
    time: "3 hrs ago",
    color: "bg-amber-400",
  },
];

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<any>(null);

  const { data: tasks = [] } = useQuery<any[]>({
    queryKey: ["tasks"],
    queryFn: () => apiRequest("/tasks"),
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => apiRequest("/auth/me"),
  });

  const completedCount = tasks.filter((t: any) => t.status === "done").length;
  const totalCount = tasks.length;

  return (
    <>
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-[#F8FAFC]">
                Good morning, {user ? user.name.split(" ")[0] : "there"} 👋
              </h1>
            </div>
            <p className="text-sm text-[#64748B]">
              You have{" "}
              <span className="text-[#A78BFA] font-semibold">
                {tasks.filter((t: any) => t.status !== "done").length} active
                tasks
              </span>{" "}
              — {completedCount} of {totalCount} completed this sprint.
            </p>
          </div>

          {/* AI insight banner */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-3 glass-card border-[#7C3AED]/20">
            <div className="w-7 h-7 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#F8FAFC]">AI Insight</p>
              <p className="text-[11px] text-[#64748B]">
                Productivity up 12% vs last week
              </p>
            </div>
            <ArrowRight size={14} className="text-[#7C3AED]" />
          </div>
        </div>

        {/* Stats */}
        <StatsCards tasks={tasks} />

        {/* Main content: Kanban + AI side panel */}
        <div className="flex gap-6 min-h-0">
          {/* Kanban – takes remaining width */}
          <div className="flex-1 min-w-0">
            <KanbanBoard
              onCreateTask={() => {
                setTaskToEdit(null);
                setModalOpen(true);
              }}
              onEditTask={(task: any) => {
                setTaskToEdit(task);
                setModalOpen(true);
              }}
              onViewTask={(task: any) => {
                setTaskToEdit(task);
                setViewModalOpen(true);
              }}
            />
          </div>

          {/* AI Panel – fixed width */}
          <div
            className="hidden xl:flex flex-col w-80 flex-shrink-0"
            style={{ height: "600px" }}
          >
            <AIPanel />
          </div>
        </div>

        {/* Bottom row: Recent Activity + Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Recent Activity
              </h3>
              <button className="text-xs text-[#7C3AED] hover:text-[#A78BFA] transition-colors cursor-pointer">
                View all
              </button>
            </div>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.color}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#94A3B8] leading-snug">
                      {item.text}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock size={10} className="text-[#475569]" />
                      <span className="text-[11px] text-[#475569]">
                        {item.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sprint Progress */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Sprint Progress
              </h3>
              <span className="text-xs text-[#64748B]">April 2026</span>
            </div>

            {/* Overall progress */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#94A3B8]">Overall completion</span>
                <span className="font-semibold text-[#F8FAFC]">
                  {Math.round((completedCount / totalCount) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full gradient-bg rounded-full transition-all duration-700"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>

            {/* Per-status bars */}
            {[
              {
                label: "Done",
                count: tasks.filter((t: any) => t.status === "done").length,
                color: "bg-emerald-500",
              },
              {
                label: "In Progress",
                count: tasks.filter((t: any) => t.status === "in-progress")
                  .length,
                color: "bg-[#3B82F6]",
              },
              {
                label: "To Do",
                count: tasks.filter((t: any) => t.status === "todo").length,
                color: "bg-[#475569]",
              },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3 mb-3">
                <div
                  className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${row.color}`}
                />
                <span className="text-xs text-[#94A3B8] w-20 flex-shrink-0">
                  {row.label}
                </span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${row.color} opacity-80`}
                    style={{ width: `${(row.count / totalCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-[#F8FAFC] w-4 text-right">
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setTaskToEdit(null);
        }}
        task={taskToEdit}
        onEdit={() => {
          setViewModalOpen(false);
          setModalOpen(true);
        }}
      />
    </>
  );
}
