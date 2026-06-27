# Lens Order System v2 — Starter

MVP โครงแรกสำหรับ:

- `/customer` — LINE LIFF ลูกค้า
- `/admin` — Admin Login
- `/admin/dashboard` — Dashboard และอนุมัติลูกค้า
- Supabase เป็นฐานข้อมูลหลัก
- Admin ทำงานคลังในระบบเดียวกันในเฟสถัดไป

## 1) เริ่มรันในเครื่อง

```bash
cp .env.example .env.local
npm install
npm run dev
```

## 2) Apply migration

เปิด Supabase SQL Editor แล้วรัน:

`supabase/migrations/001_initial_schema.sql`

## 3) สร้าง Admin คนแรก

1. Supabase Dashboard → Authentication → Users → Add user
2. จด UUID ของ user
3. รัน SQL:

```sql
insert into public.admin_users (id, role, display_name)
values ('AUTH_USER_UUID', 'OWNER', 'System Owner');
```

## 4) Deploy Edge Function

ฟังก์ชันอยู่ที่ `supabase/functions/line-session/index.ts`

ตั้ง Secrets:

```bash
supabase secrets set LINE_CHANNEL_ID=2010529149
```

`SUPABASE_URL` และ `SUPABASE_SERVICE_ROLE_KEY` ถูกจัดเตรียมให้ Edge Functions โดย Supabase runtime; หาก environment ของโปรเจกต์ไม่แสดง ให้ตั้งผ่าน Dashboard โดยห้ามนำ service role key ใส่ frontend หรือ GitHub

Deploy:

```bash
supabase functions deploy line-session --no-verify-jwt
```

เหตุผลที่ใช้ `--no-verify-jwt`: ลูกค้าไม่มี Supabase session; Edge Function ตรวจ LINE ID token กับ LINE โดยตรงทุกครั้ง

## 5) Deploy Website

Deploy ผ่าน Vercel/Netlify/Cloudflare Pages แล้วตั้ง Environment Variables ตาม `.env.example`

จากนั้นนำ URL จริง เช่น:

`https://lens-order-system-v2.vercel.app/customer`

ไปใส่ใน LINE Developers → LIFF → Endpoint URL

## 6) ขอบเขต MVP ปัจจุบัน

พร้อมแล้ว:
- LIFF initialization และ LINE Login
- สมัครร้านค้า
- รออนุมัติ
- Admin email/password login
- Admin dashboard
- Admin อนุมัติลูกค้า
- UI ชมพูพาสเทลตามภาพอ้างอิง

ยังไม่ทำ:
- Product/SKU จริง
- Cart/Checkout
- Payments
- Picking/Packing/Shipping
- Google Sheets sync
