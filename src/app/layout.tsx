import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Owner Membership | สมาชิกจองคอร์สเรียน",
  description:
    "ระบบสมัครสมาชิกและจองคอร์สเรียน The Owner Membership - พัฒนาทักษะธุรกิจและชีวิตครบทั้ง Mindset, Digital และ Health",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
