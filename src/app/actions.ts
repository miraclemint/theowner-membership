"use server";

export async function verifyAdminPasswordSecure(password: string): Promise<boolean> {
    const adminPassword = process.env.ADMIN_PASSWORD || "theowner2026";
    return password === adminPassword;
}
