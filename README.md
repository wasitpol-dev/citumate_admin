# CITU MATE - Admin Panel

เว็บแอปพลิเคชันสำหรับผู้ดูแลระบบ **CITU MATE** (วิทยาลัยนวัตกรรม มหาวิทยาลัยธรรมศาสตร์) สำหรับบริหารจัดการห้องศึกษา ห้องประชุม และอนุมัติคำขอการจองห้อง พัฒนาด้วย Next.js (App Router) และพร้อมติดตั้งบน Vercel

## 🚀 ฟีเจอร์หลัก (Core Features)

1. **หน้าเข้าสู่ระบบ (Admin Login)**:
   - ธีมสีเลือดหมูเอกลักษณ์ CITU (`#7b1124`)
   - ยืนยันตัวตนสำหรับผู้ดูแลระบบโดยเฉพาะ
2. **หน้าแดชบอร์ดสรุปภาพรวม (Dashboard Overview)**:
   - สรุปตัวเลขสถิติวันนี้: การจองทั้งหมด, รออนุมัติ, อนุมัติแล้ว, ไม่อนุมัติ
   - กราฟแท่งเปรียบเทียบสถิติการใช้งานห้องตามช่วงเวลา
   - รายการคำขอจองล่าสุด พร้อมเปิดดูรายละเอียดและอนุมัติได้ทันที
3. **จัดการห้องศึกษาและการจอง (Room & Booking Management)**:
   - ค้นหาห้องและกรองตามหมวดหมู่ (ห้องศึกษาค้นคว้า, ห้องประชุม, ห้องสตูดิโอ, ห้องบรรยาย)
   - ฟอร์ม **+ เพิ่มห้อง**
   - เปลี่ยนสถานะห้อง (เปิดใช้งาน / ซ่อมบำรุง) และลบห้อง
   - ตรวจสอบรายชื่อนักศึกษา วัตถุประสงค์ และเวลาที่จอง พร้อมปุ่มอนุมัติ/ปฏิเสธ

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **Icons**: Lucide React
- **Backend / DB**: Supabase (เชื่อมต่อกับฐานข้อมูลเดียวกับแอปมือถือ CITU MATE)
- **Deployment Target**: Vercel

## 💻 การติดตั้งและทดสอบในเครื่อง (Local Setup)

```bash
# ติดตั้ง dependencies
npm install

# รันโหมด Development
npm run dev

# ทดสอบ Build
npm run build
```

เปิดบราวเซอร์ที่ [http://localhost:3000](http://localhost:3000)

## 🌐 การติดตั้งบน Vercel (Deployment)

1. นำโค้ดขึ้น GitHub repository (เช่น `https://github.com/wasitpol-dev/citumate_admin`)
2. เข้าสู่ [Vercel Dashboard](https://vercel.com) แล้วเลือก **Add New Project**
3. เลือก Repository `citumate_admin`
4. ใส่ Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://vwtowjxwsmwewvmvapnh.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `sb_publishable_uAHH5O0ciLf5OraEYK3g8Q_vGTgZOc-`
5. กด **Deploy**
