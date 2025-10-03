import { z } from "zod";

export const userSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long"),
        confirmPassword: z.string().min(1, "Confirm Password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Password and Confirm Password do not match",
    });
