import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// GET /api/rooms - ดึงข้อมูลห้องทั้งหมดจาก Supabase
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("rooms")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH /api/rooms - สลับสถานะเปิดใช้งาน / ปิดซ่อมบำรุงใน Supabase
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, active } = body;

    if (!id || typeof active !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Missing required fields: id, active" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("rooms")
      .update({ active })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `อัปเดตสถานะห้อง #${id} เรียบร้อยแล้ว`,
      data,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/rooms - เพิ่มห้องใหม่ใน Supabase
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, location, cap_min, cap_max, image, active = true } = body;

    const { data, error } = await supabaseServer
      .from("rooms")
      .insert({
        id: id || Date.now().toString().slice(-4),
        name,
        location,
        cap_min: Number(cap_min) || 4,
        cap_max: Number(cap_max) || 8,
        image,
        active,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "เพิ่มห้องใหม่สำเร็จ", data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
