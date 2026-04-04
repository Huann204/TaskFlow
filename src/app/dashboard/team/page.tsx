"use client";

import { useState } from "react";
import { Users, UserPlus, Shield, RefreshCcw } from "lucide-react";
import { useTeam, useRemoveMember } from "@/hooks/useTeam";
import { useWorkspace, useDeleteWorkspace, useUpdateWorkspace } from "@/hooks/useWorkspace";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Edit2, Check, X, AlertTriangle, LogOut, Trash2 } from "lucide-react";
import MemberCard from "@/components/team/MemberCard";
import InviteModal from "@/components/team/InviteModal";
import { useToast } from "@/hooks/useToast";

function SkeletonCard() {
  return (
    <div className="glass-card p-4 flex items-center gap-4 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-white/10 rounded-lg w-32" />
        <div className="h-2.5 bg-white/5 rounded-lg w-48" />
      </div>
      <div className="h-5 w-16 bg-white/5 rounded-full" />
      <div className="h-5 w-14 bg-white/5 rounded-lg" />
    </div>
  );
}

const ROLE_STATS = {
  admin: { label: "Admins", color: "text-[#A78BFA]", bg: "bg-[#7C3AED]/10" },
  member: { label: "Members", color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10" },
  viewer: { label: "Viewers", color: "text-[#64748B]", bg: "bg-white/5" },
};

export default function TeamPage() {
  const { activeWorkspaceId, activeWorkspace } = useWorkspace();
  const { data: team, isLoading, isError, refetch } = useTeam(activeWorkspaceId);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");

  const toast = useToast();
  const updateWorkspaceMutation = useUpdateWorkspace();
  const deleteTeamMutation = useDeleteWorkspace();
  const removeMemberMutation = useRemoveMember(activeWorkspaceId);

  const handleRenameTeam = () => {
    if (editName.trim() && editName !== team?.name && activeWorkspaceId) {
      updateWorkspaceMutation.mutate(
        { id: activeWorkspaceId, data: { name: editName.trim() } },
        {
          onSuccess: () => {
            toast.success(`Workspace renamed to "${editName.trim()}"`);
            setIsEditingName(false);
          },
          onError: () => toast.error("Failed to rename workspace. Please try again."),
        }
      );
    } else {
      setIsEditingName(false);
    }
  };

  const { data: me } = useQuery({
    queryKey: ["user"],
    queryFn: () => apiRequest("/auth/me"),
  });

  const isPersonalWorkspace = activeWorkspace?.type === "personal";
  const isOwner = team?.owner === me?.id;
  const isAdmin = team?.myRole === "admin" && !isPersonalWorkspace;
  const canDelete = team?.myRole === "admin";
  const activeCount =
    team?.members?.filter((m) => m.status === "active").length ?? 0;
  const pendingCount =
    team?.members?.filter((m) => m.status === "pending").length ?? 0;

  if (!isLoading && !team && activeWorkspaceId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <AlertTriangle size={32} className="text-amber-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Workspace Not Found</h2>
        <p className="text-sm text-[#94A3B8] max-w-xs mx-auto mb-6">
          The workspace you're looking for doesn't exist or you don't have access to it anymore.
        </p>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold text-white transition-all shadow-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!activeWorkspaceId) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Users size={32} className="text-[#7C3AED]" />
        </div>
        <h2 className="text-xl font-bold text-white mb-4">No Workspace Selected</h2>
        <p className="text-sm text-[#94A3B8] max-w-xs mx-auto mb-6">
          Please select a workspace from the top menu to view team settings.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl  mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1 group">
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center">
              <Users size={15} className="text-white" />
            </div>
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-[#7C3AED]/50"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleRenameTeam()}
                  disabled={updateWorkspaceMutation.isPending}
                />
                <div className="flex items-center gap-1">
                  <button onClick={handleRenameTeam} disabled={updateWorkspaceMutation.isPending} className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                    <Check size={14} />
                  </button>
                  <button onClick={() => setIsEditingName(false)} disabled={updateWorkspaceMutation.isPending} className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-[#F8FAFC]">
                  {team?.name || (isPersonalWorkspace ? "Workspace Settings" : "Team")}
                </h1>
                {isOwner && (
                  <button
                    onClick={() => {
                      setEditName(team?.name || "");
                      setIsEditingName(true);
                    }}
                    className="p-1.5 text-[#64748B] hover:text-[#F8FAFC] opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-white/5"
                    title="Rename Workspace"
                  >
                    <Edit2 size={14} />
                  </button>
                )}
              </>
            )}
          </div>
          <p className="text-sm text-[#64748B]">
            {isPersonalWorkspace 
              ? "Manage your workspace settings and preferences."
              : "Manage your workspace members, roles and permissions."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="w-9 h-9 flex items-center justify-center text-[#475569] hover:text-[#F8FAFC] glass-card border-white/10 rounded-xl transition-all duration-200 cursor-pointer"
            aria-label="Refresh"
          >
            <RefreshCcw size={14} />
          </button>
          {isAdmin && (
            <button
              id="invite-member-btn"
              onClick={() => setInviteOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white gradient-bg rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200 shadow-md shadow-violet-700/20"
            >
              <UserPlus size={14} />
              Invite Member
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      {team && !isPersonalWorkspace && (
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Members",
              value: team.members.length,
              color: "text-[#F8FAFC]",
              bg: "bg-white/5",
            },
            {
              label: "Active",
              value: activeCount,
              color: "text-emerald-400",
              bg: "bg-emerald-400/5",
            },
            {
              label: "Pending",
              value: pendingCount,
              color: "text-amber-400",
              bg: "bg-amber-400/5",
            },
          ].map((stat) => (
            <div key={stat.label} className={`glass-card p-4 ${stat.bg}`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-[#64748B] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Role distribution */}
      {team && !isPersonalWorkspace && (
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={13} className="text-[#64748B]" />
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Role Distribution
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {(["admin", "member", "viewer"] as const).map((role) => {
              const count = team.members.filter((m) => m.role === role).length;
              const cfg = ROLE_STATS[role];
              return (
                <div
                  key={role}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${cfg.bg}`}
                >
                  <span className={`text-sm font-bold ${cfg.color}`}>
                    {count}
                  </span>
                  <span className="text-xs text-[#64748B]">{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Members list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#F8FAFC]">Members</h2>
          {team && (
            <span className="text-xs text-[#475569]">
              {team.members.length} total
            </span>
          )}
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {isError && (
          <div className="glass-card p-6 text-center">
            <p className="text-sm text-red-400 mb-3">
              Failed to load team members.
            </p>
            <button
              onClick={() => refetch()}
              className="text-xs text-[#7C3AED] hover:text-[#A78BFA] transition-colors cursor-pointer"
            >
              Try again
            </button>
          </div>
        )}

        {team && team.members.length === 0 && (
          <div className="glass-card p-10 text-center">
            <Users size={32} className="text-[#475569] mx-auto mb-3" />
            <p className="text-sm text-[#64748B]">
              No members yet. Invite your first teammate!
            </p>
          </div>
        )}

        {team && team.members.length > 0 && (
          <div className="space-y-2">
            {/* Active members first */}
            {team.members
              .slice()
              .sort((a, b) => {
                if (a.status === "active" && b.status !== "active") return -1;
                if (a.status !== "active" && b.status === "active") return 1;
                return 0;
              })
              .map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  isMe={me && member.user.id === me.id}
                  isOwner={team.owner === member.user.id}
                  canManage={isAdmin}
                />
              ))}
          </div>
        )}
      </div>

      {/* Role permission legend */}
      {!isPersonalWorkspace && (
         <div className="glass-card p-4 border-[#7C3AED]/10">
           <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">
             Permission Guide
           </p>
           <div className="space-y-2">
             {[
               {
                 role: "Admin",
                 perms:
                   "Invite members, remove members, change roles, manage all tasks",
               },
               {
                 role: "Member",
                 perms: "Create, edit and delete own tasks; view team tasks",
               },
               {
                 role: "Viewer",
                 perms: "Read-only access to all tasks and team info",
               },
             ].map((row) => (
               <div key={row.role} className="flex items-start gap-3 text-xs">
                 <span className="font-semibold text-[#94A3B8] w-14 flex-shrink-0">
                   {row.role}
                 </span>
                 <span className="text-[#475569]">{row.perms}</span>
               </div>
             ))}
           </div>
         </div>
      )}

      {/* Danger Zone */}
      {(canDelete || !isPersonalWorkspace) && team && me && (
        <div className="glass-card p-4 border-red-500/20 mt-8">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-red-400" />
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              Danger Zone
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
            {canDelete ? (
               <div>
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">Delete Workspace</h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">Permanently remove this workspace and all its data. This action cannot be undone.</p>
               </div>
            ) : (
               <div>
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">Leave Workspace</h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">Remove yourself from this workspace. You will lose access immediately.</p>
               </div>
            )}
            
            <button
               disabled={deleteTeamMutation.isPending || removeMemberMutation.isPending}
               onClick={() => {
                  if (canDelete) {
                     if (confirm("Are you entirely sure you want to permanently delete this workspace?")) {
                        deleteTeamMutation.mutate(team.id, {
                          onSuccess: () => toast.success("Workspace deleted successfully."),
                          onError: () => toast.error("Failed to delete workspace. Please try again."),
                        });
                     }
                  } else {
                     if (confirm("Are you sure you want to leave this workspace?")) {
                        const myMember = team.members.find(m => m.user?.id === me.id);
                        if (myMember) {
                           removeMemberMutation.mutate(myMember.id, {
                             onSuccess: () => toast.info("You have left the workspace."),
                             onError: () => toast.error("Failed to leave workspace. Please try again."),
                           });
                        }
                     }
                  }
               }}
               className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl transition-all disabled:opacity-50"
            >
               {canDelete ? <Trash2 size={14} /> : <LogOut size={14} />}
               {canDelete ? "Delete Workspace" : "Leave Workspace"}
            </button>
          </div>
        </div>
      )}

      <InviteModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
