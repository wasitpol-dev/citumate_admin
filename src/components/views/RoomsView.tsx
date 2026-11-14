"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  DoorOpen,
  Users,
  CheckCircle2,
  AlertTriangle,
  X,
  Edit2,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Room } from "@/lib/types";

interface RoomsViewProps {
  rooms: Room[];
  onAddRoom: (room: Omit<Room, "id">) => void;
  onToggleStatus: (roomId: string) => void;
  onDeleteRoom: (roomId: string) => void;
}

export function RoomsView({
  rooms,
  onAddRoom,
  onToggleStatus,
  onDeleteRoom,
}: RoomsViewProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Form state for adding room
  const [formData, setFormData] = useState({
    name: "",
    type: "ห้องศึกษาค้นคว้า",
    location: "อาคาร CITU ชั้น 3",
    capacity: "4-6 คน",
    capMin: 4,
    capMax: 6,
    status: "open" as "open" | "maintenance",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&auto=format&fit=crop&q=80",
  });

  const filteredRooms = rooms.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || r.type === filterType;
    return matchSearch && matchType;
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    onAddRoom({
      name: formData.name,
      type: formData.type,
      location: formData.location,
      capacity: `${formData.capMin}-${formData.capMax} คน`,
      capMin: Number(formData.capMin),
      capMax: Number(formData.capMax),
      status: formData.status,
      image: formData.image,
    });

    setIsAddModalOpen(false);
    setFormData({
      name: "",
      type: "ห้องศึกษาค้นคว้า",
      location: "อาคาร CITU ชั้น 3",
      capacity: "4-6 คน",
      capMin: 4,
      capMax: 6,
      status: "open",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&auto=format&fit=crop&q=80",
    });
  };

  return (
    <div className="p-4 md:p-8 w-full space-y-6">
      {/* Top Header & Search Bar (Exact Match) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">รายการการจอง / ห้องทั้งหมด</h3>
          <p className="text-xs text-slate-400 mt-0.5">จัดการสถานะห้อง ความจุ และรายการห้องของ CITU</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#7b1124] hover:bg-[#640c1d] active:scale-[0.99] text-white rounded-2xl text-sm font-semibold shadow-md shadow-rose-950/20 transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>เพิ่มห้อง</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาห้อง..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1124] transition"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { key: "all", label: "ทั้งหมด" },
            { key: "ห้องศึกษาค้นคว้า", label: "ห้องศึกษา" },
            { key: "ห้องประชุม", label: "ห้องประชุม" },
            { key: "ห้องสตูดิโอ", label: "สตูดิโอ" },
            { key: "ห้องบรรยาย", label: "ห้องบรรยาย" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilterType(item.key)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
                filterType === item.key
                  ? "bg-[#7b1124] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table (Exact Match to Design) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4 md:py-4 md:px-6">ชื่อห้อง</th>
                <th className="py-3 px-4 md:py-4 md:px-6">ประเภท</th>
                <th className="py-3 px-4 md:py-4 md:px-6 text-center">จำนวนที่นั่ง</th>
                <th className="py-3 px-4 md:py-4 md:px-6 text-center">สถานะ</th>
                <th className="py-3 px-4 md:py-4 md:px-6 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    ไม่พบข้อมูลห้องที่ค้นหา
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => {
                  const isOpen = room.status === "open";
                  return (
                    <tr
                      key={room.id}
                      className="hover:bg-slate-50/70 transition duration-150 group"
                    >
                      {/* ชื่อห้อง พร้อมรูปภาพ */}
                      <td className="py-3 px-4 md:py-4 md:px-6">
                        <div className="flex items-center space-x-3 md:space-x-4">
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-12 h-10 md:w-16 md:h-12 object-cover rounded-xl shadow-xs ring-1 ring-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 group-hover:text-[#7b1124] transition">
                              {room.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {room.location} · จองล่าสุด: 14 พ.ย. 2569 | 10:00 - 12:00
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ประเภท */}
                      <td className="py-3 px-4 md:py-4 md:px-6">
                        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg whitespace-nowrap">
                          {room.type}
                        </span>
                      </td>

                      {/* จำนวนที่นั่ง */}
                      <td className="py-3 px-4 md:py-4 md:px-6 text-center font-medium text-slate-700 whitespace-nowrap">
                        {room.capacity}
                      </td>

                      {/* สถานะ */}
                      <td className="py-3 px-4 md:py-4 md:px-6 text-center">
                        {isOpen ? (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>เปิดใช้งาน</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            <span>ซ่อมบำรุง</span>
                          </span>
                        )}
                      </td>

                      {/* Action 3 Dots */}
                      <td className="py-3 px-4 md:py-4 md:px-6 text-right relative">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === room.id ? null : room.id)
                          }
                          className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === room.id && (
                          <div className="absolute right-4 md:right-6 top-12 z-30 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 animate-in fade-in zoom-in-95">
                            <button
                              onClick={() => {
                                onToggleStatus(room.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                              <span>{isOpen ? "เปลี่ยนเป็น ซ่อมบำรุง" : "เปลี่ยนเป็น เปิดใช้งาน"}</span>
                            </button>
                            <button
                              onClick={() => {
                                onDeleteRoom(room.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              <span>ลบห้องนี้</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Room Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-lg font-bold text-slate-800">เพิ่มห้องใหม่</h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 mt-4 text-xs font-medium">
              <div>
                <label className="block text-slate-600 mb-1">ชื่อห้อง</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น CITU Study Room 502"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7b1124]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">ประเภท</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7b1124]"
                  >
                    <option value="ห้องศึกษาค้นคว้า">ห้องศึกษาค้นคว้า</option>
                    <option value="ห้องประชุม">ห้องประชุม</option>
                    <option value="ห้องสตูดิโอ">ห้องสตูดิโอ</option>
                    <option value="ห้องบรรยาย">ห้องบรรยาย</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">สถานที่ / ชั้น</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น อาคาร CITU ชั้น 5"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7b1124]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">ความจุต่ำสุด (คน)</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.capMin}
                    onChange={(e) => setFormData({ ...formData, capMin: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7b1124]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">ความจุสูงสุด (คน)</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.capMax}
                    onChange={(e) => setFormData({ ...formData, capMax: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7b1124]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">สถานะเริ่มต้น</label>
                <div className="flex space-x-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === "open"}
                      onChange={() => setFormData({ ...formData, status: "open" })}
                      className="text-[#7b1124] focus:ring-[#7b1124]"
                    />
                    <span>เปิดใช้งาน</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === "maintenance"}
                      onChange={() => setFormData({ ...formData, status: "maintenance" })}
                      className="text-[#7b1124] focus:ring-[#7b1124]"
                    />
                    <span>ซ่อมบำรุง</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#7b1124] text-white font-semibold hover:bg-[#640c1d] transition shadow-md"
                >
                  บันทึกห้อง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}