"use client";

import React from "react";
import {
  Home,
  DoorOpen,
  CalendarDays,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

export type NavTab = "dashboard" | "rooms" | "bookings" | "users" | "reports" | "settings";

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onLogout: () => void;
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  onLogout,
}: SidebarProps) {
  const navItems = [
    { key: "dashboard" as NavTab, label: "หน้าหลัก", icon: Home },
    { key: "rooms" as NavTab, label: "จัดการห้อง", icon: DoorOpen },
    { key: "bookings" as NavTab, label: "การจัดการจอง", icon: CalendarDays },
    { key: "users" as NavTab, label: "ผู้ใช้", icon: Users },
    { key: "reports" as NavTab, label: "รายงาน", icon: BarChart3 },
    { key: "settings" as NavTab, label: "ตั้งค่า", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#7b1124] text-white flex flex-col justify-between shrink-0 min-h-screen shadow-xl select-none">
      <div>
        {/* Brand Header */}
        <div className="pt-8 pb-6 px-6 text-center border-b border-rose-900/30">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-2xl bg-white/10 text-white backdrop-blur-sm border border-white/20">
            {/* Outline Pavilion Icon */}
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 10.5L12 3l9 7.5v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
              <path d="M9 21V12h6v9" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-wider uppercase text-white font-serif">
            CITU MATE
          </h1>
          <p className="text-[11px] tracking-widest text-rose-200/80 font-medium uppercase mt-0.5">
            ADMIN PANEL
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-6 pr-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelectTab(item.key)}
                className={`w-full flex items-center justify-between px-5 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[#7b1124] rounded-r-2xl shadow-md font-semibold translate-x-1"
                    : "text-rose-100/90 hover:bg-white/10 hover:text-white rounded-r-xl"
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-[#7b1124]" : "text-rose-200"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isActive
                      ? "text-[#7b1124] opacity-100"
                      : "text-rose-300/40 opacity-0 group-hover:opacity-100"
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-rose-900/30">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-rose-200 hover:text-white hover:bg-rose-900/50 rounded-xl transition"
        >
          <LogOut className="w-4 h-4" />
          <span>ออกจากระบบ</span>
        </button>
        <p className="text-[10px] text-center text-rose-300/40 mt-3">
          College of Innovation © 2026
        </p>
      </div>
    </aside>
  );
}
