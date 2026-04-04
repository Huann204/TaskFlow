"use client";

import { useState } from "react";
import { MoreHorizontal, Trash2, ChevronDown, Clock, CheckCircle2 } from "lucide-react";
import { useUpdateMember, useRemoveMember } from "@/hooks/useTeam";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { TeamMember, TeamRole } from "@/types";

const ROLE_CONFIG: Record<TeamRole, { label: string; color: string; bg: string }> = {
  admin: { label: "Admin", color: "text-[#A78BFA]", bg: "bg-[#7C3AED]/15 border-[#7C3AED]/25" },
  member: { label: "Member", color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10 border-[#3B82F6]/20" },
  viewer: { label: "Viewer", color: "text-[#64748B]", bg: "bg-white/5 border-white/10" },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-amber-600",
    "from-rose-500 to-pink-600",
    "from-indigo-500 to-blue-600",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

interface MemberCardProps {
  member: TeamMember;
  isMe: boolean;
  isOwner: boolean;
  canManage: boolean;
}

export default function MemberCard({ member, isMe, isOwner, canManage }: MemberCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const { activeWorkspaceId } = useWorkspace();
  const updateMember = useUpdateMember(activeWorkspaceId);
  const removeMember = useRemoveMember(activeWorkspaceId);

  const roleConfig = ROLE_CONFIG[member.role];
  const initials = getInitials(member.user.name);
  const avatarGrad = getAvatarColor(member.user.name);

  const handleRoleChange = (role: TeamRole) => {
    updateMember.mutate({ memberId: member.id, role });
    setRoleMenuOpen(false);
    setMenuOpen(false);
  };

  const handleRemove = () => {
    if (confirm(`Remove ${member.user.name} from the team?`)) {
      removeMember.mutate(member.id);
    }
    setMenuOpen(false);
  };

  const handleActivate = () => {
    updateMember.mutate({ memberId: member.id, status: "active" });
    setMenuOpen(false);
  };

  return (
    <div className="glass-card p-4 flex items-center gap-4 hover:border-white/15 transition-all duration-200 group">
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center flex-shrink-0 shadow-lg`}>
        <span className="text-sm font-bold text-white">{initials}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#F8FAFC] truncate">
            {member.user.name}
            {isMe && <span className="ml-1.5 text-xs text-[#7C3AED]">(you)</span>}
          </p>
          {isOwner && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-400 font-medium">
              Owner
            </span>
          )}
        </div>
        <p className="text-xs text-[#64748B] truncate">{member.user.email}</p>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {member.status === "pending" ? (
          <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 font-medium">
            <Clock size={9} />
            Pending
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 font-medium">
            <CheckCircle2 size={9} />
            Active
          </span>
        )}
      </div>

      {/* Role badge */}
      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border flex-shrink-0 ${roleConfig.color} ${roleConfig.bg}`}>
        {roleConfig.label}
      </span>

      {/* Actions (admin only) */}
      {canManage && !isMe && (
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 flex items-center justify-center text-[#475569] hover:text-[#F8FAFC] hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Member actions"
          >
            <MoreHorizontal size={15} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => { setMenuOpen(false); setRoleMenuOpen(false); }} />
              <div className="absolute right-0 top-8 z-20 w-44 glass-card border border-white/10 shadow-xl shadow-black/40 overflow-hidden">
                {/* Change Role */}
                <div className="relative">
                  <button
                    onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    Change role
                    <ChevronDown size={12} className={`transition-transform ${roleMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  {roleMenuOpen && (
                    <div className="border-t border-white/5">
                      {(["admin", "member", "viewer"] as TeamRole[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => handleRoleChange(r)}
                          className={`w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer ${
                            member.role === r
                              ? "text-[#A78BFA] bg-[#7C3AED]/10"
                              : "text-[#64748B] hover:text-[#F8FAFC] hover:bg-white/5"
                          }`}
                        >
                          {ROLE_CONFIG[r].label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Activate if pending */}
                {member.status === "pending" && (
                  <button
                    onClick={handleActivate}
                    className="w-full text-left px-3 py-2.5 text-xs font-medium text-emerald-400 hover:bg-emerald-400/5 transition-colors cursor-pointer border-t border-white/5"
                  >
                    Mark as active
                  </button>
                )}

                {/* Remove */}
                <button
                  onClick={handleRemove}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-red-400 hover:bg-red-400/5 transition-colors cursor-pointer border-t border-white/5"
                >
                  <Trash2 size={12} />
                  Remove member
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
