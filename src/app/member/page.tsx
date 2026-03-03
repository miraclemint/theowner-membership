"use client";

import { useState, useEffect, useCallback } from "react";
import type { MemberRegistration, Course, Booking } from "@/lib/types";
import {
    getMemberByCodeAndPhone,
    getAllCourses,
    getBookingsByMember,
    getCourseById,
    addBooking,
    cancelBooking
} from "@/lib/storage";

// ============================================
// Login Section
// ============================================
function MemberLogin({ onLogin }: { onLogin: (member: MemberRegistration) => void }) {
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const member = await getMemberByCodeAndPhone(code, phone);
            if (member) {
                onLogin(member);
            } else {
                setError("เบอร์โทรหรือรหัสสมาชิกไม่ถูกต้อง หรือยังไม่ได้รับการอนุมัติ");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ maxWidth: "440px", width: "100%", padding: "0 20px" }}>
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
                            เข้าสู่ระบบสมาชิก
                        </h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                            ใช้เบอร์โทรและรหัสสมาชิกเพื่อเข้าสู่ระบบ
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="glass-card" style={{ padding: "32px 24px" }}>
                            <div style={{ marginBottom: "20px" }}>
                                <label className="input-label" htmlFor="memberPhone">
                                    เบอร์โทรศัพท์
                                </label>
                                <input
                                    id="memberPhone"
                                    type="tel"
                                    className="input-field"
                                    placeholder="0xx-xxx-xxxx"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    autoFocus
                                />
                            </div>

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
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
                                />
                            </div>

                            {error && (
                                <div
                                    style={{
                                        background: "rgba(239, 68, 68, 0.1)",
                                        border: "1px solid rgba(239, 68, 68, 0.3)",
                                        borderRadius: "8px",
                                        padding: "10px 16px",
                                        marginBottom: "16px",
                                        color: "var(--danger)",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    ❌ {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ width: "100%", padding: "16px", fontSize: "1.05rem" }}
                                disabled={loading}
                            >
                                {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
                            </button>
                        </div>
                    </form>

                    <div
                        style={{
                            textAlign: "center",
                            marginTop: "20px",
                            color: "var(--text-muted)",
                            fontSize: "0.85rem",
                        }}
                    >
                        ยังไม่มีรหัสสมาชิก?{" "}
                        <a href="/" style={{ color: "var(--gold-500)", fontWeight: 600 }}>
                            สมัครเลย
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================
// Google Calendar Link Generator
// ============================================
function generateCalendarLink(course: Course): string {
    // Parse Thai date roughly
    const year = "2026";
    const dateStr = course.date;
    const [startTime] = course.time.split(" - ");
    const [startH, startM] = startTime.split(":");
    const [endTime] = course.time.split(" - ").slice(1);
    const [endH, endM] = endTime ? endTime.split(":") : [startH, startM];

    // Build approximate ISO dates for Google Calendar
    const monthMap: Record<string, string> = {
        "ม.ค.": "01", "ก.พ.": "02", "มี.ค.": "03", "เม.ย.": "04",
        "พ.ค.": "05", "มิ.ย.": "06", "ก.ค.": "07", "ส.ค.": "08",
        "ก.ย.": "09", "ต.ค.": "10", "พ.ย.": "11", "ธ.ค.": "12",
    };

    let month = "03";
    let day = "15";
    for (const [key, val] of Object.entries(monthMap)) {
        if (dateStr.includes(key)) {
            month = val;
            // Extract day
            const dayMatch = dateStr.match(/(\d+)/);
            if (dayMatch) day = dayMatch[1].padStart(2, "0");
            break;
        }
    }

    const start = `${year}${month}${day}T${(startH || "00").trim().padStart(2, "0")}${(startM || "00").trim().padStart(2, "0")}00`;
    const end = `${year}${month}${day}T${(endH || "00").trim().padStart(2, "0")}${(endM || "00").trim().padStart(2, "0")}00`;

    const title = encodeURIComponent(`[The Owner] ${course.title} - ${course.subtitle}`);
    const details = encodeURIComponent(
        `คอร์ส: ${course.title}\n${course.subtitle}\n\nวิทยากร: ${course.instructor}\nรูปแบบ: ${course.mode === "online" ? "Online" : "Onsite"}\n\nรายละเอียด: ${course.description}`
    );
    const location = encodeURIComponent(course.mode === "online" ? "Online / Zoom" : "The Owner Studio");

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&ctz=Asia/Bangkok`;
}

// ============================================
// Booking Confirmation Modal
// ============================================
function BookingModal({
    course,
    onClose,
    onBook,
}: {
    course: Course;
    onClose: () => void;
    onBook: (courseId: string) => void;
}) {
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
            }}
            onClick={onClose}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(8px)",
                }}
            />
            <div
                className="glass-card animate-fade-in-up"
                style={{
                    position: "relative",
                    maxWidth: "480px",
                    width: "100%",
                    padding: "32px 24px",
                    border: "1px solid rgba(201, 168, 76, 0.3)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                    }}
                >
                    ✕
                </button>

                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "8px" }}>{course.image}</div>
                    <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "4px" }}>
                        {course.title}
                    </h2>
                    <p style={{ fontSize: "0.9rem", color: "var(--gold-400)" }}>
                        {course.subtitle}
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        marginBottom: "24px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px 14px",
                            background: "rgba(10, 22, 40, 0.6)",
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                        }}
                    >
                        <span style={{ color: "var(--text-muted)" }}>📅 วันที่</span>
                        <span style={{ fontWeight: 600 }}>{course.date}</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px 14px",
                            background: "rgba(10, 22, 40, 0.6)",
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                        }}
                    >
                        <span style={{ color: "var(--text-muted)" }}>🕐 เวลา</span>
                        <span style={{ fontWeight: 600 }}>{course.time}</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px 14px",
                            background: "rgba(10, 22, 40, 0.6)",
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                        }}
                    >
                        <span style={{ color: "var(--text-muted)" }}>📍 รูปแบบ</span>
                        <span style={{ fontWeight: 600 }}>
                            {course.mode === "online" ? "🌐 Online" : "📍 Onsite"}
                        </span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px 14px",
                            background: "rgba(10, 22, 40, 0.6)",
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                        }}
                    >
                        <span style={{ color: "var(--text-muted)" }}>💺 ที่นั่งเหลือ</span>
                        <span
                            style={{
                                fontWeight: 700,
                                color: course.spots <= 5 ? "var(--danger)" : "var(--success)",
                            }}
                        >
                            {course.spots}/{course.maxSpots}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => onBook(course.id)}
                    className="btn-primary"
                    style={{ width: "100%", padding: "16px", fontSize: "1.05rem" }}
                    disabled={course.spots <= 0}
                >
                    {course.spots <= 0 ? "คอร์สเต็มแล้ว" : "✅ ยืนยันจอง"}
                </button>
            </div>
        </div>
    );
}

// ============================================
// Booking Success Modal
// ============================================
function BookingSuccessModal({
    course,
    onClose,
}: {
    course: Course;
    onClose: () => void;
}) {
    const calendarLink = generateCalendarLink(course);

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
            }}
            onClick={onClose}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(8px)",
                }}
            />
            <div
                className="glass-card animate-fade-in-up"
                style={{
                    position: "relative",
                    maxWidth: "450px",
                    width: "100%",
                    padding: "40px 28px",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    textAlign: "center",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ fontSize: "4rem", marginBottom: "12px" }}>🎉</div>
                <h2
                    className="gold-text"
                    style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px" }}
                >
                    จองสำเร็จแล้ว!
                </h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
                    คุณได้จองคอร์ส <strong style={{ color: "var(--gold-400)" }}>{course.title}</strong>
                    <br />
                    📅 {course.date} 🕐 {course.time}
                </p>

                {/* Add to Google Calendar */}
                <a
                    href={calendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                        display: "block",
                        width: "100%",
                        padding: "14px",
                        textDecoration: "none",
                        marginBottom: "12px",
                        background: "linear-gradient(135deg, #4285f4, #1a73e8)",
                    }}
                >
                    📅 + เพิ่มลง Google Calendar
                </a>

                <button
                    onClick={onClose}
                    className="btn-secondary"
                    style={{ width: "100%", padding: "14px" }}
                >
                    ปิด
                </button>
            </div>
        </div>
    );
}

// ============================================
// Member Dashboard
// ============================================
function MemberDashboard({
    member,
    onLogout,
}: {
    member: MemberRegistration;
    onLogout: () => void;
}) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [tab, setTab] = useState<"courses" | "bookings">("courses");
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [successCourse, setSuccessCourse] = useState<Course | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const loadData = useCallback(async () => {
        setCourses(await getAllCourses());
        setBookings(await getBookingsByMember(member.id));
    }, [member.id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleBook = async (courseId: string) => {
        const result = await addBooking(member.id, courseId);
        setSelectedCourse(null);
        if (result.success) {
            const course = await getCourseById(courseId);
            setSuccessCourse(course || null);
            loadData();
        } else {
            showToast(`❌ ${result.message}`, "error");
        }
    };

    const handleCancel = async (bookingId: string) => {
        if (confirm("ต้องการยกเลิกการจองนี้ใช่มั้ย?")) {
            await cancelBooking(bookingId);
            showToast("ยกเลิกการจองเรียบร้อย", "success");
            loadData();
        }
    };

    const isExpired = member.plan === "3month" && member.expiresAt
        ? new Date(member.expiresAt) < new Date()
        : false;
    const daysLeft = member.expiresAt
        ? Math.max(0, Math.ceil((new Date(member.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : null;
    const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
    const trialUsed = member.plan === "trial" && confirmedBookings.length >= 1;

    return (
        <div style={{ minHeight: "100vh", paddingBottom: "60px" }}>
            {/* Toast */}
            {toast && (
                <div
                    className="animate-fade-in"
                    style={{
                        position: "fixed",
                        top: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 300,
                        padding: "14px 28px",
                        borderRadius: "12px",
                        background:
                            toast.type === "success"
                                ? "rgba(34, 197, 94, 0.15)"
                                : "rgba(239, 68, 68, 0.15)",
                        border: `1px solid ${toast.type === "success" ? "rgba(34, 197, 94, 0.4)" : "rgba(239, 68, 68, 0.4)"
                            }`,
                        color: toast.type === "success" ? "var(--success)" : "var(--danger)",
                        fontWeight: 600,
                        backdropFilter: "blur(20px)",
                        fontSize: "0.95rem",
                        maxWidth: "90vw",
                        textAlign: "center",
                    }}
                >
                    {toast.message}
                </div>
            )}

            {/* Navbar */}
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
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                                    fontSize: "1rem",
                                    color: "var(--navy-900)",
                                }}
                            >
                                {member.fullName.charAt(0)}
                            </div>
                            <div>
                                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                                    {member.fullName}
                                </span>
                                <span
                                    style={{
                                        display: "block",
                                        fontSize: "0.7rem",
                                        color: "var(--gold-400)",
                                        fontWeight: 600,
                                    }}
                                >
                                    {member.memberCode}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <a
                                href="/"
                                className="btn-secondary btn-sm"
                                style={{ textDecoration: "none" }}
                            >
                                🏠
                            </a>
                            <button
                                onClick={onLogout}
                                className="btn-sm"
                                style={{
                                    padding: "8px 16px",
                                    background: "rgba(239, 68, 68, 0.15)",
                                    border: "1px solid rgba(239, 68, 68, 0.3)",
                                    color: "var(--danger)",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    fontSize: "0.875rem",
                                }}
                            >
                                ออก
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="section-container" style={{ paddingTop: "88px" }}>
                {/* Member Info Card */}
                <div
                    className="glass-card animate-fade-in-up"
                    style={{
                        padding: "24px",
                        marginBottom: "24px",
                        background: "linear-gradient(135deg, rgba(201, 168, 76, 0.08), rgba(10, 22, 40, 0.8))",
                        border: "1px solid rgba(201, 168, 76, 0.2)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            flexWrap: "wrap",
                            gap: "12px",
                        }}
                    >
                        <div>
                            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "4px" }}>
                                สวัสดี, <span className="gold-text">{member.fullName}</span> 👋
                            </h1>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                {member.plan === "3month"
                                    ? "สมาชิก 3 เดือน 👑"
                                    : "บัตรทดลอง 🎟️"}
                                {" · "}
                                <span style={{ color: "var(--gold-400)", fontWeight: 600 }}>
                                    {member.memberCode}
                                </span>
                            </p>
                        </div>

                        {member.plan === "3month" && daysLeft !== null && (
                            <div
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "12px",
                                    background: isExpired
                                        ? "rgba(239, 68, 68, 0.1)"
                                        : daysLeft <= 14
                                            ? "rgba(245, 158, 11, 0.1)"
                                            : "rgba(34, 197, 94, 0.1)",
                                    border: `1px solid ${isExpired
                                        ? "rgba(239, 68, 68, 0.3)"
                                        : daysLeft <= 14
                                            ? "rgba(245, 158, 11, 0.3)"
                                            : "rgba(34, 197, 94, 0.3)"
                                        }`,
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "1.5rem",
                                        fontWeight: 900,
                                        color: isExpired
                                            ? "var(--danger)"
                                            : daysLeft <= 14
                                                ? "var(--warning)"
                                                : "var(--success)",
                                    }}
                                >
                                    {isExpired ? "หมดอายุ" : `${daysLeft} วัน`}
                                </div>
                                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                    {isExpired ? "กรุณาต่ออายุ" : "เหลืออีก"}
                                </div>
                            </div>
                        )}

                        {member.plan === "trial" && (
                            <div
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "12px",
                                    background: trialUsed
                                        ? "rgba(245, 158, 11, 0.1)"
                                        : "rgba(34, 197, 94, 0.1)",
                                    border: `1px solid ${trialUsed ? "rgba(245, 158, 11, 0.3)" : "rgba(34, 197, 94, 0.3)"
                                        }`,
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "1.2rem",
                                        fontWeight: 900,
                                        color: trialUsed ? "var(--warning)" : "var(--success)",
                                    }}
                                >
                                    {trialUsed ? "ใช้แล้ว" : "พร้อมจอง"}
                                </div>
                                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                    สิทธิ์ 1 คอร์ส
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tab Navigation */}
                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "20px",
                    }}
                >
                    <button
                        onClick={() => setTab("courses")}
                        className={tab === "courses" ? "btn-primary" : "btn-secondary"}
                        style={{ flex: 1, padding: "12px" }}
                    >
                        📚 คอร์สเรียน ({courses.length})
                    </button>
                    <button
                        onClick={() => setTab("bookings")}
                        className={tab === "bookings" ? "btn-primary" : "btn-secondary"}
                        style={{ flex: 1, padding: "12px", position: "relative" }}
                    >
                        🎫 การจองของฉัน ({confirmedBookings.length})
                        {confirmedBookings.length > 0 && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: "-6px",
                                    right: "-6px",
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    background: "var(--success)",
                                    color: "white",
                                    fontSize: "0.7rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                }}
                            >
                                {confirmedBookings.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Tab Content: Courses */}
                {tab === "courses" && (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                            gap: "16px",
                        }}
                    >
                        {courses.map((course) => {
                            const isBooked = bookings.some(
                                (b) => b.courseId === course.id && b.status === "confirmed"
                            );
                            const canBook = !isBooked && !isExpired && !trialUsed && course.spots > 0;

                            return (
                                <div
                                    key={course.id}
                                    className="glass-card"
                                    style={{
                                        padding: "20px",
                                        opacity: isBooked ? 0.7 : 1,
                                        border: isBooked ? "1px solid rgba(34, 197, 94, 0.3)" : undefined,
                                    }}
                                >
                                    {/* Header */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            marginBottom: "12px",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div
                                                style={{
                                                    fontSize: "2rem",
                                                    width: "48px",
                                                    height: "48px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: "12px",
                                                    background: "rgba(201, 168, 76, 0.08)",
                                                }}
                                            >
                                                {course.image}
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                                                    {course.title}
                                                </h3>
                                                <p style={{ fontSize: "0.8rem", color: "var(--gold-400)" }}>
                                                    {course.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`badge ${course.mode === "online" ? "badge-online" : "badge-onsite"
                                                }`}
                                        >
                                            {course.mode === "online" ? "🌐" : "📍"}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "16px",
                                            flexWrap: "wrap",
                                            fontSize: "0.8rem",
                                            color: "var(--text-muted)",
                                            marginBottom: "14px",
                                        }}
                                    >
                                        <span>📅 {course.date}</span>
                                        <span>🕐 {course.time}</span>
                                        <span>👤 {course.instructor}</span>
                                    </div>

                                    {/* Spots + Action */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            paddingTop: "10px",
                                            borderTop: "1px solid rgba(201, 168, 76, 0.1)",
                                        }}
                                    >
                                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                            ที่นั่ง{" "}
                                            <strong
                                                style={{
                                                    color: course.spots <= 5 ? "var(--danger)" : "var(--success)",
                                                }}
                                            >
                                                {course.spots}/{course.maxSpots}
                                            </strong>
                                        </span>

                                        {isBooked ? (
                                            <span
                                                style={{
                                                    fontSize: "0.85rem",
                                                    color: "var(--success)",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                ✅ จองแล้ว
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => canBook && setSelectedCourse(course)}
                                                className={canBook ? "btn-primary btn-sm" : "btn-sm"}
                                                style={{
                                                    opacity: canBook ? 1 : 0.5,
                                                    cursor: canBook ? "pointer" : "not-allowed",
                                                    background: canBook ? undefined : "rgba(255,255,255,0.05)",
                                                    border: canBook ? undefined : "1px solid rgba(255,255,255,0.1)",
                                                    color: canBook ? undefined : "var(--text-muted)",
                                                }}
                                                disabled={!canBook}
                                            >
                                                {course.spots <= 0
                                                    ? "เต็ม"
                                                    : isExpired
                                                        ? "หมดอายุ"
                                                        : trialUsed
                                                            ? "ครบสิทธิ์"
                                                            : "จองเลย"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Tab Content: My Bookings */}
                {tab === "bookings" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {bookings.length === 0 ? (
                            <div
                                className="glass-card"
                                style={{ padding: "48px", textAlign: "center" }}
                            >
                                <div style={{ fontSize: "3rem", marginBottom: "12px", opacity: 0.5 }}>
                                    🎫
                                </div>
                                <p style={{ color: "var(--text-muted)" }}>
                                    ยังไม่มีการจอง กดปุ่ม &quot;คอร์สเรียน&quot; เพื่อจองคอร์สแรกของคุณ
                                </p>
                            </div>
                        ) : (
                            bookings.map((booking) => {
                                const course = courses.find((c) => c.id === booking.courseId);
                                if (!course) return null;
                                const isCancelled = booking.status === "cancelled";
                                const calLink = generateCalendarLink(course);

                                return (
                                    <div
                                        key={booking.id}
                                        className="glass-card"
                                        style={{
                                            padding: "20px",
                                            opacity: isCancelled ? 0.5 : 1,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                marginBottom: "12px",
                                                flexWrap: "wrap",
                                                gap: "8px",
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <div
                                                    style={{
                                                        fontSize: "1.8rem",
                                                        width: "44px",
                                                        height: "44px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        borderRadius: "10px",
                                                        background: isCancelled
                                                            ? "rgba(239, 68, 68, 0.08)"
                                                            : "rgba(34, 197, 94, 0.08)",
                                                    }}
                                                >
                                                    {course.image}
                                                </div>
                                                <div>
                                                    <h3
                                                        style={{
                                                            fontSize: "1rem",
                                                            fontWeight: 700,
                                                            textDecoration: isCancelled ? "line-through" : "none",
                                                        }}
                                                    >
                                                        {course.title}
                                                    </h3>
                                                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                                        📅 {course.date} · 🕐 {course.time}
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                style={{
                                                    padding: "4px 12px",
                                                    borderRadius: "20px",
                                                    fontSize: "0.75rem",
                                                    fontWeight: 700,
                                                    background: isCancelled
                                                        ? "rgba(239, 68, 68, 0.1)"
                                                        : "rgba(34, 197, 94, 0.1)",
                                                    color: isCancelled ? "var(--danger)" : "var(--success)",
                                                    border: `1px solid ${isCancelled
                                                        ? "rgba(239, 68, 68, 0.3)"
                                                        : "rgba(34, 197, 94, 0.3)"
                                                        }`,
                                                }}
                                            >
                                                {isCancelled ? "❌ ยกเลิกแล้ว" : "✅ ยืนยันแล้ว"}
                                            </span>
                                        </div>

                                        {!isCancelled && (
                                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                                <a
                                                    href={calLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-sm"
                                                    style={{
                                                        textDecoration: "none",
                                                        background: "rgba(66, 133, 244, 0.15)",
                                                        border: "1px solid rgba(66, 133, 244, 0.3)",
                                                        color: "#4285f4",
                                                        padding: "6px 14px",
                                                        borderRadius: "8px",
                                                        fontSize: "0.8rem",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    📅 เพิ่มลงปฏิทิน
                                                </a>
                                                <button
                                                    onClick={() => handleCancel(booking.id)}
                                                    style={{
                                                        padding: "6px 14px",
                                                        borderRadius: "8px",
                                                        fontSize: "0.8rem",
                                                        background: "rgba(239, 68, 68, 0.1)",
                                                        border: "1px solid rgba(239, 68, 68, 0.3)",
                                                        color: "var(--danger)",
                                                        cursor: "pointer",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    ยกเลิก
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Booking Confirmation Modal */}
            {selectedCourse && (
                <BookingModal
                    course={selectedCourse}
                    onClose={() => setSelectedCourse(null)}
                    onBook={handleBook}
                />
            )}

            {/* Booking Success Modal */}
            {successCourse && (
                <BookingSuccessModal
                    course={successCourse}
                    onClose={() => setSuccessCourse(null)}
                />
            )}
        </div>
    );
}

// ============================================
// Member Page Entry (Route: /member)
// ============================================
export default function MemberPage() {
    const [member, setMember] = useState<MemberRegistration | null>(null);

    return (
        <>
            {!member ? (
                <MemberLogin onLogin={(m) => setMember(m)} />
            ) : (
                <MemberDashboard member={member} onLogout={() => setMember(null)} />
            )}
        </>
    );
}
