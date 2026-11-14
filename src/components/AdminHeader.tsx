"use client";

import React from "react";
import { Bell, Search, ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  currentUser?: any;
  onOpenNotifications?: () => void;
  currentViewMode?: string;
  onChangeViewMode?: (mode: "login" | "dashboard" | "rooms") => void;
}

export function AdminHeader({
  title,
  currentUser,
  currentViewMode,
  onChangeViewMode,
}: AdminHeaderProps) {
  const adminDisplayName =
    currentUser?.user_metadata?.full_name ||
    currentUser?.user_metadata?.username ||
    currentUser?.email?.split("@")[0] ||
    "Admin CITU";

  const adminEmail = currentUser?.email || "admin@citu.tu.ac.th";

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          {title}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        {/* Quick Screen Preview Switcher as requested by user's 3-panel screenshot */}
        {onChangeViewMode && (
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            <button
              onClick={() => onChangeViewMode("login")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                currentViewMode === "login"
                  ? "bg-[#7b1124] text-white shadow-sm"
                  : "hover:text-slate-900"
              }`}
            >
              1. หน้าเข้าสู่ระบบ
            </button>
            <button
              onClick={() => onChangeViewMode("dashboard")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                currentViewMode === "dashboard"
                  ? "bg-[#7b1124] text-white shadow-sm"
                  : "hover:text-slate-900"
              }`}
            >
              2. Dashboard
            </button>
            <button
              onClick={() => onChangeViewMode("rooms")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                currentViewMode === "rooms"
                  ? "bg-[#7b1124] text-white shadow-sm"
                  : "hover:text-slate-900"
              }`}
            >
              3. จัดการห้อง
            </button>
          </div>
        )}

        {/* Notification Icon */}
        <button
          className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          title="การแจ้งเตือน"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#7b1124] rounded-full ring-2 ring-white"></span>
        </button>

        {/* Admin Profile Pill */}
        <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7b1124] to-[#9b1c31] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-rose-100 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-left hidden sm:block max-w-[160px] truncate">
            <p className="text-sm font-semibold text-slate-800 leading-none truncate">
              {adminDisplayName}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 truncate" title={adminEmail}>
              {adminEmail}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
