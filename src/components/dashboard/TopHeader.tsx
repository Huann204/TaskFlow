"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  ChevronDown,
  Zap,
  Settings,
  LogOut,
  User,
  Briefcase,
  Layers,
  Sparkles,
  Check,
  X
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, removeAuthToken } from "@/lib/api";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useInvitations, useAcceptInvitation, useDeclineInvitation } from "@/hooks/useTeam";
import CreateWorkspaceModal from "./CreateWorkspaceModal";

export default function TopHeader() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => apiRequest("/auth/me"),
  });

  const { workspaces, activeWorkspace, setWorkspace } = useWorkspace();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { data: invitations } = useInvitations();
  const acceptInviteMutation = useAcceptInvitation();
  const declineInviteMutation = useDeclineInvitation();

  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.06] bg-[#0D0D14]/80 backdrop-blur-md flex-shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div
          className={`flex items-center gap-2.5 px-3.5 py-2 bg-white/5 border rounded-xl transition-all duration-200 ${
            searchFocused
              ? "border-[#7C3AED]/40 shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"
              : "border-white/10"
          }`}
        >
          <Search
            size={15}
            className={`flex-shrink-0 transition-colors duration-200 ${
              searchFocused ? "text-[#A78BFA]" : "text-[#475569]"
            }`}
          />
          <input
            id="dashboard-search"
            type="text"
            placeholder="Search tasks, projects…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent text-sm text-[#F8FAFC] placeholder-[#475569] outline-none w-full"
          />
          <kbd className="text-[10px] text-[#475569] bg-white/5 px-1.5 py-0.5 rounded font-mono hidden sm:block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Workspace Switcher */}
      <div className="flex items-center mx-4 relative z-50">
         <button
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
         >
           {activeWorkspace?.type === 'personal' ? <User size={14} className="text-[#A78BFA]"/> : <Briefcase size={14} className="text-[#3B82F6]"/>}
           <span className="text-sm font-medium text-[#F8FAFC]">
             {activeWorkspace?.name || "Loading..."}
           </span>
           <ChevronDown size={14} className={`text-[#475569] transition-transform ${workspaceMenuOpen ? "rotate-180" : ""}`} />
         </button>

         {workspaceMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setWorkspaceMenuOpen(false)}
              />
              <div className="absolute left-0 top-full mt-2 w-56 glass-card border border-white/10 py-1.5 z-20 shadow-2xl shadow-black/40">
                <div className="px-3 py-1.5 mb-1 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Workspaces
                </div>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => { setWorkspace(ws.id); setWorkspaceMenuOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-all duration-150 cursor-pointer ${
                      activeWorkspace?.id === ws.id ? "bg-[#7C3AED]/20 text-[#F8FAFC]" : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
                    }`}
                  >
                    {ws.type === 'personal' ? <User size={14} /> : <Briefcase size={14} />}
                    <span className="truncate">{ws.name}</span>
                  </button>
                ))}
                <div className="border-t border-white/5 my-1"></div>
                <button
                   onClick={() => { setCreateWorkspaceOpen(true); setWorkspaceMenuOpen(false); }}
                   className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-all duration-150 cursor-pointer"
                >
                   <div className="w-5 flex justify-center"><Sparkles size={14} className="text-[#3B82F6]" /></div>
                   <span className="font-semibold text-[#3B82F6]">Create Workspace</span>
                </button>
              </div>
            </>
         )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-[#F8FAFC] hover:bg-white/5 rounded-xl transition-all duration-200 cursor-pointer"
            aria-label="View notifications"
          >
            <Bell size={18} />
            {invitations && invitations.length > 0 && (
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7C3AED] rounded-full border border-[#0D0D14]" />
            )}
           </button>
           
           {notificationsOpen && (
              <>
                 <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)} />
                 <div className="absolute right-0 top-full mt-2 w-72 glass-card border flex flex-col border-white/10 py-2 z-20 shadow-2xl shadow-black/40">
                    <div className="px-4 py-2 border-b border-white/10 mb-2">
                       <h3 className="font-bold text-[#F8FAFC] text-sm">Notifications</h3>
                    </div>
                    {invitations && invitations.length > 0 ? (
                       <div className="max-h-[300px] overflow-y-auto">
                          {invitations.map((inv: any) => (
                             <div key={inv.teamId} className="px-4 py-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                <p className="text-xs text-[#E2E8F0] mb-2 leading-relaxed">
                                   <span className="font-semibold">{inv.ownerName}</span> invited you to join <span className="font-semibold text-white">{inv.teamName}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                   <button 
                                      onClick={() => acceptInviteMutation.mutate(inv.teamId)}
                                      disabled={acceptInviteMutation.isPending}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-all"
                                   >
                                      <Check size={12} /> Accept
                                   </button>
                                   <button 
                                      onClick={() => declineInviteMutation.mutate(inv.teamId)}
                                      disabled={declineInviteMutation.isPending}
                                      className="flex-1 flex items-center justify-center py-1.5 bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white rounded-lg text-xs font-semibold transition-all"
                                   >
                                      Decline
                                   </button>
                                </div>
                             </div>
                          ))}
                       </div>
                    ) : (
                       <div className="px-4 py-6 text-center text-xs text-[#64748B]">
                          You have no new notifications.
                       </div>
                    )}
                 </div>
              </>
           )}
        </div>

        {/* Upgrade badge */}
        <Link
          href="#"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#A78BFA] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-lg hover:bg-[#7C3AED]/20 transition-all duration-200 cursor-pointer"
        >
          <Zap size={12} />
          Pro Plan
        </Link>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 cursor-pointer group"
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
          >
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-xs font-bold text-white ring-2 ring-[#7C3AED]/20 group-hover:ring-[#7C3AED]/40 transition-all duration-200">
              {user ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-[#F8FAFC] leading-none mb-0.5">
                {user ? user.name : "Loading..."}
              </div>
              <div className="text-[10px] text-[#475569] leading-none">
                {user ? user.email : ""}
              </div>
            </div>
            <ChevronDown
              size={14}
              className={`text-[#475569] transition-transform duration-200 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-52 glass-card border border-white/10 py-1.5 z-20 shadow-2xl shadow-black/40">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <div className="text-xs font-semibold text-[#F8FAFC]">
                    {user ? user.name : ""}
                  </div>
                  <div className="text-[11px] text-[#475569] truncate">
                    {user ? user.email : ""}
                  </div>
                </div>
                {[
                  { icon: User, label: "My Profile" },
                  { icon: Settings, label: "Settings" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-all duration-150 cursor-pointer"
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
                <div className="border-t border-white/5 mt-1 pt-1">
                  <Link
                    href="/login"
                    onClick={() => removeAuthToken()}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-150 cursor-pointer"
                  >
                    <LogOut size={14} />
                    Sign out
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Modals */}
      <CreateWorkspaceModal
        isOpen={createWorkspaceOpen}
        onClose={() => setCreateWorkspaceOpen(false)}
      />
    </header>
  );
}
