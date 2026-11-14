"use client";

import React, { useState } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { Booking } from "@/lib/types";

interface BookingsViewProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export function BookingsView({
  bookings,
  onSelectBooking,
  onApprove,
  onReject,
}: BookingsViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      b.roomName.toLowerCase().includes(search.toLowerCase()) ||
      b.studentName.toLowerCase().includes(search.toLowerCase()) ||
      b.studentId.includes(search) ||
      b.purpose.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && b.status === "pending") ||
      (statusFilter === "approved" && b.status === "approved") ||
      (statusFilter === "rejected" &&
        (b.status === "rejected" || b.status === "cancelled"));

    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-xl font-bold text-slate-800">การจัดการคำขอจอง</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          ตรวจสอบ อนุมัติ หรือปฏิเสธคำขอจองห้องศึกษาและห้องประชุม
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อผู้จอง, รหัสนักศึกษา, ห้อง..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1124] transition"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { key: "all", label: "ทั้งหมด" },
            { key: "pending", label: "รออนุมัติ" },
            { key: "approved", label: "อนุมัติแล้ว" },
            { key: "rejected", label: "ไม่อนุมัติ" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
                statusFilter === tab.key
                  ? "bg-[#7b1124] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-4 px-6">ห้อง</th>
                <th className="py-4 px-6">ผู้ขอใช้งาน</th>
                <th className="py-4 px-6">วัน-เวลา</th>
                <th className="py-4 px-6 text-center">สถานะ</th>
                <th className="py-4 px-6 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    ไม่พบรายการจองที่ตรงตามเงื่อนไข
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-slate-50/70 transition duration-150"
                  >
                    {/* ห้อง */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800">{b.roomName}</p>
                      <p className="text-xs text-slate-400">{b.roomType}</p>
                    </td>

                    {/* ผู้ขอใช้งาน */}
                    <td className="py-4 px-6">
                      <p className="font-medium text-slate-800">{b.studentName}</p>
                      <p className="text-xs text-slate-400">
                        รหัส: {b.studentId} ({b.attendees} คน)
                      </p>
                    </td>

                    {/* วัน-เวลา */}
                    <td className="py-4 px-6">
                      <p className="text-slate-700 font-medium">{b.dateLabel}</p>
                      <p className="text-xs text-slate-400">{b.slot}</p>
                    </td>

                    {/* สถานะ */}
                    <td className="py-4 px-6 text-center">
                      {b.status === "pending" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          รออนุมัติ
                        </span>
                      )}
                      {b.status === "approved" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          อนุมัติแล้ว
                        </span>
                      )}
                      {(b.status === "rejected" || b.status === "cancelled") && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          ไม่อนุมัติ
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onSelectBooking(b)}
                          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                          title="ดูรายละเอียด"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {b.status === "pending" && (
                          <>
                            <button
                              onClick={() => onApprove(b.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                            >
                              อนุมัติ
                            </button>
                            <button
                              onClick={() => onReject(b.id)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold border border-rose-200 transition"
                            >
                              ไม่อนุมัติ
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
