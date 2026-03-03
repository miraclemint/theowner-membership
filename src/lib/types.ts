// ============================================
// The Owner Membership - Shared Types
// ============================================

export type MembershipPlan = "3month" | "trial";
export type MemberStatus = "pending" | "approved" | "expired" | "rejected";
export type CourseMode = "online" | "onsite";
export type BookingStatus = "confirmed" | "cancelled";

// ============================================
// Member Registration
// ============================================
export interface MemberRegistration {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
    plan: MembershipPlan;
    memberCode?: string; // OWxxxx - assigned by admin
    status: MemberStatus;
    slipImage: string; // base64 or URL
    registeredAt: string; // ISO date
    approvedAt?: string; // ISO date
    expiresAt?: string; // ISO date (for 3-month plan)
    note?: string; // admin note
}

// ============================================
// Course / Event
// ============================================
export interface Course {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    date: string;
    time: string;
    mode: CourseMode;
    instructor: string;
    spots: number;
    maxSpots: number;
    image: string; // emoji or URL
    createdAt: string;
}

// ============================================
// Booking
// ============================================
export interface Booking {
    id: string;
    memberId: string;
    courseId: string;
    bookedAt: string;
    status: BookingStatus;
}

// ============================================
// Admin
// ============================================
export interface AdminSession {
    isLoggedIn: boolean;
    loginAt?: string;
}
