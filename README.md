# The Owner Membership

ระบบจัดการสมาชิกและคอร์สเรียนออนไลน์ (Membership & Course Management System) ที่ออกแบบมาเพื่อรองรับการลงทะเบียน การตรวจสอบสถานะ และการเข้าถึงเนื้อหาคอร์สเรียน

## 🌟 ฟีเจอร์หลัก (Key Features)

- **ระบบลงทะเบียน (Registration)**: ผู้ใช้สามารถลงทะเบียนพร้อมแนบสลิปโอนเงิน (Slip Upload) และกรอกข้อมูลส่วนตัว
- **ระบบตรวจสอบสถานะ (Status Check)**: ผู้ใช้สามารถค้นหาและตรวจสอบสถานะการอนุมัติการสมัครของตนเองได้
- **การเข้าสู่ระบบ (Authentication)**: ระบบล็อคอินสำหรับสมาชิกที่ได้รับการอนุมัติ
- **ระบบคอร์สเรียน (Course Showcase)**: แสดงรายการคอร์สเรียนและการจัดการข้อมูลคอร์สเรียน
- **รองรับ Responsive Design**: การแสดงผลที่สวยงามและใช้งานได้ดีทั้งบนเดสก์ท็อปและสมาร์ทโฟน

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Frontend**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Database/Backend**: [Supabase](https://supabase.com/)
- **Language**: TypeScript

## 🚀 การติดตั้งและการจำลองเซิร์ฟเวอร์ (Getting Started)

### ข้อกำหนดเบื้องต้น (Prerequisites)
- [Node.js](https://nodejs.org/) (เวอร์ชัน 18+ ขึ้นไป)
- บัญชี Supabase สำหรับการตั้งค่าฐานข้อมูล

### ขั้นตอนการติดตั้ง (Installation)

1. **โคลนโปรเจกต์ (Clone the repository)**
   ```bash
   git clone <ย้าย-url-ของ-repository-มาที่นี่>
   cd theowner-membership
   ```

2. **ติดตั้ง Dependencies**
   ```bash
   npm install 
   # หรือ yarn install, pnpm install
   ```

3. **ตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables)**  
   คัดลอกไฟล์ `.env.example` (ถ้ามี) เป็น `.env.local` และกำหนดค่า Environment Variables ที่จำเป็น:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ADMIN_PASSWORD=your-secure-admin-password
   ```

4. **รันเซิร์ฟเวอร์โหมดนักพัฒนา (Run Development Server)**
   ```bash
   npm run dev
   ```
   จากนั้นเปิด [http://localhost:3000](http://localhost:3000) บนเบราว์เซอร์เพื่อดูผลลัพธ์

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

- `src/app/` - ประกอบด้วยหน้าต่างๆ เช่น หน้าแรก (หน้าแนะนำคอร์ส), ลงทะเบียน, ตรวจสอบสถานะ, ล็อคอิน
- `src/app/actions.ts` - Server Actions สำหรับการจัดการฝั่งเซิร์ฟเวอร์ (เช่น การตรวจสอบรหัสผ่านแอดมิน)
- `src/lib/` - ฟังก์ชันช่วยเหลือเช่น `storage.ts` และ `types.ts` สำหรับการเชื่อมต่อ Database และจัดการ Type ต่างๆ

## 🌐 การนำเข้าระบบ (Deployment)

โปรเจกต์นี้รองรับการ Deploy ผ่านแพลตฟอร์มอย่าง [Vercel](https://vercel.com/) ได้อย่างง่ายดาย
1. พุชโค้ดไปยัง GitHub repository
2. เชื่อมต่อโปรเจกต์บน Vercel กับ Repository ของคุณ
3. กำหนดตัวแปร Environment Variables ต่างๆ บนหน้า Dashboard ให้เรียบร้อย
4. กดซิงค์การ Deployment
