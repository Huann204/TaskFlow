"use client";

import { useState } from "react";
import { X, UserPlus, Loader2, Mail, Shield } from "lucide-react";
import { useInviteMember } from "@/hooks/useTeam";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useToast } from "@/hooks/useToast";
import type { TeamRole } from "@/types";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLES: { value: TeamRole; label: string; desc: string }[] = [
  { value: "admin", label: "Admin", desc: "Full access — can invite & remove" },
  { value: "member", label: "Member", desc: "Can create and manage tasks" },
  { value: "viewer", label: "Viewer", desc: "Read-only access" },
];

export default function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("member");
  const [error, setError] = useState("");

  const { activeWorkspaceId } = useWorkspace();
  const invite = useInviteMember(activeWorkspaceId);
  const toast = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) return;

    try {
      await invite.mutateAsync({ email: email.trim(), role });
      toast.success(`Invitation sent to ${email.trim()}!`);
      setEmail("");
      setRole("member");
      onClose();
    } catch (err: any) {
      const message = err.message || "Failed to invite member";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="glass-card w-full max-w-md p-6 shadow-2xl shadow-black/40 border border-white/10 animate-fade-up">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center">
                <UserPlus size={15} className="text-white" />
              </div>
              <h2 id="invite-modal-title" className="text-base font-semibold text-[#F8FAFC]">
                Invite Team Member
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-[#475569] hover:text-[#F8FAFC] hover:bg-white/5 rounded-xl transition-all duration-200 cursor-pointer"
              aria-label="Close invite modal"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="invite-email" className="flex items-center gap-1.5 text-xs font-medium text-[#94A3B8] mb-1.5">
                <Mail size={12} />
                Email address
              </label>
              <input
                id="invite-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#7C3AED]/60 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.12)] rounded-xl text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition-all duration-200 px-3.5 py-2.5"
              />
            </div>

            {/* Role */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[#94A3B8] mb-2">
                <Shield size={12} />
                Role
              </label>
              <div className="space-y-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                      role === r.value
                        ? "border-[#7C3AED]/40 bg-[#7C3AED]/10"
                        : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                    }`}
                  >
                    <p className={`text-sm font-medium ${role === r.value ? "text-[#A78BFA]" : "text-[#F8FAFC]"}`}>
                      {r.label}
                    </p>
                    <p className="text-xs text-[#64748B] mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="invite-submit-btn"
                type="submit"
                disabled={!email.trim() || invite.isPending}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white gradient-bg rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200 shadow-md shadow-violet-700/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {invite.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Inviting…
                  </>
                ) : (
                  <>
                    <UserPlus size={14} />
                    Send Invite
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
