"use client";

import { useState, useEffect } from "react";
import { Calendar, Flag, GripVertical, Plus, Edit2, Trash2, X, Lock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useTeam } from "@/hooks/useTeam";
import { useWorkspace } from "@/hooks/useWorkspace";
import { type Task, type TaskStatus, type TeamRole } from "@/types";

const COLUMNS: { id: TaskStatus; label: string; color: string; bg: string }[] = [
  { id: "todo", label: "To Do", color: "text-[#94A3B8]", bg: "bg-[#94A3B8]/10" },
  { id: "in-progress", label: "In Progress", color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10" },
  { id: "done", label: "Done", color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "text-[#64748B]", dot: "bg-[#64748B]" },
  medium: { label: "Medium", color: "text-amber-400", dot: "bg-amber-400" },
  high: { label: "High", color: "text-orange-400", dot: "bg-orange-400" },
  urgent: { label: "Urgent", color: "text-red-400", dot: "bg-red-400" },
};

const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-600",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function getAvatarGrad(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function AssigneeAvatar({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <div
      className={`rounded-full bg-gradient-to-br ${getAvatarGrad(name)} flex items-center justify-center flex-shrink-0 ring-2 ring-[#0D0D14]`}
      style={{ width: size, height: size }}
      title={name}
    >
      <span style={{ fontSize: size * 0.38 }} className="font-bold text-white leading-none">
        {getInitials(name)}
      </span>
    </div>
  );
}

function TaskCard({
  task,
  myRole,
  myId,
  onDragStart,
  onEdit,
  onDelete,
  onView,
}: {
  task: Task;
  myRole: TeamRole | undefined;
  myId: string | undefined;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onView: (task: Task) => void;
}) {
  const priority = PRIORITY_CONFIG[task.priority];
  const overdue = task.status !== "done" && task.dueDate && new Date(task.dueDate) < new Date();

  // ── RBAC: determine which actions this user can perform ──────────────────
  const isViewer = myRole === "viewer";
  const isAdmin = myRole === "admin";
  const isAssignedToMe = task.assignedTo?.id === myId;
  const iCreatedThis = task.user === myId;

  // Members: can edit if assigned to them or they created it
  const canEdit = isAdmin || (!isViewer && (isAssignedToMe || iCreatedThis));
  // Members: can delete only if they created it
  const canDelete = isAdmin || (!isViewer && iCreatedThis);

  return (
    <div
      draggable={canEdit}
      onDragStart={canEdit ? (e) => onDragStart(e, task) : undefined}
      onClick={() => onView(task)}
      className={`glass-card p-4 hover:border-white/15 hover:-translate-y-0.5 transition-all duration-200 group ${
        canEdit ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {canEdit ? (
            <GripVertical
              size={14}
              className="text-[#475569] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          ) : (
            <span title="Read-only">
              <Lock size={12} className="text-[#475569]/40 flex-shrink-0" />
            </span>
          )}
          <p className={`text-sm font-medium leading-snug ${task.status === "done" ? "line-through text-[#64748B]" : "text-[#F8FAFC]"}`}>
            {task.title}
          </p>
        </div>

        {/* Action buttons — only shown when user has permission */}
        {(canEdit || canDelete) && (
          <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
            {canEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                className="text-[#475569] hover:text-[#A78BFA] transition-colors cursor-pointer"
                aria-label="Edit task"
              >
                <Edit2 size={13} />
              </button>
            )}
            {canDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                className="text-[#475569] hover:text-red-400 transition-colors cursor-pointer"
                aria-label="Delete task"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-[#64748B] line-clamp-2 mb-3 leading-relaxed">
        {task.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-[10px] font-medium text-[#7C3AED] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        {/* Priority */}
        <div className={`flex items-center gap-1.5 text-xs font-medium ${priority.color}`}>
          <Flag size={11} />
          {priority.label}
        </div>

        <div className="flex items-center gap-2">
          {/* Assignee avatar */}
          {task.assignedTo?.name && (
            <AssigneeAvatar name={task.assignedTo.name} size={20} />
          )}

          {/* Due date */}
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${overdue ? "text-red-400" : "text-[#475569]"}`}>
              <Calendar size={11} />
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Column({
  column,
  tasks,
  myRole,
  myId,
  onDragStart,
  onDragOver,
  onDrop,
  onEdit,
  onDelete,
  onView,
}: {
  column: (typeof COLUMNS)[0];
  tasks: Task[];
  myRole: TeamRole | undefined;
  myId: string | undefined;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onView: (task: Task) => void;
}) {
  return (
    <div
      className="flex flex-col min-w-[280px] flex-1"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${column.color}`}>{column.label}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${column.bg} ${column.color}`}>
            {tasks.length}
          </span>
        </div>
        <button
          className="w-6 h-6 flex items-center justify-center text-[#475569] hover:text-[#F8FAFC] hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer"
          aria-label={`Add task to ${column.label}`}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Drop zone */}
      <div className="flex flex-col gap-3 flex-1 min-h-[200px] p-1">
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl">
            <p className="text-xs text-[#475569]">Drop tasks here</p>
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            myRole={myRole}
            myId={myId}
            onDragStart={onDragStart}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>
    </div>
  );
}

