"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type {
    MemberRegistration,
    MemberStatus,
    Course,
    Booking,
} from "@/lib/types";
import {
    getAllMembers,
    getAllCourses,
    approveMember,
    rejectMember,
    addCourse,
    updateCourse,
    deleteCourse,
    getAllBookings,
    terminateMember
} from "@/lib/storage";
import { verifyAdminPasswordSecure } from "@/app/actions";

// ============================================
// Admin Login
// ============================================
function AdminLogin({ onLogin }: { onLogin: () => void }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const isValid = await verifyAdminPasswordSecure(password);
            if (isValid) {
                onLogin();
            } else {
                setError("รหัสผ่านไม่ถูกต้อง");
            }
        } catch {
            setError("เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน");
        }
        setLoading(false);
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
            <div style={{ maxWidth: "420px", width: "100%", padding: "0 20px" }}>
                <div className="animate-fade-in-up" style={{ textAlign: "center" }}>
                    <div
                        style={{
                            width: "72px",
                            height: "72px",
                            borderRadius: "18px",
                            background: "linear-gradient(135deg, #ef4444, #dc2626)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "2rem",
                            margin: "0 auto 20px",
                        }}
                    >
                        🔐
                    </div>
                    <h1
                        className="gold-text"
                        style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "8px" }}
                    >
                        Admin Panel
                    </h1>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "0.95rem" }}>
                        เข้าสู่ระบบจัดการ The Owner Membership
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="glass-card" style={{ padding: "32px 24px" }}>
                            <div style={{ marginBottom: "20px" }}>
                                <label className="input-label" htmlFor="adminPw">
                                    รหัสผ่านแอดมิน
                                </label>
                                <input
                                    id="adminPw"
                                    type="password"
                                    className="input-field"
                                    placeholder="กรอกรหัสผ่าน"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoFocus
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
                                style={{ width: "100%", padding: "14px" }}
                                disabled={loading}
                            >
                                {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
                            </button>
                        </div>
                    </form>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "20px" }}>
                        💡 รหัสผ่านเริ่มต้น: <code style={{ color: "var(--gold-400)" }}>theowner2026</code>
                    </p>
                </div>
            </div>
        </section>
    );
}

// ============================================
// Shared Components
// ============================================
function StatCard({ label, value, icon, color, sub }: {
    label: string; value: number | string; icon: string; color: string; sub?: string;
}) {
    return (
        <div className="glass-card" style={{ padding: "18px 16px", textAlign: "center" }}>
            <div style={{ fontSize: "1.6rem", marginBottom: "4px" }}>{icon}</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color, marginBottom: "2px" }}>
                {value}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{label}</div>
            {sub && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>{sub}</div>}
        </div>
    );
}

function StatusBadge({ status }: { status: MemberStatus }) {
    const config: Record<MemberStatus, { label: string; bg: string; color: string; border: string }> = {
        pending: { label: "🟡 รอดำเนินการ", bg: "rgba(245, 158, 11, 0.1)", color: "var(--warning)", border: "rgba(245, 158, 11, 0.3)" },
        approved: { label: "🟢 อนุมัติแล้ว", bg: "rgba(34, 197, 94, 0.1)", color: "var(--success)", border: "rgba(34, 197, 94, 0.3)" },
        expired: { label: "🔴 หมดอายุ", bg: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", border: "rgba(239, 68, 68, 0.3)" },
        rejected: { label: "⛔ ปฏิเสธ", bg: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", border: "rgba(239, 68, 68, 0.3)" },
    };
    const c = config[status];
    return (
        <span style={{
            display: "inline-block", padding: "4px 14px", borderRadius: "20px",
            fontSize: "0.8rem", fontWeight: 700, background: c.bg, color: c.color,
            border: `1px solid ${c.border}`, marginTop: "8px",
        }}>
            {c.label}
        </span>
    );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 14px", background: "rgba(10, 22, 40, 0.6)", borderRadius: "10px",
            flexWrap: "wrap", gap: "8px",
        }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{label}</span>
            <span style={{
                fontSize: "0.9rem", fontWeight: 600,
                color: highlight ? "var(--gold-400)" : "var(--text-primary)",
            }}>
                {value}
            </span>
        </div>
    );
}

