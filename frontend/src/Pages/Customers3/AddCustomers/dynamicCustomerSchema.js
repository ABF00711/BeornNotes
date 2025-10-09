import { z } from "zod";

export const createCustomerSchema = (mandatoryFields) => {
    const schemaFields = {
        fullname: mandatoryFields.fullname 
            ? z.string().min(1, "Fullname is required")
            : z.union([z.string(), z.null(), z.undefined()])
                .optional()
                .transform((val) => val === null || val === undefined ? undefined : val),
        displayname: mandatoryFields.displayname 
            ? z.string().min(1, "Displayname is required")
            : z.union([z.string(), z.null(), z.undefined()])
                .optional()
                .transform((val) => val === null || val === undefined ? undefined : val),
        birthday: mandatoryFields.birthday 
            ? z.string().min(1, "Birthday is required").transform((str) => new Date(str))
            : z.union([z.string(), z.null(), z.undefined()])
                .optional()
                .transform((val) => {
                    if (val === null || val === undefined) return undefined;
                    return val ? new Date(val) : undefined;
                }),
        age: mandatoryFields.age 
            ? z.union([z.string(), z.number()])
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
                })
            : z.union([z.string(), z.number(), z.null(), z.undefined()])
                .optional()
                .transform((val) => {
                    if (val === null || val === undefined) return undefined;
                    if (typeof val === 'string' && val.trim() !== '') {
                        return parseInt(val, 10);
                    }
                    return val;
                }),
        job: mandatoryFields.job 
            ? z.string().min(1, "Job is required")
            : z.union([z.string(), z.null(), z.undefined()])
                .optional()
                .transform((val) => val === null || val === undefined ? undefined : val)
    };

    return z.object(schemaFields);
};