interface KanbanBoardProps {
  onCreateTask: () => void;
  onEditTask: (task: Task) => void;
  onViewTask: (task: Task) => void;
}

export default function KanbanBoard({ onCreateTask, onEditTask, onViewTask }: KanbanBoardProps) {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useWorkspace();

  const { data: serverTasks, isLoading, isError } = useQuery<Task[]>({
    queryKey: ["tasks", activeWorkspaceId],
    queryFn: () => apiRequest(`/tasks?workspaceId=${activeWorkspaceId}`),
    enabled: !!activeWorkspaceId,
  });

  const { data: team } = useTeam(activeWorkspaceId);
  const { data: me } = useQuery({
    queryKey: ["user"],
    queryFn: () => apiRequest("/auth/me"),
  });

  const myRole = team?.myRole as TeamRole | undefined;
  const isViewer = myRole === "viewer";

  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [memberFilter, setMemberFilter] = useState<string>("all");

  useEffect(() => {
    if (serverTasks) {
      setLocalTasks(serverTasks);
    }
  }, [serverTasks]);

  const [dragging, setDragging] = useState<Task | null>(null);

  const updateTaskMutation = useMutation({
    mutationFn: (updatedData: Partial<Task> & { id: string }) =>
      apiRequest(`/tasks/${updatedData.id}`, {
        method: "PATCH",
        data: updatedData,
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeWorkspaceId] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/tasks/${id}`, { method: "DELETE" }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeWorkspaceId] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(id);
    }
  };

  // ── Member filter ─────────────────────────────────────────────────────────
  // assignedTo.id is now normalized by the Task toJSON transform on backend
  const filteredTasks = localTasks.filter((t) => {
    if (memberFilter === "all") return true;
    if (memberFilter === "mine") return t.assignedTo?.id === me?.id;
    return t.assignedTo?.id === memberFilter;
  });

  const tasksByStatus = (status: TaskStatus) =>
    filteredTasks.filter((t) => t.status === status);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDragging(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (!dragging || dragging.status === status || isViewer) return;

    setLocalTasks((prev) =>
      prev.map((t) => (t.id === dragging.id ? { ...t, status } : t))
    );

    updateTaskMutation.mutate({ id: dragging.id, status });
    setDragging(null);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-[#94A3B8]">Loading tasks...</div>;
  }

  if (isError) {
    return <div className="p-8 text-center text-red-500">Failed to load tasks.</div>;
  }

  const activeMembers = team?.members.filter((m) => m.status === "active" && m.user.id) ?? [];

  return (
    <div>
      {/* Board header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-[#F8FAFC]">Task Board</h2>
          {isViewer && (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#475569]/10 border border-[#475569]/20 text-[#64748B]">
              <Lock size={9} />
              View only
            </span>
          )}
        </div>
        {/* Hide "New Task" for viewers */}
        {!isViewer && (
          <button
            onClick={onCreateTask}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white gradient-bg rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200 shadow-md shadow-violet-700/20"
          >
            <Plus size={15} />
            New Task
          </button>
        )}
      </div>

      {/* Member filter bar */}
      {activeMembers.length > 0 && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          <span className="text-xs text-[#475569] flex-shrink-0">Filter:</span>
          <button
            onClick={() => setMemberFilter("all")}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
              memberFilter === "all"
                ? "bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30"
                : "bg-white/5 text-[#64748B] border border-white/10 hover:border-white/20"
            }`}
          >
            All tasks
          </button>
          <button
            onClick={() => setMemberFilter("mine")}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
              memberFilter === "mine"
                ? "bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30"
                : "bg-white/5 text-[#64748B] border border-white/10 hover:border-white/20"
            }`}
          >
            My tasks
          </button>
          {activeMembers.map((m) => (
            <button
              key={m.user.id}
              onClick={() => setMemberFilter(m.user.id!)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                memberFilter === m.user.id
                  ? "bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30"
                  : "bg-white/5 text-[#64748B] border border-white/10 hover:border-white/20"
              }`}
            >
              <AssigneeAvatar name={m.user.name} size={16} />
              {m.user.name.split(" ")[0]}
            </button>
          ))}
          {memberFilter !== "all" && (
            <button
              onClick={() => setMemberFilter("all")}
              className="flex-shrink-0 flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-[#475569] hover:text-[#F8FAFC] transition-colors cursor-pointer"
            >
              <X size={11} />
              Clear
            </button>
          )}
        </div>
      )}

      <div className="flex gap-5 overflow-x-auto pb-2 -mx-0.5 px-0.5">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={tasksByStatus(col.id)}
            myRole={myRole}
            myId={me?.id}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onEdit={onEditTask}
            onDelete={handleDelete}
            onView={onViewTask}
          />
        ))}
      </div>
    </div>
  );
}
