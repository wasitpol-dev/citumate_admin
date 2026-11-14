"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronRight,
  TrendingUp,
  User,
  MapPin,
  Users,
  Inbox,
} from "lucide-react";
import { Booking, HourlyStat } from "@/lib/types";

interface DashboardViewProps {
  bookings: Booking[];
  hourlyStats?: HourlyStat[];
  onSelectBooking: (booking: Booking) => void;
  onNavigateToRooms: () => void;
  onNavigateToBookings: () => void;
}

export function DashboardView({
  bookings,
  onSelectBooking,
  onNavigateToRooms,
  onNavigateToBookings,
}: DashboardViewProps) {
  // คำนวณจากข้อมูลจริง 100% ไม่มีตัวเลขสมมติ
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const approved = bookings.filter((b) => b.status === "approved").length;
  const rejected = bookings.filter(
    (b) => b.status === "rejected" || b.status === "cancelled"
  ).length;

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // คำนวณสถิติการใช้ห้องจริงตามช่วงเวลาจากรายการจองใน Supabase
  const timeSlots = [
    { label: "08:00", slotPrefix: "08:00" },
    { label: "10:00", slotPrefix: "10:00" },
    { label: "12:00", slotPrefix: "12:00" },
    { label: "14:00", slotPrefix: "14:00" },
    { label: "16:00", slotPrefix: "16:00" },
    { label: "18:00", slotPrefix: "18:00" },
  ];

  const computedHourlyStats = timeSlots.map((ts) => {
    // กรองการจองที่อยู่ในช่วงเวลานี้
    const matches = bookings.filter(
      (b) =>
        b.slot?.includes(ts.slotPrefix) ||
        (b.status !== "rejected" && b.status !== "cancelled" && b.slot?.startsWith(ts.slotPrefix.slice(0, 2)))
    );

    const studyCount = matches
      .filter((b) => !b.roomName?.includes("Meeting"))
      .reduce((acc, curr) => acc + (curr.attendees || 1), 0);

    const meetingCount = matches
      .filter((b) => b.roomName?.includes("Meeting"))
      .reduce((acc, curr) => acc + (curr.attendees || 1), 0);

    return {
      time: ts.label,
      studyRoom: studyCount,
      meetingRoom: meetingCount,
    };
  });

  const maxAttendees = Math.max(
    ...computedHourlyStats.map((s) => Math.max(s.studyRoom, s.meetingRoom)),
    10 // ค่าสเกลต่ำสุดเพื่อให้กราฟดูสวยงาม
  );

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
            รออนุมัติ
          </span>
        );
      case "approved":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            อนุมัติแล้ว
          </span>
        );
      case "rejected":
      case "cancelled":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
            ไม่อนุมัติ
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Summary Cards Section (Real Counts) */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <span>สรุปการใช้งานวันนี้</span>
          </h3>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            ● ข้อมูลจริงจากฐานข้อมูล Supabase
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {/* Card 1: Total Real Bookings */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#7b1124] flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 stroke-[2.2]" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {total}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-1">การจองทั้งหมด</p>
          </div>

          {/* Card 2: Real Pending Bookings */}
          <div
            onClick={onNavigateToBookings}
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <FileText className="w-6 h-6 stroke-[2.2]" />
            </div>
            <p className="text-3xl font-extrabold text-amber-600 tracking-tight">
              {pending}
            </p>
            <p className="text-xs font-medium text-amber-700/80 mt-1">รออนุมัติ</p>
          </div>

          {/* Card 3: Real Approved Bookings */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">
              {approved}
            </p>
            <p className="text-xs font-medium text-emerald-700/80 mt-1">อนุมัติแล้ว</p>
          </div>

          {/* Card 4: Real Rejected / Cancelled Bookings */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <p className="text-3xl font-extrabold text-rose-500 tracking-tight">
              {rejected}
            </p>
            <p className="text-xs font-medium text-rose-700/80 mt-1">ไม่อนุมัติ / ยกเลิก</p>
          </div>
        </div>
      </div>

      {/* 2. Room Usage Statistics Chart (Computed from Real Bookings) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h4 className="text-lg font-bold text-slate-800">สถิติการใช้ห้อง</h4>
            <p className="text-xs text-slate-400">
              {total > 0
                ? "คำนวณจากจำนวนผู้เข้าร่วมการจองจริงในแต่ละช่วงเวลา (คน/ช่วงเวลา)"
                : "ยังไม่มีประวัติการจองในระบบ — กราฟจะแสดงความสูงอัตโนมัติเมื่อมีคนจองจริง"}
            </p>
          </div>
          <div className="flex items-center space-x-5 text-xs font-medium">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-300"></span>
              <span className="text-slate-600">ห้องศึกษาค้นคว้า</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#7b1124]"></span>
              <span className="text-slate-600">ห้องประชุม</span>
            </div>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="pt-6 pb-2">
          <div className="h-48 flex items-end justify-between gap-2 px-4 border-b border-slate-100">
            {computedHourlyStats.map((stat, idx) => {
              const h1 = stat.studyRoom > 0 ? (stat.studyRoom / maxAttendees) * 100 : 4;
              const h2 = stat.meetingRoom > 0 ? (stat.meetingRoom / maxAttendees) * 100 : 4;

              return (
                <div
                  key={stat.time}
                  className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip */}
                  {hoveredBar === idx && (
                    <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap animate-fade-in pointer-events-none">
                      <div>ศึกษา: {stat.studyRoom} คน</div>
                      <div>ประชุม: {stat.meetingRoom} คน</div>
                    </div>
                  )}

                  {/* Paired Bars */}
                  <div className="w-full flex justify-center items-end gap-1.5 h-full">
                    <div
                      style={{ height: `${h1}%` }}
                      className={`w-4 sm:w-5 rounded-t-md transition-all duration-300 ${
                        stat.studyRoom > 0
                          ? "bg-rose-300 group-hover:bg-rose-400"
                          : "bg-slate-100 group-hover:bg-slate-200"
                      }`}
                    />
                    <div
                      style={{ height: `${h2}%` }}
                      className={`w-4 sm:w-5 rounded-t-md transition-all duration-300 ${
                        stat.meetingRoom > 0
                          ? "bg-[#7b1124] group-hover:bg-[#600c1c]"
                          : "bg-slate-200 group-hover:bg-slate-300"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Labels */}
          <div className="flex justify-between px-4 pt-3 text-xs text-slate-400 font-medium">
            {computedHourlyStats.map((stat) => (
              <span key={stat.time} className="flex-1 text-center">
                {stat.time}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recent Bookings List (Real Bookings Only) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h4 className="text-lg font-bold text-slate-800">รายการคำขอจองล่าสุด</h4>
            <p className="text-xs text-slate-400">รายการที่ถูกบันทึกลงฐานข้อมูล Supabase</p>
          </div>
          <button
            onClick={onNavigateToBookings}
            className="text-xs font-semibold text-[#7b1124] hover:underline cursor-pointer"
          >
            ดูทั้งหมด ({bookings.length})
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-3">
              <Inbox className="w-7 h-7" />
            </div>
            <p className="font-semibold text-slate-700 text-sm">ยังไม่มีคำขอการจองในระบบ</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              เมื่อมีนักศึกษาจองห้องผ่านแอป หรือกดปุ่ม <strong>"สร้างคำขอจองสด"</strong> ที่แถบด้านบน รายการจริงจะปรากฏที่นี่ทันทีครับ
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 mt-2">
            {bookings.slice(0, 6).map((booking) => (
              <div
                key={booking.id}
                onClick={() => onSelectBooking(booking)}
                className="py-4 px-3 flex items-center justify-between hover:bg-slate-50/80 rounded-2xl transition cursor-pointer group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-full bg-rose-50 text-[#7b1124] flex items-center justify-center shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7b1124]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-[#7b1124] transition">
                      {booking.roomName}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {booking.dateLabel} · {booking.slot} · {booking.attendees} คน · ผู้ขอ: {booking.studentName} ({booking.studentId})
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(booking.status)}
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
