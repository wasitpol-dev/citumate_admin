"use client";

import React, { useState } from "react";
import { User, Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LoginViewProps {
  onLoginSuccess: (user?: any) => void;
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState("wasitpol.kae@dome.tu.ac.th");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let email = username.trim();

      // ถ้าไม่มี @ ให้ลองแปลง username เป็น email ผ่าน RPC
      if (!email.includes("@")) {
        try {
          const { data: foundEmail, error: rpcError } = await supabase.rpc(
            "get_email_by_username",
            { uname: email }
          );
          if (!rpcError && foundEmail) {
            email = foundEmail as string;
          }
        } catch (e) {}
      }

      // เข้าสู่ระบบผ่าน Supabase Auth จริง
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // แจ้งข้อผิดพลาดจริงจาก Supabase
        if (signInError.message.includes("Invalid login credentials")) {
          setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        } else if (signInError.message.includes("Email not confirmed")) {
          setError(
            "อีเมลนี้ยังไม่ได้กดยืนยันในระบบ Supabase (คุณสามารถกดปุ่ม 'เข้าใช้งานโหมดทดสอบ' ด้านล่างเพื่อเข้าสู่ระบบทันที)"
          );
        } else {
          setError(`เข้าสู่ระบบไม่สำเร็จ: ${signInError.message}`);
        }
        return;
      }

      if (data?.user) {
        onLoginSuccess(data.user);
      }
    } catch (err: any) {
      setError(err?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อกับ Supabase");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    onLoginSuccess({
      email: "wasitpol.kae@dome.tu.ac.th",
      user_metadata: {
        full_name: "วสิทธิ์พล แก้วประดิษฐ์",
        role: "admin",
      },
    });
  };

  return (
    <div className="min-h-[100dvh] bg-[#7b1124] flex flex-col justify-between items-center p-6 relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-96 h-96 bg-rose-800/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-96 h-96 bg-black/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top / Main Content Area */}
      <div className="w-full max-w-sm flex flex-col items-center my-auto z-10">
        {/* Brand Icon & Heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-16 mb-2 flex items-center justify-center">
            <img
              src="/logo-icon-white.png"
              alt="CITUMATE"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          <h1 className="text-3xl font-extrabold tracking-wider text-white uppercase font-serif drop-shadow-sm">
            CITUMATE
          </h1>
          <p className="text-xs font-semibold tracking-widest text-rose-200 uppercase mt-1">
            ADMIN PANEL
          </p>
        </div>

        {/* Login Card (Exact match to design) */}
        <div className="w-full bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-rose-100/20 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
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
                placeholder="ชื่อผู้ใช้ หรือ อีเมล"
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

          {/* Bypass for Demo / Unconfirmed email */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-xs text-[#7b1124] hover:underline font-semibold cursor-pointer"
            >
              เข้าใช้งานแบบผู้ดูแลระบบทันที (Bypass Mode)
            </button>
          </div>

          <div className="mt-4 text-center">
            <span className="inline-flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7b1124]" />
              <span>เชื่อมต่อ Supabase Auth เรียบร้อย</span>
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
