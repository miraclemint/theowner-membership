import { supabase } from "./supabase";
import { MemberRegistration, Course, Booking, MemberStatus } from "./types";

// ============================================
// Data Mapping Helpers
// ============================================
function mapMember(row: Record<string, unknown>): MemberRegistration {
    return {
        id: row.id as string,
        fullName: row.full_name as string,
        phone: row.phone as string,
        email: row.email as string | null,
        plan: row.plan as "3month" | "trial",
        memberCode: row.member_code as string | null,
        status: row.status as MemberStatus,
        slipImage: row.slip_image as string | null,
        registeredAt: row.registered_at as string,
        approvedAt: row.approved_at as string | null,
        expiresAt: row.expires_at as string | null,
        note: row.note as string | null,
    };
}

function mapCourse(row: Record<string, unknown>): Course {
    return {
        id: row.id as string,
        title: row.title as string,
        subtitle: row.subtitle as string,
        description: row.description as string,
        date: row.date_text as string,
        time: row.time_text as string,
        mode: row.mode as "online" | "onsite",
        instructor: row.instructor as string,
        spots: row.spots as number,
        maxSpots: row.max_spots as number,
        image: row.image_url as string,
        createdAt: row.created_at as string,
    };
}

function mapBooking(row: Record<string, unknown>): Booking {
    return {
        id: row.id as string,
        memberId: row.member_id as string,
        courseId: row.course_id as string,
        bookedAt: row.booked_at as string,
        status: row.status as "confirmed" | "cancelled",
    };
}

// ============================================
// MEMBER COUNTER Helper
// ============================================
async function getNextMemberCode(prefix: string): Promise<string> {
    const { data, error } = await supabase
        .from("members")
        .select("member_code")
        .not("member_code", "is", null);

    if (error || !data) return `${prefix}0001`;

    // find max
    let max = 0;
    for (const row of data) {
        if (row.member_code && row.member_code.startsWith(prefix)) {
            const num = parseInt(row.member_code.replace(prefix, ""), 10);
            if (!isNaN(num) && num > max) max = num;
        }
    }
    return `${prefix}${(max + 1).toString().padStart(4, "0")}`;
}

// ============================================
// MEMBERS API
// ============================================
export async function getAllMembers(): Promise<MemberRegistration[]> {
    const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("registered_at", { ascending: false });
    if (error) { console.error(error); return []; }
    return data.map(mapMember);
}

export async function getMemberById(id: string): Promise<MemberRegistration | undefined> {
    const { data, error } = await supabase.from("members").select("*").eq("id", id).single();
    if (error || !data) return undefined;
    return mapMember(data);
}

export async function getMemberByCodeAndPhone(code: string, phone: string): Promise<MemberRegistration | undefined> {
    const cleanPhone = phone.replace(/[\s-]/g, "");
    const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("status", "approved")
        .ilike("member_code", code);

    if (error || !data) return undefined;

    // Check phone locally as user might input with/without dashes
    const found = data.find((m) => m.phone.replace(/[\s-]/g, "") === cleanPhone);
    return found ? mapMember(found) : undefined;
}

export async function addMemberRegistration(data: Omit<MemberRegistration, "id" | "status" | "registeredAt">): Promise<MemberRegistration | null> {
    const dbData = {
        full_name: data.fullName,
        phone: data.phone,
        email: data.email,
        plan: data.plan,
        slip_image: data.slipImage,
    };
    const { data: result, error } = await supabase.from("members").insert([dbData]).select().single();
    if (error) { console.error(error); return null; }
    return mapMember(result);
}

export async function approveMember(id: string): Promise<MemberRegistration | null> {
    // get member first
    const member = await getMemberById(id);
    if (!member) return null;

    const prefix = member.plan === "trial" ? "TR" : "OW";
    const memberCode = await getNextMemberCode(prefix);
    const now = new Date();
    const expiresAt = member.plan === "3month" ? new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString() : null;

    const { data, error } = await supabase
        .from("members")
        .update({
            status: "approved",
            member_code: memberCode,
            approved_at: now.toISOString(),
            expires_at: expiresAt,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) { console.error(error); return null; }
    return mapMember(data);
}

export async function rejectMember(id: string, note?: string): Promise<MemberRegistration | null> {
    const { data, error } = await supabase
        .from("members")
        .update({
            status: "rejected",
            note: note || "สลิปไม่ถูกต้อง",
        })
        .eq("id", id)
        .select()
        .single();
    if (error) { console.error(error); return null; }
    return mapMember(data);
}

export async function terminateMember(id: string): Promise<MemberRegistration | null> {
    const { data, error } = await supabase
        .from("members")
        .update({
            status: "expired",
            note: "ถูกระงับสิทธิ์โดยผู้ดูแลระบบ",
        })
        .eq("id", id)
        .select()
        .single();
    if (error) { console.error(error); return null; }
    return mapMember(data);
}

// ============================================
// COURSES API
// ============================================
export async function getAllCourses(): Promise<Course[]> {
    const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: true });
    if (error) { console.error(error); return []; }
    return data.map(mapCourse);
}

