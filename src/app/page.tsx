"use client";

import { useState, useEffect } from "react";
import { addMemberRegistration, getAllCourses, getAllMembers } from "@/lib/storage";
import type { Course } from "@/lib/types";

// Types and courses are now imported from @/lib/types and @/lib/storage

// ============================================
// Navbar Component
// ============================================
function Navbar({
  onNavigate,
  currentPage,
}: {
  onNavigate: (page: string) => void;
  currentPage: string;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="nav-wrapper">
      <div className="section-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "64px",
          }}
        >
          {/* Logo */}
          <div
            onClick={() => onNavigate("home")}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, var(--gold-500), var(--gold-300))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "1.1rem",
                color: "var(--navy-900)",
              }}
            >
              O
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: "1.1rem",
                letterSpacing: "0.05em",
              }}
            >
              THE <span className="gold-text">OWNER</span>
            </span>
          </div>

          {/* Desktop Nav removed - using Hamburger only */}

          {/* Hamburger Menu (Shown on all screens) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(201, 168, 76, 0.1)",
              border: "1px solid rgba(201, 168, 76, 0.3)",
              borderRadius: "8px",
              color: "var(--gold-500)",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              padding: "8px 16px",
            }}
          >
            {mobileMenuOpen ? "✕ ปิด" : "☰ เมนู"}
          </button>
        </div>

        {/* Dropdown menu */}
        {mobileMenuOpen && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              paddingBottom: "16px",
            }}
            className="animate-fade-in"
          >
            <button
              onClick={() => {
                onNavigate("home");
                setMobileMenuOpen(false);
              }}
              className="btn-secondary btn-sm"
            >
              หน้าแรก
            </button>
            <button
              onClick={() => {
                onNavigate("register");
                setMobileMenuOpen(false);
              }}
              className="btn-primary btn-sm"
            >
              สมัครสมาชิก
            </button>
            <button
              onClick={() => {
                onNavigate("status");
                setMobileMenuOpen(false);
              }}
              className="btn-secondary btn-sm"
            >
              ตรวจสอบสถานะ
            </button>
            <button
              onClick={() => {
                onNavigate("login");
                setMobileMenuOpen(false);
              }}
              className="btn-secondary btn-sm"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

