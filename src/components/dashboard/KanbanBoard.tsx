"use client";

import { useState, useEffect } from "react";
import { Calendar, Flag, GripVertical, Plus, Edit2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { type Task, type TaskStatus } from "@/types";

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

function TaskCard({
  task,
  onDragStart,
  onEdit,
  onDelete,
  onView
}: {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onView: (task: Task) => void;
}) {
  const priority = PRIORITY_CONFIG[task.priority];
  const overdue =
    task.status !== "done" && new Date(task.dueDate) < new Date();

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={() => onView(task)}
      className="glass-card p-4 cursor-grab active:cursor-grabbing hover:border-white/15 hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <GripVertical
            size={14}
            className="text-[#475569] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <p className={`text-sm font-medium leading-snug ${task.status === "done" ? "line-through text-[#64748B]" : "text-[#F8FAFC]"}`}>
            {task.title}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="text-[#475569] hover:text-[#A78BFA] transition-colors cursor-pointer" aria-label="Edit task">
            <Edit2 size={13} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="text-[#475569] hover:text-red-400 transition-colors cursor-pointer" aria-label="Delete task">
            <Trash2 size={13} />
          </button>
        </div>
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

        {/* Due date */}
        <div
          className={`flex items-center gap-1 text-xs ${overdue ? "text-red-400" : "text-[#475569]"}`}
        >
          <Calendar size={11} />
          {new Date(task.dueDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}

function Column({
  column,
  tasks,
  onDragStart,
  onDragOver,
  onDrop,
  onEdit,
  onDelete,
  onView
}: {
  column: (typeof COLUMNS)[0];
  tasks: Task[];
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
          <span className={`text-sm font-semibold ${column.color}`}>
            {column.label}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${column.bg} ${column.color}`}
          >
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
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} onEdit={onEdit} onDelete={onDelete} onView={onView} />
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

  const { data: serverTasks, isLoading, isError } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => apiRequest('/tasks'),
  });

  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  useEffect(() => {
    if (serverTasks) {
      setLocalTasks(serverTasks);
    }
  }, [serverTasks]);

  const [dragging, setDragging] = useState<Task | null>(null);

  const updateTaskMutation = useMutation({
    mutationFn: (updatedData: Partial<Task> & { id: string }) =>
      apiRequest(`/tasks/${updatedData.id}`, {
        method: 'PATCH',
        data: updatedData,
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/tasks/${id}`, {
        method: 'DELETE'
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(id);
    }
  };

  const tasksByStatus = (status: TaskStatus) =>
    localTasks.filter((t) => t.status === status);

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
    if (!dragging || dragging.status === status) return;

    // Optimistic update
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

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-[#F8FAFC]">Task Board</h2>
        <button
          onClick={onCreateTask}
          className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white gradient-bg rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200 shadow-md shadow-violet-700/20"
        >
          <Plus size={15} />
          New Task
        </button>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-2 -mx-0.5 px-0.5">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={tasksByStatus(col.id)}
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
