import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// GET /api/bookings - ดึงรายการคำขอจองทั้งหมดจากฐานข้อมูล Supabase
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH /api/bookings - อนุมัติ หรือ ปฏิเสธการจองในฐานข้อมูล
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: id, status" },
        { status: 400 }
      );
    }

    // อัปเดตสถานะในตาราง bookings
    const { data, error } = await supabaseServer
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `อัปเดตสถานะคำขอ #${id} เป็น '${status}' สำเร็จ`,
      data,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/bookings - สร้างข้อมูลการจองใหม่ลง Supabase (สำหรับทดสอบจริง)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      room_id = "301",
      room_name = "CITU Study Room 01",
      date_key = new Date().toISOString().split("T")[0],
      date_label = "14 พ.ย. 2569",
      slot = "10:00 - 12:00",
      attendees = 5,
      purpose = "ประชุมวางแผนโครงการนวัตกรรมดิจิทัล CITU",
      status = "pending",
      user_id = null,
    } = body;

    const payload: any = {
      room_id,
      room_name,
      date_key,
      date_label,
      slot,
      attendees: Number(attendees),
      purpose,
      status,
    };

    if (user_id) {
      payload.user_id = user_id;
    }

    const { data, error } = await supabaseServer
      .from("bookings")
      .insert(payload)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "สร้างคำขอจองสำเร็จ", data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