// ============================================
// Hero Section Component
// ============================================
function HeroSection({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingTop: "80px",
      }}
    >
      <div className="section-container animate-fade-in-up">
        <div style={{ marginBottom: "16px" }}>
          <span className="badge badge-gold">Membership Program</span>
        </div>
        <h1
          style={{
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: "8px",
            letterSpacing: "-0.02em",
          }}
        >
          THE
        </h1>
        <h1
          className="gold-text"
          style={{
            fontSize: "clamp(3rem, 10vw, 6rem)",
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: "8px",
            letterSpacing: "-0.02em",
          }}
        >
          OWNER
        </h1>
        <h2
          style={{
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
            fontWeight: 300,
            color: "var(--text-secondary)",
            marginBottom: "24px",
            letterSpacing: "0.15em",
          }}
        >
          Membership
        </h2>

        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          เปลี่ยนคุณเป็น &apos;เจ้าของธุรกิจ&apos; ที่โลกจดจำ
          <br />
          พัฒนาครบทั้ง{" "}
          <span style={{ color: "var(--gold-400)", fontWeight: 600 }}>
            Mindset, Digital และ Health
          </span>{" "}
          ในที่เดียว
        </p>

        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => onNavigate("register")}
            className="btn-primary"
            style={{ minWidth: "180px" }}
          >
            ✨ สมัครสมาชิก
          </button>
          <button
            onClick={() => {
              document
                .getElementById("courses")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-secondary"
            style={{ minWidth: "180px" }}
          >
            ดูคอร์สเรียน
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Pricing Section Component
// ============================================
function PricingSection({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  return (
    <section style={{ padding: "80px 0" }}>
      <div className="section-container">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            className="gold-text"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, marginBottom: "12px" }}
          >
            เลือกแพ็กเกจของคุณ
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            เริ่มต้นการเปลี่ยนแปลงวันนี้
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          {/* Trial Package */}
          <div
            className="glass-card pricing-card animate-fade-in-up delay-100"
            style={{ padding: "36px 28px", textAlign: "center", display: "flex", flexDirection: "column" }}
          >
            <div style={{ marginBottom: "20px" }}>
              <span
                style={{
                  fontSize: "3rem",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                🎟️
              </span>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "4px" }}>
                บัตรทดลอง
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                ทดลองเรียนรายครั้ง
              </p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <span
                className="gold-text"
                style={{ fontSize: "3rem", fontWeight: 900 }}
              >
                150
              </span>
              <span style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
                {" "}
                บาท / ครั้ง
              </span>
            </div>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                marginBottom: "28px",
                textAlign: "left",
              }}
            >
              {[
                "เข้าคลาสได้ 1 ครั้ง",
                "เลือกเรียน Onsite หรือ Online",
                "พูดคุยในคอมมูนิตี้ในวันนั้น",
                "สัมผัสบรรยากาศการเรียนรู้จริง",
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    padding: "8px 0",
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "0.95rem",
                  }}
                >
                  <span style={{ color: "var(--gold-500)", minWidth: "16px" }}>✓</span>
                  <span style={{ flex: 1 }}>{item}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "auto", paddingTop: "20px" }}>
              <button
                onClick={() => onNavigate("register")}
                className="btn-secondary"
                style={{ width: "100%" }}
              >
                สมัครทดลอง
              </button>
            </div>
          </div>

          {/* 3-Month Package (Featured) */}
          <div
            className="glass-card pricing-card featured animate-fade-in-up delay-200 animate-pulse-glow"
            style={{ padding: "36px 28px", textAlign: "center", display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
              }}
            >
              <span
                className="badge"
                style={{
                  fontSize: "0.75rem",
                  padding: "6px 16px",
                  background: "linear-gradient(135deg, var(--gold-500), var(--gold-400))",
                  color: "var(--navy-900)",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(201, 168, 76, 0.3)",
                  fontWeight: "bold"
                }}
              >
                ⭐ แนะนำ
              </span>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <span
                style={{
                  fontSize: "3rem",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                👑
              </span>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "4px" }}>
                สมาชิก 3 เดือน
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                เข้าถึงทุกคอร์สไม่จำกัด
              </p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <span
                className="gold-text"
                style={{ fontSize: "3rem", fontWeight: 900 }}
              >
                600
              </span>
              <span style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
                {" "}
                บาท / 3 เดือน
              </span>
            </div>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                marginBottom: "28px",
                textAlign: "left",
              }}
            >
              {[
                "เข้าร่วมได้ทุกคลาส ตลอด 3 เดือน",
                "เข้าถึง Roadmap การเติบโตทั้ง 4 Tracks",
                "ระบบ Support & Networking",
                "เรียนได้ทั้ง Onsite และ Online",
                "สิทธิพิเศษในการร่วมกิจกรรมพิเศษ",
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    padding: "8px 0",
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "0.95rem",
                  }}
                >
                  <span style={{ color: "var(--gold-500)", minWidth: "16px" }}>✓</span>
                  <span style={{ flex: 1 }}>{item}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "auto", paddingTop: "20px" }}>
              <button
                onClick={() => onNavigate("register")}
                className="btn-primary"
                style={{ width: "100%" }}
              >
                ✨ สมัคร 3 เดือน
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Course Card Component
// ============================================
function CourseCard({ course }: { course: Course }) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              fontSize: "2.2rem",
              width: "56px",
              height: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "14px",
              background: "rgba(201, 168, 76, 0.08)",
            }}
          >
            {course.image}
          </div>
          <div>
            <h3
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                marginBottom: "2px",
              }}
            >
              {course.title}
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--gold-400)",
                fontWeight: 500,
              }}
            >
              {course.subtitle}
            </p>
          </div>
        </div>
        <span className={`badge ${course.mode === "online" ? "badge-online" : "badge-onsite"}`}>
          {course.mode === "online" ? "🌐 Online" : "📍 Onsite"}
        </span>
      </div>

      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
        {course.description}
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          fontSize: "0.85rem",
          color: "var(--text-muted)",
        }}
      >
        <span>📅 {course.date}</span>
        <span>🕐 {course.time}</span>
        <span>👤 {course.instructor}</span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "8px",
          borderTop: "1px solid rgba(201, 168, 76, 0.1)",
        }}
      >
        <div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            ที่นั่งเหลือ{" "}
          </span>
          <span
            style={{
              fontWeight: 700,
              color:
                course.spots <= 5 ? "var(--danger)" : "var(--success)",
            }}
          >
            {course.spots}/{course.maxSpots}
          </span>
        </div>
        <span
          style={{
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            fontStyle: "italic",
          }}
        >
          เข้าสู่ระบบเพื่อจอง
        </span>
      </div>
    </div>
  );
}

