import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// GET /api/bookings - ดึงรายการคำขอจองทั้งหมดจากฐานข้อมูล Supabase ผูกกับข้อมูลผู้ใช้จริง
export async function GET() {
  try {
    const { data: bookings, error } = await supabaseServer
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // ดึงข้อมูลผู้ใช้เพื่อมาจับคู่กับ user_id ใน booking
    let usersMap: Record<string, any> = {};
    try {
      const { data: authData } = await supabaseServer.auth.admin.listUsers();
      if (authData?.users) {
        authData.users.forEach((u: any) => {
          usersMap[u.id] = {
            name: u.user_metadata?.full_name || u.user_metadata?.username || u.email?.split("@")[0] || "นักศึกษา CITU",
            studentId: u.user_metadata?.student_id || u.id.slice(0, 10),
            email: u.email || "",
          };
        });
      }
    } catch (e) {
      // Service Role Key not present, try RPC
      try {
        const { data: rpcUsers } = await supabaseServer.rpc("get_registered_users");
        if (rpcUsers) {
          rpcUsers.forEach((u: any) => {
            usersMap[u.id] = {
              name: u.full_name || u.username || u.email?.split("@")[0] || "นักศึกษา CITU",
              studentId: u.student_id || u.id?.slice(0, 10),
              email: u.email || "",
            };
          });
        }
      } catch (errRpc) {}
    }

    // ผูกข้อมูลผู้ใช้จริงเข้ากับแต่ละ booking
    const enriched = bookings.map((b: any) => {
      const user = usersMap[b.user_id] || {
        name: b.student_name || "นักศึกษา CITU",
        studentId: b.user_id ? b.user_id.slice(0, 8) : "6509650001",
        email: b.student_email || (b.user_id ? `student_${b.user_id.slice(0, 5)}@dome.tu.ac.th` : "student@citu.tu.ac.th"),
      };

      return {
        ...b,
        student_name: user.name,
        student_id: user.studentId,
        student_email: user.email,
      };
    });

    return NextResponse.json({ success: true, data: enriched });
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

// POST /api/bookings - สร้างข้อมูลการจองใหม่ลง Supabase
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