// ============================================
// Member Detail Modal
// ============================================
function MemberDetailModal({
    member, onClose, onApprove, onReject, onTerminate
}: {
    member: MemberRegistration; onClose: () => void;
    onApprove: (id: string) => void; onReject: (id: string) => void; onTerminate: (id: string) => void;
}) {
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString("th-TH", {
            year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
        });

    return (
        <div
            style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
            onClick={onClose}
        >
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} />
            <div
                className="glass-card animate-fade-in-up"
                style={{
                    position: "relative", maxWidth: "520px", width: "100%", padding: "32px 24px",
                    maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(201, 168, 76, 0.3)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} style={{
                    position: "absolute", top: "12px", right: "12px", background: "none",
                    border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer", padding: "4px 8px",
                }}>
                    ✕
                </button>

                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <div style={{
                        width: "56px", height: "56px", borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--gold-500), var(--gold-300))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.5rem", margin: "0 auto 12px", color: "var(--navy-900)", fontWeight: 800,
                    }}>
                        {member.fullName.charAt(0)}
                    </div>
                    <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>{member.fullName}</h2>
                    <StatusBadge status={member.status} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                    <InfoRow label="📱 เบอร์โทร" value={member.phone} />
                    <InfoRow label="📧 อีเมล" value={member.email || "ไม่ได้ระบุ"} />
                    <InfoRow label="📦 แพ็กเกจ" value={member.plan === "3month" ? "สมาชิก 3 เดือน (600 บาท)" : "บัตรทดลอง (150 บาท)"} />
                    {member.memberCode && <InfoRow label="🔑 รหัสสมาชิก" value={member.memberCode} highlight />}
                    <InfoRow label="📅 วันที่สมัคร" value={formatDate(member.registeredAt)} />
                    {member.approvedAt && <InfoRow label="✅ อนุมัติเมื่อ" value={formatDate(member.approvedAt)} />}
                    {member.expiresAt && (
                        <InfoRow label="⏰ หมดอายุ" value={formatDate(member.expiresAt)}
                            highlight={new Date(member.expiresAt) < new Date()} />
                    )}
                    {member.note && <InfoRow label="📝 หมายเหตุ" value={member.note} />}
                </div>

                {member.slipImage && (
                    <div style={{ marginBottom: "24px" }}>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 600 }}>
                            🧾 สลิปโอนเงิน
                        </p>
                        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
                            <img src={member.slipImage} alt="สลิปโอนเงิน" style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px", objectFit: "contain" }} />
                        </div>
                    </div>
                )}

                {member.status === "pending" && (
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button onClick={() => onApprove(member.id)} className="btn-primary" style={{ flex: 1, background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
                            ✅ อนุมัติ
                        </button>
                        <button onClick={() => onReject(member.id)} style={{
                            flex: 1, padding: "12px", background: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid rgba(239, 68, 68, 0.4)", color: "var(--danger)",
                            borderRadius: "12px", fontWeight: 700, cursor: "pointer", fontSize: "1rem",
                        }}>
                            ❌ ปฏิเสธ
                        </button>
                    </div>
                )}

                {member.status === "approved" && (
                    <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                        <button onClick={() => {
                            if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการระงับสิทธิ์สมาชิกนี้?")) {
                                onTerminate(member.id);
                            }
                        }} style={{
                            flex: 1, padding: "12px", background: "transparent",
                            border: "1px solid rgba(239, 68, 68, 0.4)", color: "var(--danger)",
                            borderRadius: "12px", fontWeight: 700, cursor: "pointer", fontSize: "1rem",
                            transition: "all 0.2s"
                        }}>
                            🚫 ระงับสิทธิ์สมาชิก
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================
// Member Row
// ============================================
function MemberRow({ member, onClick }: { member: MemberRegistration; onClick: () => void }) {
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        setTimeout(() => setNow(Date.now()), 0);
    }, []);

    const timeDiff = (iso: string) => {
        if (!now) return "...";
        const diff = now - new Date(iso).getTime();
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        if (hrs < 1) return "เมื่อสักครู่";
        if (hrs < 24) return `${hrs} ชม. ที่แล้ว`;
        return `${Math.floor(hrs / 24)} วันที่แล้ว`;
    };

    return (
        <div onClick={onClick} className="glass-card" style={{
            padding: "16px 20px", cursor: "pointer", display: "grid",
            gridTemplateColumns: "auto 1fr auto auto", alignItems: "center", gap: "16px",
        }}>
            <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: member.status === "pending" ? "linear-gradient(135deg, var(--warning), #d97706)"
                    : member.status === "approved" ? "linear-gradient(135deg, var(--success), #16a34a)"
                        : "linear-gradient(135deg, var(--danger), #dc2626)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem", fontWeight: 800, color: "white", flexShrink: 0,
            }}>
                {member.fullName.charAt(0)}
            </div>
            <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {member.fullName}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {member.phone}
                    {member.memberCode && (
                        <span style={{ marginLeft: "8px", color: "var(--gold-400)", fontWeight: 600 }}>
                            {member.memberCode}
                        </span>
                    )}
                </div>
            </div>
            <div>
                <span className={`badge ${member.plan === "3month" ? "badge-gold" : "badge-online"}`}>
                    {member.plan === "3month" ? "3 เดือน" : "ทดลอง"}
                </span>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
                <StatusBadge status={member.status} />
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    {timeDiff(member.registeredAt)}
                </div>
            </div>
        </div>
    );
}