// ============================================
// Courses Section Component
// ============================================
function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    getAllCourses().then(setCourses);
  }, []);

  return (
    <section id="courses" style={{ padding: "80px 0" }}>
      <div className="section-container">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            className="gold-text"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, marginBottom: "12px" }}
          >
            คอร์สเรียนและกิจกรรม
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            เลือกเรียนรู้ในสิ่งที่จะเปลี่ยนแปลงชีวิตและธุรกิจของคุณ
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "20px",
          }}
        >
          {courses.map((course, i) => (
            <div
              key={course.id}
              className={`animate-fade-in-up delay-${(i + 1) * 100}`}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Register Page Component
// ============================================
function RegisterPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [selectedPlan, setSelectedPlan] = useState<"trial" | "3month">("3month");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlipFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSlipPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Save registration to Supabase
    await addMemberRegistration({
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email || undefined,
      plan: selectedPlan,
      slipImage: slipPreview, // base64 image
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "80px",
        }}
      >
        <div
          className="section-container animate-fade-in-up"
          style={{ textAlign: "center", maxWidth: "520px" }}
        >
          <div className="glass-card" style={{ padding: "48px 32px" }}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎉</div>
            <h2
              className="gold-text"
              style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "12px" }}
            >
              ส่งใบสมัครเรียบร้อย!
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                marginBottom: "8px",
              }}
            >
              ขอบคุณที่สมัครแพ็กเกจ{" "}
              <strong style={{ color: "var(--gold-400)" }}>
                {selectedPlan === "3month"
                  ? "สมาชิก 3 เดือน (600 บาท)"
                  : "บัตรทดลอง (150 บาท)"}
              </strong>
            </p>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                marginBottom: "32px",
              }}
            >
              แอดมินจะตรวจสอบสลิปและอนุมัติ
              <strong style={{ color: "var(--gold-400)" }}>
                {" "}
                รหัสสมาชิก (OWxxxx)
              </strong>{" "}
              ภายใน 24 ชั่วโมง กดปุ่ม &quot;ตรวจสอบสถานะ&quot; ด้านล่างเพื่อเช็คผลอนุมัติและรับรหัสสมาชิกครับ
            </p>

            <div
              style={{
                background: "rgba(201, 168, 76, 0.08)",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "28px",
                textAlign: "left",
                border: "1px solid rgba(201, 168, 76, 0.15)",
              }}
            >
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                📋 <strong>สรุปข้อมูลที่ส่ง:</strong>
              </p>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                ชื่อ: {formData.fullName}
              </p>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                เบอร์โทร: {formData.phone}
              </p>
              {formData.email && (
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                  อีเมล: {formData.email}
                </p>
              )}
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                สลิป: {slipFile ? "✅ แนบแล้ว" : "❌ ยังไม่แนบ"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => onNavigate("status")}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                🔍 ตรวจสอบสถานะ
              </button>
              <button
                onClick={() => onNavigate("home")}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                กลับหน้าแรก
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        minHeight: "100vh",
        paddingTop: "100px",
        paddingBottom: "60px",
      }}
    >
      <div className="section-container" style={{ maxWidth: "600px" }}>
        <div className="animate-fade-in-up">
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1
              className="gold-text"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.2rem)",
                fontWeight: 800,
                marginBottom: "8px",
              }}
            >
              สมัครสมาชิก
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              เลือกแพ็กเกจและกรอกข้อมูลเพื่อเริ่มต้น
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Plan Selection */}
            <div style={{ marginBottom: "28px" }}>
              <label className="input-label">เลือกแพ็กเกจ</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div
                  onClick={() => setSelectedPlan("3month")}
                  className="glass-card"
                  style={{
                    padding: "20px 16px",
                    textAlign: "center",
                    cursor: "pointer",
                    border:
                      selectedPlan === "3month"
                        ? "2px solid var(--gold-500)"
                        : "1px solid var(--glass-border)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                    👑
                  </div>
                  <div
                    style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px" }}
                  >
                    3 เดือน
                  </div>
                  <div
                    className="gold-text"
                    style={{ fontWeight: 800, fontSize: "1.5rem" }}
                  >
                    600 ฿
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      marginTop: "4px",
                    }}
                  >
                    จองทุกคอร์สไม่อั้น
                  </div>
                </div>

                <div
                  onClick={() => setSelectedPlan("trial")}
                  className="glass-card"
                  style={{
                    padding: "20px 16px",
                    textAlign: "center",
                    cursor: "pointer",
                    border:
                      selectedPlan === "trial"
                        ? "2px solid var(--gold-500)"
                        : "1px solid var(--glass-border)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                    🎟️
                  </div>
                  <div
                    style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px" }}
                  >
                    ทดลอง
                  </div>
                  <div
                    className="gold-text"
                    style={{ fontWeight: 800, fontSize: "1.5rem" }}
                  >
                    150 ฿
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      marginTop: "4px",
                    }}
                  >
                    จองได้ 1 คอร์ส
                  </div>
                </div>
              </div>
            </div>

            {/* Transfer Info */}
            <div
              className="glass-card"
              style={{
                padding: "20px",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "8px",
                }}
              >
                💳 โอนเงินมาที่
              </p>
              <p style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "4px" }}>
                ธนาคาร กสิกรไทย
              </p>
              <p
                className="gold-text"
                style={{
                  fontWeight: 800,
                  fontSize: "1.4rem",
                  letterSpacing: "0.1em",
                  marginBottom: "4px",
                }}
              >
                xxx-x-xxxxx-x
              </p>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                ชื่อ: The Owner
              </p>
              <p
                className="gold-text"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  marginTop: "8px",
                }}
              >
                {selectedPlan === "3month" ? "600" : "150"} บาท
              </p>
            </div>

            {/* Full Name */}
            <div style={{ marginBottom: "16px" }}>
              <label className="input-label" htmlFor="fullName">
                ชื่อ-นามสกุล <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                id="fullName"
                type="text"
                className="input-field"
                placeholder="กรอกชื่อ-นามสกุล"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: "16px" }}>
              <label className="input-label" htmlFor="phone">
                เบอร์โทรศัพท์ <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                id="phone"
                type="tel"
                className="input-field"
                placeholder="0xx-xxx-xxxx"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            {/* Email (Optional) */}
            <div style={{ marginBottom: "24px" }}>
              <label className="input-label" htmlFor="email">
                อีเมล{" "}
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  (ไม่บังคับ - ใช้สำหรับแจ้งเตือนในปฏิทิน)
                </span>
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* Slip Upload */}
            <div style={{ marginBottom: "32px" }}>
              <label className="input-label">
                แนบสลิปโอนเงิน{" "}
                <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <label htmlFor="slipUpload">
                <div
                  className={`upload-area ${slipFile ? "has-file" : ""}`}
                >
                  {slipPreview ? (
                    <div>
                      <img
                        src={slipPreview}
                        alt="สลิปโอนเงิน"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          borderRadius: "8px",
                          marginBottom: "12px",
                          objectFit: "contain",
                        }}
                      />
                      <p
                        style={{
                          color: "var(--success)",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                        }}
                      >
                        ✅ {slipFile?.name}
                      </p>
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.8rem",
                          marginTop: "4px",
                        }}
                      >
                        คลิกเพื่อเปลี่ยนรูป
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          fontSize: "2.5rem",
                          marginBottom: "8px",
                          opacity: 0.6,
                        }}
                      >
                        📎
                      </div>
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          marginBottom: "4px",
                        }}
                      >
                        คลิกเพื่ออัปโหลดสลิป
                      </p>
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.8rem",
                        }}
                      >
                        รองรับ JPG, PNG (ขนาดไม่เกิน 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </label>
              <input
                id="slipUpload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", padding: "16px", fontSize: "1.1rem" }}
            >
              ✨ ส่งใบสมัคร{" "}
              {selectedPlan === "3month"
                ? "(สมาชิก 3 เดือน)"
                : "(บัตรทดลอง)"}
            </button>

            <p
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                marginTop: "16px",
              }}
            >
              * แอดมินจะตรวจสอบสลิปและส่งรหัสสมาชิกให้ภายใน 24 ชม.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Login Page Component
