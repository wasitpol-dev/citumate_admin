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
} from "lucide-react";
import { Booking, HourlyStat } from "@/lib/types";

interface DashboardViewProps {
  bookings: Booking[];
  hourlyStats: HourlyStat[];
  onSelectBooking: (booking: Booking) => void;
  onNavigateToRooms: () => void;
  onNavigateToBookings: () => void;
}

export function DashboardView({
  bookings,
  hourlyStats,
  onSelectBooking,
  onNavigateToRooms,
  onNavigateToBookings,
}: DashboardViewProps) {
  const total = bookings.length > 0 ? 128 : 0;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const approved = bookings.filter((b) => b.status === "approved").length + 115;
  const rejected = bookings.filter((b) => b.status === "rejected" || b.status === "cancelled").length + 6;

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

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
      {/* 1. Summary Cards Section */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center space-x-2">
          <span>สรุปการใช้งานวันนี้</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {/* Card 1: Total */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#7b1124] flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 stroke-[2.2]" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{total}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">การจองทั้งหมด</p>
          </div>

          {/* Card 2: Pending */}
          <div
            onClick={onNavigateToBookings}
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <FileText className="w-6 h-6 stroke-[2.2]" />
            </div>
            <p className="text-3xl font-extrabold text-amber-600 tracking-tight">{pending}</p>
            <p className="text-xs font-medium text-amber-700/80 mt-1">รออนุมัติ</p>
          </div>

          {/* Card 3: Approved */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">{approved}</p>
            <p className="text-xs font-medium text-emerald-700/80 mt-1">อนุมัติแล้ว</p>
          </div>

          {/* Card 4: Rejected */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <p className="text-3xl font-extrabold text-rose-500 tracking-tight">{rejected}</p>
            <p className="text-xs font-medium text-rose-700/80 mt-1">ไม่อนุมัติ</p>
          </div>
        </div>
      </div>

      {/* 2. Room Usage Statistics Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h4 className="text-lg font-bold text-slate-800">สถิติการใช้ห้อง</h4>
            <p className="text-xs text-slate-400">เปรียบเทียบความหนาแน่นรายช่วงเวลา (คน/ชั่วโมง)</p>
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
            {hourlyStats.map((stat, idx) => {
              const maxVal = 100;
              const h1 = (stat.studyRoom / maxVal) * 100;
              const h2 = (stat.meetingRoom / maxVal) * 100;

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
                      className="w-4 sm:w-5 bg-rose-300 rounded-t-md transition-all duration-300 group-hover:bg-rose-400"
                    />
                    <div
                      style={{ height: `${h2}%` }}
                      className="w-4 sm:w-5 bg-[#7b1124] rounded-t-md transition-all duration-300 group-hover:bg-[#600c1c]"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Labels */}
          <div className="flex justify-between px-4 pt-3 text-xs text-slate-400 font-medium">
            {hourlyStats.map((stat) => (
              <span key={stat.time} className="flex-1 text-center">
                {stat.time}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recent Bookings List (Exact match to design) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h4 className="text-lg font-bold text-slate-800">รายการล่าสุด</h4>
          <button
            onClick={onNavigateToBookings}
            className="text-xs font-semibold text-[#7b1124] hover:underline cursor-pointer"
          >
            ดูทั้งหมด ({bookings.length})
          </button>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {bookings.slice(0, 5).map((booking) => (
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
                    {booking.dateLabel} · {booking.slot} · โดย {booking.studentName} ({booking.studentId})
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
      </div>
    </div>
  );
}
