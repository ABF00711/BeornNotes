import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, "Username or Email is required"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
    mfaCode: z.string().optional(),
    mfaRequired: z.boolean().optional(),
}).refine((data) => {
    if (!data.mfaRequired) return true;
    return !!data.mfaCode && /^\d{6}$/.test(data.mfaCode);
}, { path: ["mfaCode"], message: "Enter a valid 6-digit code" });
