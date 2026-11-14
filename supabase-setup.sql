-- =========================================================================
-- CITU MATE: Supabase Database Setup & RLS Policy for Real Users & Bookings
-- คัดลอกข้อความด้านล่างนี้ไปวางใน Supabase Dashboard -> SQL Editor แล้วกด RUN
-- =========================================================================

-- 1. ฟังก์ชันดึงรายชื่อผู้ใช้จริงที่ลงทะเบียน / ล็อกอินทั้งหมดในระบบ (auth.users)
CREATE OR REPLACE FUNCTION public.get_registered_users()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  student_id text,
  username text,
  major text,
  generation text,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email::text,
    COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'username', split_part(u.email, '@', 1))::text AS full_name,
    COALESCE(u.raw_user_meta_data->>'student_id', substring(u.id::text from 1 for 8))::text AS student_id,
    COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1))::text AS username,
    COALESCE(u.raw_user_meta_data->>'major', 'วิทยาลัยนวัตกรรม (CITU)')::text AS major,
    COALESCE(u.raw_user_meta_data->>'generation', '-')::text AS generation,
    u.created_at,
    u.last_sign_in_at
  FROM auth.users u
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 2. อนุญาตให้เว็บ Admin สามารถเรียกใช้ฟังก์ชัน get_registered_users ได้
GRANT EXECUTE ON FUNCTION public.get_registered_users() TO anon, authenticated, service_role;

-- 3. อนุญาตให้เว็บ Admin สามารถดึงข้อมูลการจอง (SELECT) ได้
DROP POLICY IF EXISTS "Allow public read bookings" ON public.bookings;
CREATE POLICY "Allow public read bookings" ON public.bookings
FOR SELECT USING (true);

-- 4. อนุญาตให้แอปมือถือและเว็บ Admin สามารถบันทึกคำขอจอง (INSERT) ได้
DROP POLICY IF EXISTS "Allow insert bookings" ON public.bookings;
CREATE POLICY "Allow insert bookings" ON public.bookings
FOR INSERT WITH CHECK (true);

-- 5. อนุญาตให้เว็บ Admin สามารถกด อนุมัติ (Approve) หรือ ปฏิเสธ (Reject) ได้ (UPDATE)
DROP POLICY IF EXISTS "Allow update bookings status" ON public.bookings;
CREATE POLICY "Allow update bookings status" ON public.bookings
FOR UPDATE USING (true) WITH CHECK (true);

-- 6. อนุญาตให้จัดการห้อง (rooms) ได้ (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Allow public read rooms" ON public.rooms;
CREATE POLICY "Allow public read rooms" ON public.rooms
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin manage rooms" ON public.rooms;
CREATE POLICY "Allow admin manage rooms" ON public.rooms
FOR ALL USING (true) WITH CHECK (true);

-- 7. เปิดใช้งาน Realtime สำหรับตาราง bookings และ rooms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'bookings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'rooms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
  END IF;
END $$;
