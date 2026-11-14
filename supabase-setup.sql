-- ==============================================================
-- CITU MATE: Supabase Database Setup & RLS Policy for Admin Panel
-- คัดลอกข้อความด้านล่างนี้ไปวางใน Supabase Dashboard -> SQL Editor แล้วกด RUN
-- ==============================================================

-- 1. อนุญาตให้เว็บ Admin สามารถดึงข้อมูลการจอง (SELECT) ได้
DROP POLICY IF EXISTS "Allow public read bookings" ON public.bookings;
CREATE POLICY "Allow public read bookings" ON public.bookings
FOR SELECT USING (true);

-- 2. อนุญาตให้เว็บ Admin และแอปมือถือสามารถบันทึกคำขอจอง (INSERT) ได้
DROP POLICY IF EXISTS "Allow insert bookings" ON public.bookings;
CREATE POLICY "Allow insert bookings" ON public.bookings
FOR INSERT WITH CHECK (true);

-- 3. อนุญาตให้เว็บ Admin สามารถกด อนุมัติ (Approve) หรือ ปฏิเสธ (Reject) คำขอจองได้ (UPDATE)
DROP POLICY IF EXISTS "Allow update bookings status" ON public.bookings;
CREATE POLICY "Allow update bookings status" ON public.bookings
FOR UPDATE USING (true) WITH CHECK (true);

-- 4. อนุญาตให้จัดการห้อง (rooms) ได้ (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Allow public read rooms" ON public.rooms;
CREATE POLICY "Allow public read rooms" ON public.rooms
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin manage rooms" ON public.rooms;
CREATE POLICY "Allow admin manage rooms" ON public.rooms
FOR ALL USING (true) WITH CHECK (true);

-- 5. เปิดใช้งาน Realtime เพื่อให้หน้าเว็บอัปเดตทันทีเมื่อนักศึกษากดจองในแอป
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
