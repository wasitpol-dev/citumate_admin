"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, RefreshCw, UserCheck, Calendar, ShieldCheck, Mail } from "lucide-react";

export function UsersView() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<string>("กำลังโหลด...");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      if (json.success && json.data) {
        setUsers(json.data);
        if (json.source === "supabase_auth") {
          setDataSource("Supabase Auth (ผู้ใช้จริงที่ลงทะเบียน)");
        } else if (json.source === "supabase_bookings") {
          setDataSource("Supabase Bookings (ผู้ใช้ที่เคยจองห้องจริง)");
        } else {
          setDataSource("ข้อมูลเริ่มต้น");
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.studentId?.includes(search) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-800">รายชื่อผู้ใช้งานระบบ (นักศึกษา & แอดมิน)</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            ดึงข้อมูลจริงจาก Supabase: <span className="text-[#7b1124] font-semibold">{dataSource}</span>
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>รีเฟรชข้อมูลผู้ใช้</span>
        </button>
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

        <div className="text-xs text-slate-400">
          รวมทั้งหมด <span className="font-bold text-slate-800">{users.length}</span> คน
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
              <th className="py-4 px-6">ชื่อ - นามสกุล</th>
              <th className="py-4 px-6">สาขา / สังกัด</th>
              <th className="py-4 px-6 text-center">สิทธิ์การใช้งาน</th>
              <th className="py-4 px-6 text-center">จำนวนการจองจริง</th>
              <th className="py-4 px-6 text-right">เข้าใช้งานล่าสุด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <div className="inline-flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#7b1124]" />
                    <span>กำลังเชื่อมต่อดึงข้อมูลผู้ใช้จาก Supabase...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  ไม่พบข้อมูลผู้ใช้งาน
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-rose-50 text-[#7b1124] flex items-center justify-center font-bold text-xs ring-1 ring-rose-100 shrink-0">
                        {u.name?.slice(0, 1) || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">
                          รหัส: {u.studentId || "-"} · {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 text-xs">
                    {u.major || "วิทยาลัยนวัตกรรม (CITU)"}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {u.role?.includes("Admin") ? (
                      <span className="px-3 py-1 bg-rose-50 text-[#7b1124] border border-rose-200 text-xs font-semibold rounded-full">
                        ผู้ดูแลระบบ
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                        {u.role || "นักศึกษา"}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
                      {u.bookingCount || 0} ครั้ง
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-xs text-slate-400">
                    {u.lastSignIn
                      ? new Date(u.lastSignIn).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "ยังไม่เคยล็อกอิน"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