// ============================================
// Course Form Modal (Add / Edit)
// ============================================
function CourseFormModal({
    course, onClose, onSave,
}: {
    course: Course | null; onClose: () => void;
    onSave: (data: Omit<Course, "id" | "createdAt">) => void;
}) {
    const [form, setForm] = useState({
        title: course?.title || "",
        subtitle: course?.subtitle || "",
        description: course?.description || "",
        date: course?.date || "",
        time: course?.time || "",
        mode: (course?.mode || "online") as "online" | "onsite",
        instructor: course?.instructor || "Coach Uthar",
        spots: course?.spots ?? 20,
        maxSpots: course?.maxSpots ?? 20,
        image: course?.image || "📚",
    });

    const emojiOptions = ["🚀", "📈", "⚙️", "💪", "📚", "💡", "🎯", "🧠", "🎨", "📊", "🌟", "💎"];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.date || !form.time) return;
        onSave(form);
    };

    return (
        <div
            style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
            onClick={onClose}
        >
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} />
            <div
                className="glass-card animate-fade-in-up"
                style={{
                    position: "relative", maxWidth: "560px", width: "100%", padding: "32px 24px",
                    maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(201, 168, 76, 0.3)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} style={{
                    position: "absolute", top: "12px", right: "12px", background: "none",
                    border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer",
                }}>✕</button>

                <h2 className="gold-text" style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "24px" }}>
                    {course ? "✏️ แก้ไขคอร์ส" : "➕ เพิ่มคอร์สใหม่"}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Emoji Picker */}
                    <div style={{ marginBottom: "16px" }}>
                        <label className="input-label">ไอคอน</label>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {emojiOptions.map((e) => (
                                <button
                                    key={e} type="button" onClick={() => setForm({ ...form, image: e })}
                                    style={{
                                        width: "44px", height: "44px", borderRadius: "10px",
                                        fontSize: "1.4rem", cursor: "pointer",
                                        background: form.image === e ? "rgba(201, 168, 76, 0.2)" : "rgba(255,255,255,0.05)",
                                        border: form.image === e ? "2px solid var(--gold-500)" : "1px solid rgba(255,255,255,0.1)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}
                                >{e}</button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div style={{ marginBottom: "14px" }}>
                        <label className="input-label">ชื่อคอร์ส *</label>
                        <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="เช่น Product Growth" />
                    </div>

                    {/* Subtitle */}
                    <div style={{ marginBottom: "14px" }}>
                        <label className="input-label">หัวข้อย่อย</label>
                        <input className="input-field" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="เช่น Mastering Ethical Influence" />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: "14px" }}>
                        <label className="input-label">รายละเอียด</label>
                        <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="รายละเอียดคอร์ส..." style={{ resize: "vertical" }} />
                    </div>

                    {/* Date + Time */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                        <div>
                            <label className="input-label">วันที่ *</label>
                            <input className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required placeholder="เช่น 15 มี.ค. 2026" />
                        </div>
                        <div>
                            <label className="input-label">เวลา *</label>
                            <input className="input-field" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required placeholder="เช่น 10:00 - 12:00" />
                        </div>
                    </div>

                    {/* Mode + Instructor */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                        <div>
                            <label className="input-label">รูปแบบ</label>
                            <select className="input-field" value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value as "online" | "onsite" })}>
                                <option value="online">🌐 Online</option>
                                <option value="onsite">📍 Onsite</option>
                            </select>
                        </div>
                        <div>
                            <label className="input-label">วิทยากร</label>
                            <input className="input-field" value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} />
                        </div>
                    </div>

                    {/* Spots */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                        <div>
                            <label className="input-label">ที่นั่งเหลือ</label>
                            <input type="number" className="input-field" min={0} value={form.spots} onChange={(e) => setForm({ ...form, spots: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div>
                            <label className="input-label">ที่นั่งทั้งหมด</label>
                            <input type="number" className="input-field" min={1} value={form.maxSpots} onChange={(e) => setForm({ ...form, maxSpots: parseInt(e.target.value) || 1 })} />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "1.05rem" }}>
                        {course ? "💾 บันทึกการแก้ไข" : "➕ เพิ่มคอร์ส"}
                    </button>
                </form>
            </div>
        </div>
    );
}

// ============================================
// CSV Export utility
// ============================================
function exportMembersCSV(members: MemberRegistration[]) {
    const headers = ["รหัสสมาชิก", "ชื่อ-สกุล", "เบอร์โทร", "อีเมล", "แพ็กเกจ", "สถานะ", "วันที่สมัคร", "หมดอายุ"];
    const rows = members.map((m) => [
        m.memberCode || "-",
        m.fullName,
        m.phone,
        m.email || "-",
        m.plan === "3month" ? "3 เดือน" : "ทดลอง",
        m.status === "approved" ? "อนุมัติ" : m.status === "pending" ? "รอดำเนินการ" : m.status === "rejected" ? "ปฏิเสธ" : "หมดอายุ",
        new Date(m.registeredAt).toLocaleDateString("th-TH"),
        m.expiresAt ? new Date(m.expiresAt).toLocaleDateString("th-TH") : "-",
    ]);
    const csv = "\uFEFF" + [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `theowner_members_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
}

function exportBookingsCSV(bookings: Booking[], members: MemberRegistration[], courses: Course[]) {
    const headers = ["รหัสสมาชิก", "ชื่อ", "คอร์ส", "วันที่จอง", "สถานะ"];
    const rows = bookings.map((b) => {
        const member = members.find((m) => m.id === b.memberId);
        const course = courses.find((c) => c.id === b.courseId);
        return [
            member?.memberCode || "-",
            member?.fullName || "-",
            course?.title || "-",
            new Date(b.bookedAt).toLocaleDateString("th-TH"),
            b.status === "confirmed" ? "ยืนยัน" : "ยกเลิก",
        ];
    });
    const csv = "\uFEFF" + [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `theowner_bookings_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
}

// ============================================
// Main Admin Dashboard (Phase 4 - Full Features)
// ============================================
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
    const [members, setMembers] = useState<MemberRegistration[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [activeTab, setActiveTab] = useState<"members" | "courses" | "bookings">("members");
    const [filter, setFilter] = useState<MemberStatus | "all">("all");
    const [planFilter, setPlanFilter] = useState<"all" | "3month" | "trial">("all");
    const [search, setSearch] = useState("");
    const [selectedMember, setSelectedMember] = useState<MemberRegistration | null>(null);
    const [courseFormOpen, setCourseFormOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const loadAll = useCallback(async () => {
        setMembers(await getAllMembers());
        setCourses(await getAllCourses());
        setBookings(await getAllBookings());
    }, []);

    useEffect(() => {
        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Member handlers
    const handleApprove = async (id: string) => {
        const result = await approveMember(id);
        if (result) {
            showToast(`✅ อนุมัติ ${result.fullName} สำเร็จ! รหัส: ${result.memberCode}`, "success");
            setSelectedMember(null);
            loadAll();
        }
    };
    const handleReject = async (id: string) => {
        const result = await rejectMember(id);
        if (result) {
            showToast(`❌ ปฏิเสธ ${result.fullName}`, "error");
            setSelectedMember(null);
            loadAll();
        }
    };
    const handleTerminate = async (id: string) => {
        const result = await terminateMember(id);
        if (result) {
            showToast(`🚫 ระงับสิทธิ์ ${result.fullName} แล้ว`, "error");
            setSelectedMember(null);
            loadAll();
        }
    };

    // Course handlers
    const handleSaveCourse = async (data: Omit<Course, "id" | "createdAt">) => {
        if (editingCourse) {
            await updateCourse(editingCourse.id, data);
            showToast(`✅ แก้ไขคอร์ส "${data.title}" สำเร็จ`, "success");
        } else {
            await addCourse(data);
            showToast(`✅ เพิ่มคอร์ส "${data.title}" สำเร็จ`, "success");
        }
        setCourseFormOpen(false);
        setEditingCourse(null);
        loadAll();
    };
    const handleDeleteCourse = async (id: string, title: string) => {
        if (confirm(`ต้องการลบคอร์ส "${title}" ใช่มั้ย?`)) {
            await deleteCourse(id);
            showToast(`🗑️ ลบคอร์ส "${title}" แล้ว`, "success");
            loadAll();
        }
    };

    // Computed stats
    const counts = {
        all: members.length,
        pending: members.filter((m) => m.status === "pending").length,
        approved: members.filter((m) => m.status === "approved").length,
        expired: members.filter((m) => m.status === "expired").length,
        rejected: members.filter((m) => m.status === "rejected").length,
    };
    const totalRevenue = members
        .filter((m) => m.status === "approved" || m.status === "expired")
        .reduce((sum, m) => sum + (m.plan === "3month" ? 600 : 150), 0);
    const totalBookings = bookings.filter((b) => b.status === "confirmed").length;

    const filteredMembers = members
        .filter((m) => filter === "all" || m.status === filter)
        .filter((m) => planFilter === "all" || m.plan === planFilter)
        .filter((m) =>
            m.fullName.toLowerCase().includes(search.toLowerCase()) ||
            m.phone.includes(search) ||
            (m.memberCode && m.memberCode.toLowerCase().includes(search.toLowerCase()))
        )
        .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());

    const tabStyle = (active: boolean) => ({
        padding: "12px 20px",
        borderRadius: "10px",
        cursor: "pointer" as const,
        fontWeight: 700 as const,
        fontSize: "0.9rem",
        border: active ? "1px solid var(--gold-500)" : "1px solid rgba(255,255,255,0.1)",
        background: active ? "var(--glass-bg)" : "rgba(255,255,255,0.05)",
        color: active ? "var(--gold-400)" : "var(--text-secondary)",
        boxShadow: active ? "0 0 10px rgba(201, 168, 76, 0.2)" : "none",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap" as const,
    });

    return (
        <div style={{ minHeight: "100vh", paddingBottom: "60px" }}>
            {/* Toast */}
            {toast && (
                <div className="animate-fade-in" style={{
                    position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 300,
                    padding: "14px 28px", borderRadius: "12px",
                    background: toast.type === "success" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                    border: `1px solid ${toast.type === "success" ? "rgba(34, 197, 94, 0.4)" : "rgba(239, 68, 68, 0.4)"}`,
                    color: toast.type === "success" ? "var(--success)" : "var(--danger)",
                    fontWeight: 600, backdropFilter: "blur(20px)", fontSize: "0.95rem", maxWidth: "90vw", textAlign: "center",
                }}>
                    {toast.message}
                </div>
            )}

            {/* Navbar */}
            <nav className="nav-wrapper">
                <div className="section-container">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                                width: "36px", height: "36px", borderRadius: "10px",
                                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 900, fontSize: "1rem", color: "white",
                            }}>🔐</div>
                            <div>
                                <span style={{ fontWeight: 700, fontSize: "1rem" }}>Admin Panel</span>
                                <span style={{ display: "block", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                    The Owner Membership
                                </span>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <Link href="/" className="btn-secondary btn-sm" style={{ textDecoration: "none" }}>🏠</Link>
                            <button onClick={onLogout} style={{
                                padding: "8px 16px", background: "rgba(239, 68, 68, 0.15)",
                                border: "1px solid rgba(239, 68, 68, 0.3)", color: "var(--danger)",
                                borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem",
                            }}>ออก</button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="section-container" style={{ paddingTop: "88px" }}>
                {/* Stats Row */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: "10px", marginBottom: "24px",
                }}>
                    <StatCard label="สมาชิกทั้งหมด" value={counts.all} icon="👥" color="var(--text-primary)" />
                    <StatCard label="รอดำเนินการ" value={counts.pending} icon="⏳" color="var(--warning)" />
                    <StatCard label="อนุมัติแล้ว" value={counts.approved} icon="✅" color="var(--success)" />
                    <StatCard label="รายได้รวม" value={`฿${totalRevenue.toLocaleString()}`} icon="💰" color="var(--gold-400)" />
                    <StatCard label="การจองทั้งหมด" value={totalBookings} icon="🎫" color="#818cf8" />
                </div>

                {/* Main Tab Navigation */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
                    <button onClick={() => setActiveTab("members")} style={tabStyle(activeTab === "members")}>
                        👥 สมาชิก ({counts.all})
                    </button>
                    <button onClick={() => setActiveTab("courses")} style={tabStyle(activeTab === "courses")}>
                        📚 คอร์สเรียน ({courses.length})
                    </button>
                    <button onClick={() => setActiveTab("bookings")} style={tabStyle(activeTab === "bookings")}>
                        🎫 การจอง ({totalBookings})
                    </button>
                </div>

                {/* ===================== TAB: MEMBERS ===================== */}
                {activeTab === "members" && (
                    <>
                        {/* Sub-filter + Search */}
                        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", overflowX: "auto", paddingBottom: "4px" }}>
                            {([
                                { key: "all", label: "ทั้งหมด", count: counts.all },
                                { key: "pending", label: "🟡 รอ", count: counts.pending },
                                { key: "approved", label: "🟢 อนุมัติ", count: counts.approved },
                                { key: "rejected", label: "⛔ ปฏิเสธ", count: counts.rejected },
                            ] as { key: MemberStatus | "all"; label: string; count: number }[]).map((tab) => (
                                <button
                                    key={tab.key} onClick={() => setFilter(tab.key)}
                                    className={filter === tab.key ? "btn-primary btn-sm" : "btn-secondary btn-sm"}
                                    style={{ whiteSpace: "nowrap" }}
                                >
                                    {tab.label} ({tab.count})
                                </button>
                            ))}
                        </div>

                        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                            <select
                                className="input-field"
                                style={{ flex: 1, minWidth: "120px", maxWidth: "200px", padding: "10px" }}
                                value={planFilter}
                                onChange={(e) => setPlanFilter(e.target.value as "all" | "3month" | "trial")}
                            >
                                <option value="all">🌟 ทุกแพ็กเกจ</option>
                                <option value="3month">👑 3 เดือน (OW)</option>
                                <option value="trial">🎟️ ทดลอง (TR)</option>
                            </select>
                            <input
                                type="text" className="input-field" style={{ flex: 2, minWidth: "200px", padding: "10px" }}
                                placeholder="🔍 ค้นหาชื่อ, เบอร์โทร, รหัสสมาชิก..."
                                value={search} onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                onClick={() => exportMembersCSV(members)}
                                className="btn-secondary btn-sm"
                                style={{ whiteSpace: "nowrap", padding: "10px 16px" }}
                            >
                                📥 Export CSV
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {filteredMembers.length === 0 ? (
                                <div className="glass-card" style={{ padding: "48px 20px", textAlign: "center" }}>
                                    <div style={{ fontSize: "3rem", marginBottom: "12px", opacity: 0.5 }}>📭</div>
                                    <p style={{ color: "var(--text-muted)" }}>
                                        {search ? "ไม่พบผลลัพธ์การค้นหา" : "ยังไม่มีผู้สมัครในหมวดนี้"}
                                    </p>
                                </div>
                            ) : (
                                filteredMembers.map((member) => (
                                    <MemberRow key={member.id} member={member} onClick={() => setSelectedMember(member)} />
                                ))
                            )}
                        </div>
                    </>
                )}

                {/* ===================== TAB: COURSES ===================== */}
                {activeTab === "courses" && (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                            <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                                คอร์สทั้งหมด ({courses.length})
                            </h2>
                            <button
                                onClick={() => { setEditingCourse(null); setCourseFormOpen(true); }}
                                className="btn-primary"
                                style={{ padding: "10px 20px" }}
                            >
                                ➕ เพิ่มคอร์สใหม่
                            </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "14px" }}>
                            {courses.map((course) => {
                                const courseBookings = bookings.filter((b) => b.courseId === course.id && b.status === "confirmed");
                                return (
                                    <div key={course.id} className="glass-card" style={{ padding: "20px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <div style={{
                                                    fontSize: "2rem", width: "48px", height: "48px",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    borderRadius: "12px", background: "rgba(201, 168, 76, 0.08)",
                                                }}>{course.image}</div>
                                                <div>
                                                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{course.title}</h3>
                                                    <p style={{ fontSize: "0.8rem", color: "var(--gold-400)" }}>{course.subtitle}</p>
                                                </div>
                                            </div>
                                            <span className={`badge ${course.mode === "online" ? "badge-online" : "badge-onsite"}`}>
                                                {course.mode === "online" ? "🌐" : "📍"}
                                            </span>
                                        </div>

                                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                                            <span>📅 {course.date}</span>
                                            <span>🕐 {course.time}</span>
                                            <span>👤 {course.instructor}</span>
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                            <span style={{ fontSize: "0.85rem" }}>
                                                ที่นั่ง{" "}
                                                <strong style={{ color: course.spots <= 5 ? "var(--danger)" : "var(--success)" }}>
                                                    {course.spots}/{course.maxSpots}
                                                </strong>
                                            </span>
                                            <span style={{ fontSize: "0.8rem", color: "#818cf8" }}>
                                                🎫 จอง {courseBookings.length} ที่
                                            </span>
                                        </div>

                                        <div style={{ display: "flex", gap: "8px", borderTop: "1px solid rgba(201, 168, 76, 0.1)", paddingTop: "12px" }}>
                                            <button
                                                onClick={() => { setEditingCourse(course); setCourseFormOpen(true); }}
                                                className="btn-secondary btn-sm" style={{ flex: 1 }}
                                            >
                                                ✏️ แก้ไข
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCourse(course.id, course.title)}
                                                style={{
                                                    flex: 1, padding: "8px", borderRadius: "8px", fontSize: "0.85rem",
                                                    background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)",
                                                    color: "var(--danger)", cursor: "pointer", fontWeight: 600,
                                                }}
                                            >
                                                🗑️ ลบ
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* ===================== TAB: BOOKINGS ===================== */}
                {activeTab === "bookings" && (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                            <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                                รายการจองทั้งหมด ({bookings.length})
                            </h2>
                            <button
                                onClick={() => exportBookingsCSV(bookings, members, courses)}
                                className="btn-secondary"
                                style={{ padding: "10px 20px" }}
                            >
                                📥 Export CSV
                            </button>
                        </div>

                        {bookings.length === 0 ? (
                            <div className="glass-card" style={{ padding: "48px", textAlign: "center" }}>
                                <div style={{ fontSize: "3rem", marginBottom: "12px", opacity: 0.5 }}>🎫</div>
                                <p style={{ color: "var(--text-muted)" }}>ยังไม่มีการจองในระบบ</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {bookings
                                    .sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime())
                                    .map((booking) => {
                                        const member = members.find((m) => m.id === booking.memberId);
                                        const course = courses.find((c) => c.id === booking.courseId);
                                        const isCancelled = booking.status === "cancelled";
                                        return (
                                            <div key={booking.id} className="glass-card" style={{ padding: "16px 20px", opacity: isCancelled ? 0.6 : 1 }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                        <div style={{
                                                            width: "40px", height: "40px", borderRadius: "10px",
                                                            background: isCancelled ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                                                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
                                                        }}>
                                                            {course?.image || "📚"}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 700, fontSize: "0.95rem", textDecoration: isCancelled ? "line-through" : "none" }}>
                                                                {course?.title || "คอร์สไม่พบ"}
                                                            </div>
                                                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                                                👤 {member?.fullName || "?"}
                                                                {member?.memberCode && (
                                                                    <span style={{ margin: "0 6px", color: "var(--gold-400)", fontWeight: 600 }}>
                                                                        {member.memberCode}
                                                                    </span>
                                                                )}
                                                                · 📅 {new Date(booking.bookedAt).toLocaleDateString("th-TH")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span style={{
                                                        padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
                                                        background: isCancelled ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                                                        color: isCancelled ? "var(--danger)" : "var(--success)",
                                                        border: `1px solid ${isCancelled ? "rgba(239, 68, 68, 0.3)" : "rgba(34, 197, 94, 0.3)"}`,
                                                    }}>
                                                        {isCancelled ? "❌ ยกเลิก" : "✅ ยืนยัน"}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            {selectedMember && (
                <MemberDetailModal member={selectedMember} onClose={() => setSelectedMember(null)}
                    onApprove={handleApprove} onReject={handleReject} onTerminate={handleTerminate} />
            )}
            {courseFormOpen && (
                <CourseFormModal course={editingCourse} onClose={() => { setCourseFormOpen(false); setEditingCourse(null); }}
                    onSave={handleSaveCourse} />
            )}
        </div>
    );
}

// ============================================
// Admin Page Entry
// ============================================
export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <>
            {!isLoggedIn ? (
                <AdminLogin onLogin={() => setIsLoggedIn(true)} />
            ) : (
                <AdminDashboard onLogout={() => setIsLoggedIn(false)} />
            )}
        </>
    );
}
