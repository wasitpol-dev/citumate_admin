"use client";

import React, { useState } from "react";
import { User, Lock, ArrowRight, ShieldCheck } from "lucide-react";

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState("admin@citu.tu.ac.th");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#7b1124] flex flex-col justify-between items-center p-6 relative overflow-hidden select-none">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-96 h-96 bg-rose-800/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-96 h-96 bg-black/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top / Main Content Area */}
      <div className="w-full max-w-sm flex flex-col items-center my-auto z-10">
        {/* Brand Icon & Heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg mb-3">
            <svg
              className="w-9 h-9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 10.5L12 3l9 7.5v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
              <path d="M9 21V12h6v9" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-wider text-white uppercase font-serif drop-shadow-sm">
            CITU MATE
          </h1>
          <p className="text-xs font-semibold tracking-widest text-rose-200 uppercase mt-1">
            ADMIN PANEL
          </p>
        </div>

        {/* Login Card (Exact match to design) */}
        <div className="w-full bg-white rounded-3xl p-7 shadow-2xl border border-rose-100/20 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            {/* Username Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ชื่อผู้ใช้"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7b1124] focus:border-transparent text-sm transition"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่าน"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7b1124] focus:border-transparent text-sm transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3.5 px-4 bg-[#7b1124] hover:bg-[#640c1d] active:scale-[0.99] text-white font-medium rounded-2xl shadow-lg shadow-rose-950/20 flex items-center justify-center space-x-2 transition duration-150 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-sm font-semibold tracking-wide">เข้าสู่ระบบ</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <span className="inline-flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7b1124]" />
              <span>เข้าสู่ระบบเฉพาะผู้ดูแลระบบ CITU เท่านั้น</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <footer className="text-center py-4 z-10">
        <p className="text-xs font-medium text-rose-200/60 tracking-wider">
          College of Innovation · Thammasat University
        </p>
      </footer>
    </div>
  );
}
