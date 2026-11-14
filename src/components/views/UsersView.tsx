"use client";

import React, { useState } from "react";
import { Users, Search, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";

export function UsersView() {
  const [search, setSearch] = useState("");

  const users = [
    {
      id: "6509650012",
      name: "วสิทธิ์พล แก้วประดิษฐ์",
      email: "wasitpol.kae@dome.tu.ac.th",
      role: "ผู้ดูแลระบบ (Admin)",
      department: "วิทยาลัยนวัตกรรม (CITU)",
      bookingCount: 14,
    },
    {
      id: "6509650045",
      name: "กัญญาณัฐ วงศ์วิวัฒน์",
      email: "kanyanat.w@dome.tu.ac.th",
      role: "นักศึกษา",
      department: "นวัตกรรมและการประมวลผลข้อมูล",
      bookingCount: 8,
    },
    {
      id: "6609650118",
      name: "ธนกฤต ชัยพัฒนา",
      email: "thanakrit.c@dome.tu.ac.th",
      role: "นักศึกษา",
      department: "การจัดการเทคโนโลยีและนวัตกรรม",
      bookingCount: 5,
    },
    {
      id: "6409650020",
      name: "อภิสิทธิ์ เจริญพงษ์",
      email: "apisit.c@dome.tu.ac.th",
      role: "อาจารย์ / บุคลากร",
      department: "สาขาวิชานวัตกรรมการบริการ",
      bookingCount: 22,
    },
  ];

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.includes(search) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">รายชื่อผู้ใช้งานระบบ</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          จัดการข้อมูลนักศึกษา บุคลากร และกำหนดสิทธิ์ผู้ดูแลระบบ
        </p>
      </div>

      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ, รหัสนักศึกษา, อีเมล..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-800 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1124] transition"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
              <th className="py-4 px-6">ชื่อ - นามสกุล</th>
              <th className="py-4 px-6">สาขา / สังกัด</th>
              <th className="py-4 px-6 text-center">สิทธิ์การใช้งาน</th>
              <th className="py-4 px-6 text-center">จำนวนการจอง</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/70 transition">
                <td className="py-4 px-6">
                  <p className="font-bold text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-400">
                    รหัส: {u.id} · {u.email}
                  </p>
                </td>
                <td className="py-4 px-6 text-slate-600 text-xs">
                  {u.department}
                </td>
                <td className="py-4 px-6 text-center">
                  {u.role.includes("Admin") ? (
                    <span className="px-3 py-1 bg-rose-50 text-[#7b1124] border border-rose-200 text-xs font-semibold rounded-full">
                      ผู้ดูแลระบบ
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                      {u.role}
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 text-center font-bold text-slate-700">
                  {u.bookingCount} ครั้ง
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