// ============================================
function LoginPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [phone, setPhone] = useState("");
  const [memberCode, setMemberCode] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to member portal
    window.location.href = "/member";
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "80px",
      }}
    >
      <div className="section-container" style={{ maxWidth: "440px" }}>
        <div className="animate-fade-in-up">
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, var(--gold-500), var(--gold-300))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "1.8rem",
                color: "var(--navy-900)",
                margin: "0 auto 16px",
              }}
            >
              O
            </div>
            <h1
              className="gold-text"
              style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "8px" }}
            >
              เข้าสู่ระบบ
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              ใช้เบอร์โทรและรหัสสมาชิกเพื่อเข้าสู่ระบบ
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="glass-card" style={{ padding: "32px 24px" }}>
              {/* Phone */}
              <div style={{ marginBottom: "20px" }}>
                <label className="input-label" htmlFor="loginPhone">
                  เบอร์โทรศัพท์
                </label>
                <input
                  id="loginPhone"
                  type="tel"
                  className="input-field"
                  placeholder="0xx-xxx-xxxx"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Member Code */}
              <div style={{ marginBottom: "28px" }}>
                <label className="input-label" htmlFor="memberCode">
                  รหัสสมาชิก
                </label>
                <input
                  id="memberCode"
                  type="text"
                  className="input-field"
                  placeholder="OWxxxx"
                  required
                  value={memberCode}
                  onChange={(e) =>
                    setMemberCode(e.target.value.toUpperCase())
                  }
                  style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: "1.05rem",
                }}
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "24px",
              color: "var(--text-muted)",
              fontSize: "0.9rem",
            }}
          >
            ยังไม่มีรหัสสมาชิก?{" "}
            <span
              onClick={() => onNavigate("register")}
              style={{
                color: "var(--gold-500)",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              สมัครเลย
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Check Status Page Component
// ============================================
function CheckStatusPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<
    { fullName: string; plan: string; status: string; memberCode?: string; expiresAt?: string; note?: string; registeredAt: string }[]
  >([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const members = await getAllMembers();
    const found = members
      .filter((m) => m.phone.replace(/[\s-]/g, "") === phone.replace(/[\s-]/g, ""))
      .map((m) => ({
        fullName: m.fullName,
        plan: m.plan === "3month" ? "สมาชิก 3 เดือน (600 บาท)" : "บัตรทดลอง (150 บาท)",
        status: m.status,
        memberCode: m.memberCode,
        expiresAt: m.expiresAt,
        note: m.note,
        registeredAt: m.registeredAt,
      }));
    setResults(found);
    setSearched(true);
  };

  const statusConfig: Record<string, { label: string; icon: string; color: string; bg: string; border: string }> = {
    pending: {
      label: "กำลังตรวจสอบ",
      icon: "⏳",
      color: "var(--warning)",
      bg: "rgba(245, 158, 11, 0.1)",
      border: "rgba(245, 158, 11, 0.3)",
    },
    approved: {
      label: "อนุมัติแล้ว",
      icon: "✅",
      color: "var(--success)",
      bg: "rgba(34, 197, 94, 0.1)",
      border: "rgba(34, 197, 94, 0.3)",
    },
    expired: {
      label: "หมดอายุ",
      icon: "⏰",
      color: "var(--danger)",
      bg: "rgba(239, 68, 68, 0.1)",
      border: "rgba(239, 68, 68, 0.3)",
    },
    rejected: {
      label: "ถูกปฏิเสธ",
      icon: "❌",
      color: "var(--danger)",
      bg: "rgba(239, 68, 68, 0.1)",
      border: "rgba(239, 68, 68, 0.3)",
    },
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "80px",
        paddingBottom: "40px",
      }}
    >
      <div
        className="section-container animate-fade-in-up"
        style={{ maxWidth: "520px" }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, var(--gold-500), var(--gold-300))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 16px",
            }}
          >
            🔍
          </div>
          <h1
            className="gold-text"
            style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "8px" }}
          >
            ตรวจสอบสถานะ
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            กรอกเบอร์โทรที่ใช้สมัครเพื่อเช็คสถานะการอนุมัติ
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch}>
          <div className="glass-card" style={{ padding: "28px 24px" }}>
            <label className="input-label" htmlFor="statusPhone">
              เบอร์โทรศัพท์
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                id="statusPhone"
                type="tel"
                className="input-field"
                placeholder="0xx-xxx-xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: "12px 28px", whiteSpace: "nowrap" }}
              >
                🔍 ค้นหา
              </button>
            </div>
          </div>
        </form>

        {/* Results */}
        {searched && (
          <div
            className="animate-fade-in-up"
            style={{ marginTop: "20px" }}
          >
            {results.length === 0 ? (
              <div
                className="glass-card"
                style={{ padding: "40px 24px", textAlign: "center" }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "12px", opacity: 0.5 }}>
                  📭
                </div>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "1rem",
                    marginBottom: "20px",
                  }}
                >
                  ไม่พบข้อมูลการสมัครจากเบอร์นี้
                </p>
                <button
                  onClick={() => onNavigate("register")}
                  className="btn-primary"
                >
                  สมัครสมาชิกเลย
                </button>
              </div>
            ) : (
              results.map((r, i) => {
                const sc = statusConfig[r.status] || statusConfig.pending;
                return (
                  <div
                    key={i}
                    className="glass-card"
                    style={{
                      padding: "28px 24px",
                      marginBottom: "12px",
                      border: `1px solid ${sc.border}`,
                    }}
                  >
                    {/* Status Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "20px",
                      }}
                    >
                      <div>
                        <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "2px" }}>
                          {r.fullName}
                        </h3>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          {r.plan}
                        </span>
                      </div>
                      <span
                        style={{
                          padding: "6px 16px",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                        }}
                      >
                        {sc.icon} {sc.label}
                      </span>
                    </div>

                    {/* Approved: Show Member Code */}
                    {r.status === "approved" && r.memberCode && (
                      <div
                        style={{
                          background: "linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(201, 168, 76, 0.05))",
                          border: "1px solid rgba(201, 168, 76, 0.3)",
                          borderRadius: "16px",
                          padding: "24px",
                          textAlign: "center",
                          marginBottom: "16px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--text-muted)",
                            marginBottom: "8px",
                          }}
                        >
                          🔑 รหัสสมาชิกของคุณ
                        </p>
                        <p
                          className="gold-text"
                          style={{
                            fontSize: "2.5rem",
                            fontWeight: 900,
                            letterSpacing: "0.1em",
                            marginBottom: "8px",
                          }}
                        >
                          {r.memberCode}
                        </p>
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          ใช้รหัสนี้ร่วมกับเบอร์โทรเพื่อเข้าสู่ระบบ
                        </p>
                      </div>
                    )}

                    {/* Pending Message */}
                    {r.status === "pending" && (
                      <div
                        style={{
                          background: "rgba(245, 158, 11, 0.08)",
                          border: "1px solid rgba(245, 158, 11, 0.2)",
                          borderRadius: "12px",
                          padding: "16px",
                          marginBottom: "16px",
                        }}
                      >
                        <p style={{ fontSize: "0.9rem", color: "var(--warning)" }}>
                          ⏳ แอดมินกำลังตรวจสอบสลิปของคุณอยู่ครับ กรุณารอสักครู่...
                        </p>
                      </div>
                    )}

                    {/* Rejected Message */}
                    {r.status === "rejected" && (
                      <div
                        style={{
                          background: "rgba(239, 68, 68, 0.08)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          borderRadius: "12px",
                          padding: "16px",
                          marginBottom: "16px",
                        }}
                      >
                        <p style={{ fontSize: "0.9rem", color: "var(--danger)", marginBottom: "8px" }}>
                          ❌ การสมัครถูกปฏิเสธ
                        </p>
                        {r.note && (
                          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            เหตุผล: {r.note}
                          </p>
                        )}
                        <button
                          onClick={() => onNavigate("register")}
                          className="btn-primary btn-sm"
                          style={{ marginTop: "12px" }}
                        >
                          สมัครใหม่อีกครั้ง
                        </button>
                      </div>
                    )}

                    {/* Expired Message */}
                    {r.status === "expired" && (
                      <div
                        style={{
                          background: "rgba(239, 68, 68, 0.08)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          borderRadius: "12px",
                          padding: "16px",
                          marginBottom: "16px",
                        }}
                      >
                        <p style={{ fontSize: "0.9rem", color: "var(--danger)", marginBottom: "8px" }}>
                          ⏰ บัตรสมาชิกของคุณหมดอายุแล้ว
                        </p>
                        <button
                          onClick={() => onNavigate("register")}
                          className="btn-primary btn-sm"
                          style={{ marginTop: "8px" }}
                        >
                          ต่ออายุสมาชิก
                        </button>
                      </div>
                    )}

                    {/* Detail Rows */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          background: "rgba(10, 22, 40, 0.6)",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                        }}
                      >
                        <span style={{ color: "var(--text-muted)" }}>📅 สมัครเมื่อ</span>
                        <span style={{ fontWeight: 600 }}>{formatDate(r.registeredAt)}</span>
                      </div>
                      {r.expiresAt && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            background: "rgba(10, 22, 40, 0.6)",
                            borderRadius: "8px",
                            fontSize: "0.85rem",
                          }}
                        >
                          <span style={{ color: "var(--text-muted)" }}>⏰ หมดอายุ</span>
                          <span
                            style={{
                              fontWeight: 600,
                              color:
                                new Date(r.expiresAt) < new Date()
                                  ? "var(--danger)"
                                  : "var(--success)",
                            }}
                          >
                            {formatDate(r.expiresAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tip */}
        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
          }}
        >
          ยังไม่ได้สมัคร?{" "}
          <span
            onClick={() => onNavigate("register")}
            style={{ color: "var(--gold-500)", cursor: "pointer", fontWeight: 600 }}
          >
            สมัครเลย
          </span>
          {" "}|{" "}
          <span
            onClick={() => onNavigate("login")}
            style={{ color: "var(--gold-500)", cursor: "pointer", fontWeight: 600 }}
          >
            เข้าสู่ระบบ
          </span>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Footer Component
// ============================================
function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(201, 168, 76, 0.1)",
        padding: "40px 0",
        textAlign: "center",
      }}
    >
      <div className="section-container">
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            marginBottom: "8px",
          }}
        >
          © 2026 The Owner Membership. All rights reserved.
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
          ติดต่อสอบถาม: Line @theowner
        </p>
      </div>
    </footer>
  );
}

// ============================================
// Main App (Page Router)
// ============================================
export default function Home() {
  const [currentPage, setCurrentPage] = useState("home");

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar onNavigate={navigateTo} currentPage={currentPage} />

      {currentPage === "home" && (
        <>
          <HeroSection onNavigate={navigateTo} />
          <PricingSection onNavigate={navigateTo} />
          <CoursesSection />
        </>
      )}

      {currentPage === "register" && (
        <RegisterPage onNavigate={navigateTo} />
      )}

      {currentPage === "login" && (
        <LoginPage onNavigate={navigateTo} />
      )}

      {currentPage === "status" && (
        <CheckStatusPage onNavigate={navigateTo} />
      )}

      <Footer />
    </>
  );
}
