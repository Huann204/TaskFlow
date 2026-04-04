"use client";

import { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Loader2,
  AlignLeft,
  Tag,
  Calendar,
  Flag,
  Plus,
  UserCircle2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useTeam } from "@/hooks/useTeam";
import { useWorkspace } from "@/hooks/useWorkspace";
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

const TAGS_OPTIONS = [
  "design",
  "frontend",
  "backend",
  "docs",
  "devops",
  "api",
  "ux",
];

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: any;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  taskToEdit,
}: CreateTaskModalProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    tags: [] as string[],
    assignedTo: "" as string,
  });

  const { activeWorkspaceId } = useWorkspace();
  const { data: team } = useTeam(activeWorkspaceId);

  useEffect(() => {
    if (taskToEdit) {
      setForm({
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        priority: taskToEdit.priority || "medium",
        dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split("T")[0] : "",
        tags: taskToEdit.tags || [],
        assignedTo: taskToEdit.assignedTo?.id || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        tags: [] as string[],
        assignedTo: "",
      });
    }
  }, [taskToEdit, isOpen]);

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: (newTask: any) =>
      apiRequest("/tasks", {
        method: "POST",
        data: { ...newTask, workspaceId: activeWorkspaceId },
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeWorkspaceId] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: (updatedTask: any) =>
      apiRequest(`/tasks/${taskToEdit.id}`, {
        method: "PATCH",
        data: updatedTask,
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeWorkspaceId] });
    },
  });

  if (!isOpen) return null;

  const update = (field: string, value: string | string[]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const toggleTag = (tag: string) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter((t) => t !== tag)
        : [...f.tags, tag],
    }));
  };

  const handleGenerateWithAI = async () => {
    if (!form.title.trim()) return;
    setGenerating(true);
    try {
      const data = await apiRequest("/ai/generate", {
        method: "POST",
        data: { prompt: form.title },
      });
      update("description", data.result);
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        assignedTo: form.assignedTo || null,
      };
      if (taskToEdit) {
        await updateTaskMutation.mutateAsync(payload);
      } else {
        await createTaskMutation.mutateAsync({
          ...payload,
          status: "todo",
        });
      }
      setForm({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        tags: [],
        assignedTo: "",
      });
      onClose();
    } catch (error) {
      console.error("Task save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const inputBase = (field: string) =>
    `w-full bg-white/5 border rounded-xl text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition-all duration-200 ${
      focusedField === field
        ? "border-[#7C3AED]/60 shadow-[0_0_0_3px_rgba(124,58,237,0.12)]"
        : "border-white/10 hover:border-white/20"
    }`;

  const activeMembers = team?.members.filter((m) => m.status === "active") ?? [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="glass-card w-full max-w-lg p-6 animate-fade-up shadow-2xl shadow-black/40 border border-white/10 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center">
                <Plus size={16} className="text-white" />
              </div>
              <h2
                id="create-task-title"
                className="text-base font-semibold text-[#F8FAFC]"
              >
                {taskToEdit ? "Edit Task" : "Create New Task"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-[#475569] hover:text-[#F8FAFC] hover:bg-white/5 rounded-xl transition-all duration-200 cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="task-title"
                className="block text-xs font-medium text-[#94A3B8] mb-1.5"
              >
                Task title <span className="text-red-400">*</span>
              </label>
              <input
                id="task-title"
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                onFocus={() => setFocusedField("title")}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g. Implement user authentication module"
                className={`${inputBase("title")} px-3.5 py-2.5`}
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="task-desc"
                  className="flex items-center gap-1.5 text-xs font-medium text-[#94A3B8]"
                >
                  <AlignLeft size={12} />
                  Description
                </label>
                <button
                  type="button"
                  onClick={handleGenerateWithAI}
                  disabled={!form.title.trim() || generating}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[#A78BFA] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-lg hover:bg-[#7C3AED]/20 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <Loader2 size={11} className="animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Sparkles size={11} />
                      Generate with AI
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="task-desc"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                onFocus={() => setFocusedField("desc")}
                onBlur={() => setFocusedField(null)}
                placeholder="Describe your task, or use AI to generate a detailed breakdown…"
                rows={4}
                className={`${inputBase("desc")} px-3.5 py-2.5 resize-none`}
              />
            </div>

            {/* Priority + Due date row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Priority */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-[#94A3B8] mb-1.5">
                  <Flag size={12} />
                  Priority
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => update("priority", p.value)}
                      className={`px-2.5 py-1 text-xs font-medium border rounded-lg cursor-pointer transition-all duration-150 ${
                        form.priority === p.value
                          ? p.color
                          : "text-[#64748B] border-white/10 bg-transparent hover:border-white/20"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due date */}
              <div>
                <label
                  htmlFor="task-due"
                  className="flex items-center gap-1.5 text-xs font-medium text-[#94A3B8] mb-1.5"
                >
                  <Calendar size={12} />
                  Due date
                </label>
                <input
                  id="task-due"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => update("dueDate", e.target.value)}
                  onFocus={() => setFocusedField("date")}
                  onBlur={() => setFocusedField(null)}
                  className={`${inputBase("date")} px-3 py-2 [color-scheme:dark]`}
                />
              </div>
            </div>

            {/* Assign to */}
            <div>
              <label
                htmlFor="task-assignee"
                className="flex items-center gap-1.5 text-xs font-medium text-[#94A3B8] mb-1.5"
              >
                <UserCircle2 size={12} />
                Assign to
              </label>
              <select
                id="task-assignee"
                value={form.assignedTo}
                onChange={(e) => update("assignedTo", e.target.value)}
                onFocus={() => setFocusedField("assignee")}
                onBlur={() => setFocusedField(null)}
                className={`${inputBase("assignee")} px-3 py-2.5 cursor-pointer`}
              >
                <option value="">Unassigned</option>
                {activeMembers
                  .filter((m) => m.user.id !== null)
                  .map((m) => (
                    <option key={m.user.id!} value={m.user.id!}>
                      {m.user.name} ({m.role})
                    </option>
                  ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[#94A3B8] mb-1.5">
                <Tag size={12} />
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TAGS_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-xs font-medium border rounded-full cursor-pointer transition-all duration-150 ${
                      form.tags.includes(tag)
                        ? "text-[#A78BFA] border-[#7C3AED]/40 bg-[#7C3AED]/10"
                        : "text-[#64748B] border-white/10 hover:border-white/20"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="create-task-submit"
              type="button"
              onClick={handleSave}
              disabled={!form.title.trim() || saving}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white gradient-bg rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200 shadow-md shadow-violet-700/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  {taskToEdit ? "Saving…" : "Creating…"}
                </>
              ) : (
                <>
                  {taskToEdit ? <Sparkles size={14} /> : <Plus size={14} />}
                  {taskToEdit ? "Save Changes" : "Create Task"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
