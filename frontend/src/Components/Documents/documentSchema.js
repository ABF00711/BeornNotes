import { z } from "zod";

export const getDocumentSchema = (mandatoryFields, labels) => {
    const schemaFields = {
        name: mandatoryFields.name
            ? z.string().min(1, `${labels.name} is required`)
            : z.union([z.string(), z.null(), z.undefined()])
                .optional()
                .transform((val) => val === null || val === undefined ? undefined : val),
        customer: mandatoryFields.customer
            ? z.string().min(1, `${labels.customer} is required`)
            : z.union([z.string(), z.null(), z.undefined(), z.number()])
                .optional()
                .transform((val) => val === null || val === undefined ? undefined : val),
        description: mandatoryFields.description
            ? z.string().min(1, `${labels.description} is required`)
            : z.union([z.string(), z.null(), z.undefined()])
                .optional()
                .transform((val) => val === null || val === undefined ? undefined : val)
    };

    return z.object(schemaFields);
}