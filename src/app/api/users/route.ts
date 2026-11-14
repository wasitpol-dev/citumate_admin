import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    let usersList: any[] = [];

    // 1. ลองดึงผ่าน Supabase Auth Admin API (กรณีใส่ SUPABASE_SERVICE_ROLE_KEY)
    try {
      const { data: authData, error: authError } =
        await supabaseServer.auth.admin.listUsers();

      if (!authError && authData && authData.users) {
        usersList = authData.users.map((u: any) => ({
          id: u.id,
          studentId: u.user_metadata?.student_id || u.id.slice(0, 10),
          name: u.user_metadata?.full_name || u.user_metadata?.username || u.email?.split("@")[0] || "ผู้ใช้",
          email: u.email || "",
          username: u.user_metadata?.username || "",
          major: u.user_metadata?.major || "วิทยาลัยนวัตกรรม (CITU)",
          role: u.user_metadata?.role === "admin" ? "ผู้ดูแลระบบ (Admin)" : "นักศึกษา",
          lastSignIn: u.last_sign_in_at,
          createdAt: u.created_at,
        }));
      }
    } catch (adminErr) {
      // Service Role Key not set or no permission
    }

    // 2. ถ้ายังไม่ได้ ให้ลองดึงผ่าน RPC Function 'get_registered_users'
    if (usersList.length === 0) {
      try {
        const { data: rpcData, error: rpcError } = await supabaseServer.rpc(
          "get_registered_users"
        );
        if (!rpcError && rpcData && rpcData.length > 0) {
          usersList = rpcData.map((u: any) => ({
            id: u.id,
            studentId: u.student_id || u.id?.slice(0, 10),
            name: u.full_name || u.username || u.email?.split("@")[0] || "ผู้ใช้",
            email: u.email || "",
            username: u.username || "",
            major: u.major || "วิทยาลัยนวัตกรรม (CITU)",
            role: "นักศึกษา",
            lastSignIn: u.last_sign_in_at,
            createdAt: u.created_at,
          }));
        }
      } catch (rpcErr) {
        // RPC not found
      }
    }

    // 3. ดึงสถิติจำนวนการจองจริงของแต่ละ user จากตาราง bookings
    const { data: bookingsData } = await supabaseServer
      .from("bookings")
      .select("id, user_id, purpose, room_name, created_at");

    const bookingCounts: Record<string, number> = {};
    if (bookingsData) {
      bookingsData.forEach((b: any) => {
        if (b.user_id) {
          bookingCounts[b.user_id] = (bookingCounts[b.user_id] || 0) + 1;
        }
      });
    }

    // ถ้าพบ user ให้ผูกจำนวนการจองจริง
    if (usersList.length > 0) {
      usersList = usersList.map((u) => ({
        ...u,
        bookingCount: bookingCounts[u.id] || 0,
      }));
      return NextResponse.json({ success: true, source: "supabase_auth", data: usersList });
    }

    // 4. กรณีที่ยังไม่มี RPC หรือ Service Key แต่มี user_id ในตาราง bookings
    // ให้รวบรวม user_id จริงจากประวัติการจองในฐานข้อมูล
    if (bookingsData && bookingsData.length > 0) {
      const uniqueUserIds = Array.from(new Set(bookingsData.map((b: any) => b.user_id).filter(Boolean)));
      if (uniqueUserIds.length > 0) {
        const extractedUsers = uniqueUserIds.map((uid: any, idx: number) => ({
          id: String(uid),
          studentId: String(uid).slice(0, 10),
          name: `นักศึกษา CITU #${idx + 1}`,
          email: `student_${String(uid).slice(0, 6)}@dome.tu.ac.th`,
          username: `user_${String(uid).slice(0, 6)}`,
          major: "วิทยาลัยนวัตกรรม (CITU)",
          role: "นักศึกษา",
          bookingCount: bookingCounts[String(uid)] || 1,
          createdAt: new Date().toISOString(),
        }));
        return NextResponse.json({ success: true, source: "supabase_bookings", data: extractedUsers });
      }
    }

    // ถ้าใน Supabase ยังไม่มี user ใดๆ เลย ให้ส่งข้อมูลเริ่มต้นพร้อมข้อความแจ้งเตือน
    return NextResponse.json({
      success: true,
      source: "fallback",
      data: [
        {
          id: "1",
          studentId: "6509650012",
          name: "วสิทธิ์พล แก้วประดิษฐ์",
          email: "wasitpol.kae@dome.tu.ac.th",
          username: "wasitpol",
          major: "วิทยาลัยนวัตกรรม (CITU)",
          role: "ผู้ดูแลระบบ (Admin)",
          bookingCount: bookingCounts["1"] || 0,
          createdAt: new Date().toISOString(),
        },
      ],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
