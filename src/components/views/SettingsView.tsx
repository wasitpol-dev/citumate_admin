"use client";

import React, { useState } from "react";
import { Settings, Save, Shield, Clock, Bell, Database } from "lucide-react";

export function SettingsView() {
  const [autoApprove, setAutoApprove] = useState(false);
  const [maxHours, setMaxHours] = useState("3");
  const [openingTime, setOpeningTime] = useState("08:00");
  const [closingTime, setClosingTime] = useState("20:00");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">ตั้งค่าระบบ</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          กำหนดเงื่อนไขการจองห้อง เวลาทำการ และการแจ้งเตือน
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 text-sm">
        {saved && (
          <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-semibold border border-emerald-200">
            ✓ บันทึกการตั้งค่าเรียบร้อยแล้ว
          </div>
        )}

        <div className="space-y-4">
          <h4 className="font-bold text-slate-700 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#7b1124]" />
            <span>เวลาทำการและสิทธิ์การจอง</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                เวลาเปิดให้บริการห้อง
              </label>
              <input
                type="time"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7b1124]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                เวลาปิดให้บริการห้อง
              </label>
              <input
                type="time"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7b1124]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              จำกัดเวลาการจองสูงสุดต่อครั้ง (ชั่วโมง)
            </label>
            <input
              type="number"
              min={1}
              max={8}
              value={maxHours}
              onChange={(e) => setMaxHours(e.target.value)}
              className="w-full sm:w-48 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#7b1124]"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={(e) => setAutoApprove(e.target.checked)}
                className="w-4 h-4 rounded text-[#7b1124] focus:ring-[#7b1124]"
              />
              <span className="text-xs text-slate-700 font-medium">
                เปิดระบบอนุมัติการจองอัตโนมัติ (Auto-Approve) สำหรับห้องศึกษาทั่วไป
              </span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#7b1124] hover:bg-[#640c1d] text-white rounded-xl text-xs font-semibold shadow-md transition"
          >
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </form>
    </div>
  );
}
