import { X, Calendar, Flag, AlignLeft, Tag, UserCircle2 } from "lucide-react";
import { type Task } from "@/types";

const PRIORITIES = [
  {
    value: "low",
    label: "Low",
    color: "text-[#64748B] border-[#64748B]/30 bg-[#64748B]/10",
  },
  {
    value: "medium",
    label: "Medium",
    color: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  },
  {
    value: "high",
    label: "High",
    color: "text-orange-400 border-orange-400/30 bg-orange-400/10",
  },
  {
    value: "urgent",
    label: "Urgent",
    color: "text-red-400 border-red-400/30 bg-red-400/10",
  },
];

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function TaskDetailModal({ task, isOpen, onClose, onEdit }: TaskDetailModalProps) {
  if (!isOpen || !task) return null;

  const priorityConfig = PRIORITIES.find(p => p.value === task.priority) || PRIORITIES[0];
  const overdue = task.status !== "done" && new Date(task.dueDate) < new Date();

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 py-8 overflow-y-auto pointer-events-none">
        <div className="bg-[#0D0D14] w-full max-w-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-full pointer-events-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
            <h2 className="text-xl font-bold text-[#F8FAFC] leading-snug break-words pr-4">
              {task.title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10 transition-all duration-200 shrink-0 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
            
            {/* Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-medium text-[#64748B] mb-1.5 uppercase tracking-wide">Status</p>
                <div className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg bg-white/5 text-[#F8FAFC] border border-white/10 capitalize">
                  {task.status.replace('-', ' ')}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-[#64748B] mb-1.5 uppercase tracking-wide">Priority</p>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border ${priorityConfig.color}`}>
                  <Flag size={12} />
                  {priorityConfig.label}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-[#64748B] mb-1.5 uppercase tracking-wide">Due Date</p>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border bg-white/5 ${overdue ? "text-red-400 border-red-400/20" : "text-[#F8FAFC] border-white/10"}`}>
                  <Calendar size={12} />
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-US", {
                    weekday: "short", month: "short", day: "numeric", year: "numeric"
                  }) : "No date set"}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-[#64748B] mb-1.5 uppercase tracking-wide">Assigned To</p>
                {task.assignedTo ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#A78BFA]">
                    <UserCircle2 size={12} />
                    {task.assignedTo.name}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-white/5 border border-white/10 text-[#64748B]">
                    <UserCircle2 size={12} />
                    Unassigned
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold text-[#94A3B8] mb-2 uppercase tracking-wide">
                <AlignLeft size={14} /> Description
              </p>
              <div className="text-sm text-[#F8FAFC]/90 leading-relaxed whitespace-pre-wrap bg-white/[0.02] border border-white/5 rounded-xl p-4">
                {task.description || <span className="text-[#64748B] italic">No description provided.</span>}
              </div>
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold text-[#94A3B8] mb-2 uppercase tracking-wide">
                  <Tag size={14} /> Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-semibold text-[#7C3AED] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/5 flex items-center justify-end shrink-0 bg-white/[0.02] rounded-b-2xl">
            <button
              onClick={onEdit}
              className="px-5 py-2 text-sm font-semibold text-white gradient-bg rounded-xl shadow-lg shadow-violet-700/20 hover:opacity-90 transition-all cursor-pointer"
            >
              Edit Task
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
