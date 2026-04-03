"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, ChevronDown, Zap, Settings, LogOut, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, removeAuthToken } from "@/lib/api";

export default function TopHeader() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => apiRequest('/auth/me'),
  });

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

      {/* Right controls */}
      <div className="flex items-center gap-3 ml-4">
        {/* Notifications */}
        <button
          className="relative w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-[#F8FAFC] hover:bg-white/5 rounded-xl transition-all duration-200 cursor-pointer"
          aria-label="View notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7C3AED] rounded-full border border-[#0D0D14]" />
        </button>

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
                  <div className="text-xs font-semibold text-[#F8FAFC]">{user ? user.name : ""}</div>
                  <div className="text-[11px] text-[#475569] truncate">{user ? user.email : ""}</div>
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
    </header>
  );
}
