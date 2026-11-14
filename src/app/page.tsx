"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar, NavTab } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { LoginView } from "@/components/views/LoginView";
import { DashboardView } from "@/components/views/DashboardView";
import { RoomsView } from "@/components/views/RoomsView";
import { BookingsView } from "@/components/views/BookingsView";
import { UsersView } from "@/components/views/UsersView";
import { SettingsView } from "@/components/views/SettingsView";
import { BookingDetailModal } from "@/components/BookingDetailModal";
import {
  INITIAL_ROOMS,
  INITIAL_BOOKINGS,
  HOURLY_STATS,
} from "@/lib/data";
import { Room, Booking } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export default function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [previewMode, setPreviewMode] = useState<"login" | "dashboard" | "rooms">("dashboard");

  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Fetch real bookings from Supabase if available
  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: Booking[] = data.map((r: any) => ({
            id: r.id,
            roomId: r.room_id || "301",
            roomName: r.room_name || "CITU Study Room",
            roomType: "ห้องศึกษาค้นคว้า",
            dateKey: r.date_key || "2026-11-14",
            dateLabel: r.date_label || "14 พ.ย. 2569",
            slot: r.slot || "09:00 - 12:00",
            attendees: r.attendees || 4,
            purpose: r.purpose || "การศึกษาค้นคว้า",
            studentName: "นักศึกษา CITU",
            studentId: r.user_id ? r.user_id.slice(0, 10) : "6509650001",
            studentEmail: "student@citu.tu.ac.th",
            status: r.status === "cancelled" ? "rejected" : (r.status || "pending"),
            createdAt: r.created_at || new Date().toISOString(),
          }));
          setBookings(mapped);
        }
      } catch (e) {
        console.log("Using initial data fallback", e);
      }
    }
    loadData();
  }, []);

  // Handlers
  const handleApprove = async (id: number) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "approved" } : b))
    );
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: "approved" } : null));
    }

    try {
      await supabase.from("bookings").update({ status: "approved" }).eq("id", id);
    } catch (e) {
      console.log("Supabase update error", e);
    }
  };

  const handleReject = async (id: number) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "rejected" } : b))
    );
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: "rejected" } : null));
    }

    try {
      await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    } catch (e) {
      console.log("Supabase update error", e);
    }
  };

  const handleAddRoom = (newRoom: Omit<Room, "id">) => {
    const id = Date.now().toString().slice(-3);
    setRooms([
      {
        id,
        ...newRoom,
      },
      ...rooms,
    ]);
  };

  const handleToggleRoomStatus = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? { ...r, status: r.status === "open" ? "maintenance" : "open" }
          : r
      )
    );
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  // Preview Mode switcher
  const handlePreviewModeChange = (mode: "login" | "dashboard" | "rooms") => {
    setPreviewMode(mode);
    if (mode === "login") {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
      setActiveTab(mode === "rooms" ? "rooms" : "dashboard");
    }
  };

  // Render Login screen if not logged in
  if (!isLoggedIn) {
    return (
      <LoginView
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setPreviewMode("dashboard");
          setActiveTab("dashboard");
        }}
      />
    );
  }

  // Dynamic Header Title
  const getHeaderTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "จัดการห้อง";
      case "rooms":
        return "รายการการจอง / จัดการห้อง";
      case "bookings":
        return "การจัดการคำขอจอง";
      case "users":
        return "จัดการผู้ใช้";
      case "reports":
        return "รายงานสถิติ";
      case "settings":
        return "ตั้งค่าระบบ";
      default:
        return "Admin CITU";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* 1. Sidebar (Deep Crimson Theme) */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === "rooms") setPreviewMode("rooms");
          else if (tab === "dashboard") setPreviewMode("dashboard");
        }}
        onLogout={() => {
          setIsLoggedIn(false);
          setPreviewMode("login");
        }}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={getHeaderTitle()}
          currentViewMode={previewMode}
          onChangeViewMode={handlePreviewModeChange}
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === "dashboard" && (
            <DashboardView
              bookings={bookings}
              hourlyStats={HOURLY_STATS}
              onSelectBooking={(b) => setSelectedBooking(b)}
              onNavigateToRooms={() => {
                setActiveTab("rooms");
                setPreviewMode("rooms");
              }}
              onNavigateToBookings={() => setActiveTab("bookings")}
            />
          )}

          {activeTab === "rooms" && (
            <RoomsView
              rooms={rooms}
              onAddRoom={handleAddRoom}
              onToggleStatus={handleToggleRoomStatus}
              onDeleteRoom={handleDeleteRoom}
            />
          )}

          {activeTab === "bookings" && (
            <BookingsView
              bookings={bookings}
              onSelectBooking={(b) => setSelectedBooking(b)}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {activeTab === "users" && <UsersView />}

          {activeTab === "reports" && (
            <div className="p-8 max-w-7xl mx-auto">
              <DashboardView
                bookings={bookings}
                hourlyStats={HOURLY_STATS}
                onSelectBooking={(b) => setSelectedBooking(b)}
                onNavigateToRooms={() => setActiveTab("rooms")}
                onNavigateToBookings={() => setActiveTab("bookings")}
              />
            </div>
          )}

          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>

      {/* Modal for booking details */}
      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
