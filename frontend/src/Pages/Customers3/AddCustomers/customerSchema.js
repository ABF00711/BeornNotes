import {z} from "zod";

export const customersSchema = z.object({
    fullname: z.string().min(1, "Fullname is required"),
    displayname: z.string().min(1, "Displayname is required"),
    birthday: z.string().min(1, "Birthday is required").transform((str) => new Date(str)),
    age: z.string().min(1, "Age is required").transform((str) => parseInt(str, 10)),
    job: z.enum(["Developer", "Designer", "Manager", "Other"], {
        errorMap: () => ({ message: "Job is required" })
    })
})