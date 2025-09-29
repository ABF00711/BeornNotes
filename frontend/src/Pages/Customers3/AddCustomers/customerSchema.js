import {z} from "zod";

export const customersSchema = z.object({
    fullname: z.string().min(1, "Fullname is required"),
    displayname: z.string().min(1, "Displayname is required"),
    birthday: z.string().min(1, "Birthday is required").transform((str) => new Date(str)),
    age: z.union([z.string(), z.number()])
        .refine((val) => {
            if (typeof val === 'string') {
                return val.trim() !== '' && !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0;
            }
            return val !== null && val !== undefined && val > 0;
        }, "Age is required")
        .transform((val) => {
            if (typeof val === 'string') {
                return parseInt(val, 10);
            }
            return val;
        }),
    job: z.string().min(1, "Job is required")
})