"use client";

import { useState } from "react";
import { X, Briefcase, User, Sparkles, Plus } from "lucide-react";
import { useCreateWorkspace, useWorkspace } from "@/hooks/useWorkspace";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateWorkspaceModal({
  isOpen,
  onClose,
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"personal" | "team">("personal");
  const { setWorkspace } = useWorkspace();
  const createMutation = useCreateWorkspace();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createMutation.mutate(
      { name: name.trim(), type },
      {
        onSuccess: (newWorkspace) => {
          if (newWorkspace?.id) {
            setWorkspace(newWorkspace.id);
          }
          setName("");
          setType("personal");
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:pt-[15vh]">
      <div 
        className="absolute inset-0 bg-[#050505]/60 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm bg-[#111118]/80 backdrop-blur-2xl border border-white/10 p-7 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-[#F8FAFC]">New Workspace</h2>
            <p className="text-sm text-[#94A3B8] mt-1.5">Add a new workspace to organize your tasks.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-[#64748B] hover:text-[#F8FAFC] transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Workspace Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Side Hustle, Design Work..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-[#7C3AED]/50 transition-all shadow-inner"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Workspace Type</label>
            <div className="grid grid-cols-2 gap-4">
               <button
                  type="button"
                  onClick={() => setType("personal")}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${type === 'personal' ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-white shadow-lg shadow-[#7C3AED]/5' : 'border-white/5 bg-white/[0.02] text-[#64748B] hover:text-[#94A3B8] hover:border-white/10'}`}
               >
                  <User size={20} className={type === 'personal' ? 'text-[#A78BFA] mb-2' : 'mb-2'} />
                  <span className="text-xs font-bold">Personal</span>
               </button>
               <button
                  type="button"
                  onClick={() => setType("team")}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${type === 'team' ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-white shadow-lg shadow-[#3B82F6]/5' : 'border-white/5 bg-white/[0.02] text-[#64748B] hover:text-[#94A3B8] hover:border-white/10'}`}
               >
                  <Briefcase size={20} className={type === 'team' ? 'text-[#3B82F6] mb-2' : 'mb-2'} />
                  <span className="text-xs font-bold">Team Group</span>
               </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || createMutation.isPending}
            className="w-full mt-2 h-12 flex justify-center items-center rounded-xl font-bold text-sm text-white gradient-bg hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-black/20"
          >
            {createMutation.isPending ? "Creating Space..." : "Create Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}
