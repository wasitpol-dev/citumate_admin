"use client";

import React from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  DoorOpen,
  Users,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import { Booking } from "@/lib/types";

interface BookingDetailModalProps {
  booking: Booking | null;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export function BookingDetailModal({
  booking,
  onClose,
  onApprove,
  onReject,
}: BookingDetailModalProps) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-lg font-bold text-slate-800">
              รายละเอียดคำขอจองห้อง
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              รหัสคำขอ: #{booking.id.toString().padStart(4, "0")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 text-xs">
          {/* Room Banner */}
          <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#7b1124] text-white flex items-center justify-center shrink-0">
                <DoorOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-slate-800 truncate">{booking.roomName}</p>
                <p className="text-slate-400">{booking.roomType}</p>
              </div>
            </div>
            <div className="shrink-0">
              {booking.status === "pending" && (
                <span className="px-3 py-1 rounded-full font-semibold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
                  รออนุมัติ
                </span>
              )}
              {booking.status === "approved" && (
                <span className="px-3 py-1 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                  อนุมัติแล้ว
                </span>
              )}
              {(booking.status === "rejected" || booking.status === "cancelled") && (
                <span className="px-3 py-1 rounded-full font-semibold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                  ไม่อนุมัติ
                </span>
              )}
            </div>
          </div>

          {/* Time & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 flex items-center space-x-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>วันที่จอง</span>
              </span>
              <p className="font-semibold text-slate-800">{booking.dateLabel}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 flex items-center space-x-1.5 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>ช่วงเวลา</span>
              </span>
              <p className="font-semibold text-slate-800">{booking.slot}</p>
            </div>
          </div>

          {/* Student Info */}
          <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <p className="font-bold text-slate-700 mb-2">ข้อมูลผู้ขอใช้ห้อง</p>
            <div className="flex items-start space-x-2 text-slate-600">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="break-words min-w-0">
                {booking.studentName} (รหัสนักศึกษา: {booking.studentId})
              </span>
            </div>
            <div className="flex items-start space-x-2 text-slate-600">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="break-all min-w-0">{booking.studentEmail}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>จำนวนผู้เข้าร่วม: {booking.attendees} คน</span>
            </div>
          </div>

          {/* Purpose */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 flex items-center space-x-1.5 mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>วัตถุประสงค์การใช้งาน</span>
            </span>
            <p className="text-slate-700 font-medium leading-relaxed break-words">
              {booking.purpose}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center space-x-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => onReject(booking.id)}
            className="flex-1 py-2.5 rounded-xl border border-rose-200 text-rose-600 font-semibold hover:bg-rose-50 transition flex items-center justify-center space-x-1.5"
          >
            <XCircle className="w-4 h-4" />
            <span>ไม่อนุมัติ</span>
          </button>
          <button
            onClick={() => onApprove(booking.id)}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition shadow-md flex items-center justify-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>อนุมัติการจอง</span>
          </button>
        </div>
      </div>
    </div>
  );
}