export async function getCourseById(id: string): Promise<Course | undefined> {
    const { data, error } = await supabase.from("courses").select("*").eq("id", id).single();
    if (error || !data) return undefined;
    return mapCourse(data);
}

export async function addCourse(data: Omit<Course, "id" | "createdAt">): Promise<Course | null> {
    const dbData = {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        date_text: data.date,
        time_text: data.time,
        mode: data.mode,
        instructor: data.instructor,
        spots: data.spots,
        max_spots: data.maxSpots,
        image_url: data.image,
    };
    const { data: result, error } = await supabase.from("courses").insert([dbData]).select().single();
    if (error) { console.error(error); return null; }
    return mapCourse(result);
}

export async function updateCourse(id: string, data: Partial<Course>): Promise<Course | null> {
    const dbData: Record<string, unknown> = {};
    if (data.title !== undefined) dbData.title = data.title;
    if (data.subtitle !== undefined) dbData.subtitle = data.subtitle;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.date !== undefined) dbData.date_text = data.date;
    if (data.time !== undefined) dbData.time_text = data.time;
    if (data.mode !== undefined) dbData.mode = data.mode;
    if (data.instructor !== undefined) dbData.instructor = data.instructor;
    if (data.spots !== undefined) dbData.spots = data.spots;
    if (data.maxSpots !== undefined) dbData.max_spots = data.maxSpots;
    if (data.image !== undefined) dbData.image_url = data.image;

    const { data: result, error } = await supabase.from("courses").update(dbData).eq("id", id).select().single();
    if (error) { console.error(error); return null; }
    return mapCourse(result);
}

export async function deleteCourse(id: string): Promise<boolean> {
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) { console.error(error); return false; }
    return true;
}

// ============================================
// BOOKINGS API
// ============================================
export async function getAllBookings(): Promise<Booking[]> {
    const { data, error } = await supabase.from("bookings").select("*").order("booked_at", { ascending: false });
    if (error) { console.error(error); return []; }
    return data.map(mapBooking);
}

export async function getBookingsByMember(memberId: string): Promise<Booking[]> {
    const { data, error } = await supabase.from("bookings").select("*").eq("member_id", memberId).order("booked_at", { ascending: false });
    if (error) { console.error(error); return []; }
    return data.map(mapBooking);
}

export async function addBooking(
    memberId: string,
    courseId: string
): Promise<{ success: boolean; message: string; booking?: Booking }> {
    const member = await getMemberById(memberId);
    if (!member || member.status !== "approved") {
        return { success: false, message: "สมาชิกไม่ถูกต้องหรือยังไม่ได้รับการอนุมัติ" };
    }

    if (member.plan === "3month" && member.expiresAt) {
        if (new Date(member.expiresAt) < new Date()) {
            return { success: false, message: "บัตรสมาชิกของคุณหมดอายุแล้ว กรุณาต่ออายุ" };
        }
    }

    if (member.plan === "trial") {
        const memberBookings = await getBookingsByMember(memberId);
        const existingConfirmed = memberBookings.filter((b) => b.status === "confirmed");
        if (existingConfirmed.length >= 1) {
            return { success: false, message: "บัตรทดลองจองได้ 1 คอร์สเท่านั้น กรุณาอัปเกรดเป็นสมาชิก 3 เดือน" };
        }
    }

    // Check already booked
    const allBookings = await getBookingsByMember(memberId);
    const alreadyBooked = allBookings.find((b) => b.courseId === courseId && b.status === "confirmed");
    if (alreadyBooked) {
        return { success: false, message: "คุณจองคอร์สนี้แล้ว" };
    }

    // Check course spots
    const course = await getCourseById(courseId);
    if (!course) return { success: false, message: "ไม่พบคอร์สนี้" };
    if (course.spots <= 0) return { success: false, message: "คอร์สนี้เต็มแล้ว" };

    // Create booking
    const { data: bookingData, error: bookingError } = await supabase.from("bookings").insert([{
        member_id: memberId,
        course_id: courseId,
        status: "confirmed"
    }]).select().single();

    if (bookingError) return { success: false, message: "เกิดข้อผิดพลาดในการบันทึกการจอง" };

    // Reduce course spots
    await supabase.rpc('decrement_course_spots', { c_id: courseId }); // Usually best practice, but we can just update it
    await updateCourse(courseId, { spots: course.spots - 1 });

    return { success: true, message: "จองสำเร็จ!", booking: mapBooking(bookingData) };
}

export async function cancelBooking(bookingId: string): Promise<boolean> {
    const { data: booking, error: fetchErr } = await supabase.from("bookings").select("*").eq("id", bookingId).single();
    if (fetchErr || !booking) return false;

    // Change status
    const { error: updateErr } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId);
    if (updateErr) return false;

    // Restore course spot
    const course = await getCourseById(booking.course_id);
    if (course) {
        await updateCourse(booking.course_id, { spots: course.spots + 1 });
    }
    return true;
}
