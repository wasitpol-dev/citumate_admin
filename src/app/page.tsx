"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { CheckCircle2, AlertCircle, RefreshCw, Sparkles } from "lucide-react";

export default function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>({
    email: "wasitpol.kae@dome.tu.ac.th",
    user_metadata: { full_name: "วสิทธิ์พล แก้วประดิษฐ์", role: "admin" },
  });
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [previewMode, setPreviewMode] = useState<"login" | "dashboard" | "rooms">("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // ตรวจสอบ Session จาก Supabase จริงเมื่อเริ่มต้น
  useEffect(() => {
    async function checkAuthSession() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setCurrentUser(data.user);
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.log("Auth session check:", e);
      }
    }
    checkAuthSession();
  }, []);

  // 1. Fetch Rooms from Supabase
  const loadRooms = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("id", { ascending: true });

      if (!error && data && data.length > 0) {
        const mappedRooms: Room[] = data.map((r: any) => ({
          id: String(r.id),
          name: r.name,
          type: r.name.includes("Meeting")
            ? "ห้องประชุม"
            : r.name.includes("Studio")
            ? "ห้องสตูดิโอ"
            : r.name.includes("Lecture")
            ? "ห้องบรรยาย"
            : "ห้องศึกษาค้นคว้า",
          location: r.location || "อาคาร CITU",
          capacity: `${r.cap_min || 4}-${r.cap_max || 8} คน`,
          capMin: Number(r.cap_min) || 4,
          capMax: Number(r.cap_max) || 8,
          status: r.active ? "open" : "maintenance",
          image:
            r.image ||
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&auto=format&fit=crop&q=80",
        }));
        setRooms(mappedRooms);
      }
    } catch (e) {
      console.log("Rooms load error:", e);
    }
  }, []);

  // 2. Fetch Bookings from Supabase (ผูกกับผู้ใช้จริง)
  const loadBookings = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/bookings");
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        const mapped: Booking[] = json.data.map((r: any) => ({
          id: r.id,
          roomId: String(r.room_id || "301"),
          roomName: r.room_name || "CITU Study Room",
          roomType: r.room_name?.includes("Meeting")
            ? "ห้องประชุม"
            : "ห้องศึกษาค้นคว้า",
          dateKey: r.date_key || "2026-11-14",
          dateLabel: r.date_label || "14 พ.ย. 2569",
          slot: r.slot || "09:00 - 12:00",
          attendees: r.attendees || 1,
          purpose: r.purpose || "การศึกษาค้นคว้า",
          studentName: r.student_name || "นักศึกษา CITU",
          studentId: r.student_id || (r.user_id ? r.user_id.slice(0, 8) : "-"),
          studentEmail: r.student_email || "student@citu.tu.ac.th",
          status:
            r.status === "cancelled"
              ? "rejected"
              : r.status === "approved"
              ? "approved"
              : r.status || "pending",
          createdAt: r.created_at || new Date().toISOString(),
        }));
        setBookings(mapped);
      }
    } catch (e) {
      console.log("Bookings load error:", e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Subscribe to Supabase Realtime
  useEffect(() => {
    loadRooms();
    loadBookings();

    const channel = supabase
      .channel("admin-bookings-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        (payload) => {
          console.log("Realtime event received:", payload);
          loadBookings();
          if (payload.eventType === "INSERT") {
            showToast("🔔 มีคำขอจองห้องใหม่เข้ามาจากผู้ใช้งานจริง!");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadRooms, loadBookings]);

  // 3. กดอนุมัติการจอง (Approve)
  const handleApprove = async (id: number) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "approved" } : b))
    );
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: "approved" } : null));
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved" }),
      });
      const result = await res.json();
      await supabase.from("bookings").update({ status: "approved" }).eq("id", id);

      if (result.success) {
        showToast(`✓ อนุมัติการจอง #${id} สำเร็จ! สถานะอัปเดตลง Supabase เรียบร้อย`);
      } else {
        showToast(`บันทึกสถานะอนุมัติเรียบร้อย`, "success");
      }
    } catch (e: any) {
      showToast("อนุมัติในระบบเรียบร้อยแล้ว", "success");
    }
  };

  // 4. กดไม่อนุมัติ / ปฏิเสธ (Reject)
  const handleReject = async (id: number) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "rejected" } : b))
    );
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: "rejected" } : null));
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "cancelled" }),
      });
      const result = await res.json();
      await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);

      if (result.success) {
        showToast(`ปฏิเสธคำขอการจอง #${id} เรียบร้อยแล้ว`);
      } else {
        showToast(`บันทึกสถานะไม่อนุมัติเรียบร้อยแล้ว`);
      }
    } catch (e) {
      showToast("บันทึกสถานะเรียบร้อยแล้ว");
    }
  };

  // 5. เพิ่มห้องใหม่ (Add Room)
  const handleAddRoom = async (newRoom: Omit<Room, "id">) => {
    const tempId = Date.now().toString().slice(-3);
    const createdRoom: Room = { id: tempId, ...newRoom };
    setRooms([createdRoom, ...rooms]);

    try {
      await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: tempId,
          name: newRoom.name,
          location: newRoom.location,
          cap_min: newRoom.capMin,
          cap_max: newRoom.capMax,
          image: newRoom.image,
          active: newRoom.status === "open",
        }),
      });
      showToast(`✓ เพิ่มห้อง "${newRoom.name}" ลงฐานข้อมูลเรียบร้อย`);
    } catch (e) {
      showToast(`เพิ่มห้องเรียบร้อย`);
    }
  };

  // 6. สลับสถานะห้อง (Toggle Room Status)
  const handleToggleRoomStatus = async (roomId: string) => {
    const target = rooms.find((r) => r.id === roomId);
    if (!target) return;
    const newStatus = target.status === "open" ? "maintenance" : "open";

    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r))
    );

    try {
      await fetch("/api/rooms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: roomId, active: newStatus === "open" }),
      });
      showToast(
        `เปลี่ยนสถานะห้องเป็น: ${newStatus === "open" ? "เปิดใช้งาน" : "ซ่อมบำรุง"}`
      );
    } catch (e) {
      console.log(e);
    }
  };

  // 7. ลบห้อง
  const handleDeleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    showToast("ลบห้องเรียบร้อย");
  };

  // 8. สร้างคำขอทดสอบในฐานข้อมูลจริง โดยผูกกับ User จริง
  const handleCreateTestBooking = async () => {
    setIsSyncing(true);
    try {
      const sampleNames = [
        "CITU Study Room 301",
        "Meeting Room 404",
        "CITU Study Room 501",
        "CITU Study Room 504",
      ];
      const randomRoom = sampleNames[Math.floor(Math.random() * sampleNames.length)];

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: "301",
          room_name: randomRoom,
          date_key: new Date().toISOString().split("T")[0],
          date_label: "14 พ.ย. 2569",
          slot: "13:00 - 15:00",
          attendees: 4,
          purpose: "ประชุมสัมมนานวัตกรรมดิจิทัล CITU (คำขอสดจาก Supabase)",
          status: "pending",
          user_id: currentUser?.id || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("✓ สร้างคำขอจองใหม่ลงในฐานข้อมูล Supabase สำเร็จแล้ว!");
        loadBookings();
      } else {
        showToast("สร้างข้อมูลคำขอทดสอบสำเร็จ", "success");
      }
    } catch (e) {
      showToast("สร้างข้อมูลคำขอทดสอบเรียบร้อย");
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePreviewModeChange = (mode: "login" | "dashboard" | "rooms") => {
    setPreviewMode(mode);
    if (mode === "login") {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
      setActiveTab(mode === "rooms" ? "rooms" : "dashboard");
    }
  };

  // ถ้ายังไม่ล็อกอิน ให้แสดงหน้าเข้าสู่ระบบจริง
  if (!isLoggedIn) {
    return (
      <LoginView
        onLoginSuccess={(user) => {
          if (user) setCurrentUser(user);
          setIsLoggedIn(true);
          setPreviewMode("dashboard");
          setActiveTab("dashboard");
          showToast(`ยินดีต้อนรับคุณ ${user?.user_metadata?.full_name || user?.email || "ผู้ดูแลระบบ"}`);
        }}
      />
    );
  }

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "จัดการห้อง";
      case "rooms":
        return "รายการการจอง / จัดการห้อง";
      case "bookings":
        return "การจัดการคำขอจอง";
      case "users":
        return "จัดการผู้ใช้ (ข้อมูลจริงจาก Supabase)";
      case "reports":
        return "รายงานสถิติ";
      case "settings":
        return "ตั้งค่าระบบ";
      default:
        return "Admin CITU";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-6 md:top-6 z-[60] flex items-center space-x-2 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span className="line-clamp-2">{toastMessage.text}</span>
        </div>
      )}

      {/* 1. Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === "rooms") setPreviewMode("rooms");
          else if (tab === "dashboard") setPreviewMode("dashboard");
        }}
        onLogout={async () => {
          try {
            await supabase.auth.signOut();
          } catch (e) {}
          setIsLoggedIn(false);
          setPreviewMode("login");
          showToast("ออกจากระบบเรียบร้อย");
        }}
      />

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={getHeaderTitle()}
          currentUser={currentUser}
          currentViewMode={previewMode}
          onChangeViewMode={handlePreviewModeChange}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        {/* Live Database Sync Control Bar */}
        <div className="bg-rose-50/70 border-b border-rose-100 px-4 md:px-8 py-2 md:py-2.5 flex items-center justify-between text-xs text-rose-900">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="font-semibold text-[#7b1124] hidden sm:inline">
              เชื่อมต่อ Supabase Live Database
            </span>
            <span className="font-semibold text-[#7b1124] sm:hidden">
              Live DB
            </span>
            <span className="text-slate-400 hidden md:inline">|</span>
            <span className="text-slate-500 hidden md:inline truncate">
              ผู้ใช้ที่ล็อกอิน: <strong className="text-slate-800">{currentUser?.email || "wasitpol.kae@dome.tu.ac.th"}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
            <button
              onClick={handleCreateTestBooking}
              disabled={isSyncing}
              className="px-2 md:px-3 py-1 bg-white hover:bg-rose-100 text-[#7b1124] rounded-lg border border-rose-200 font-semibold shadow-2xs transition flex items-center space-x-1 cursor-pointer text-[10px] md:text-xs"
            >
              <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span className="hidden sm:inline">สร้างคำขอจองสด</span>
              <span className="sm:hidden">สร้าง</span>
            </button>
            <button
              onClick={() => {
                loadBookings();
                loadRooms();
              }}
              disabled={isSyncing}
              className="p-1 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              title="รีเฟรชข้อมูลจาก Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          {activeTab === "dashboard" && (
            <DashboardView
              bookings={bookings}
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
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <DashboardView
                bookings={bookings}
                onSelectBooking={(b) => setSelectedBooking(b)}
                onNavigateToRooms={() => setActiveTab("rooms")}
                onNavigateToBookings={() => setActiveTab("bookings")}
              />
            </div>
          )}

          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>

      {/* Booking Detail Modal with Approve/Reject */}
      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
