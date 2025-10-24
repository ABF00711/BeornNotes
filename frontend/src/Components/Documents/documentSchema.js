import { z } from "zod";

export const getDocumentSchema = (mandatoryFields, labels) => {
    const schemaFields = {
        description: mandatoryFields.description
            ? z.string().min(1, `${labels.description} is required`)
            : z.union([z.string(), z.null(), z.undefined()])
                .optional()
                .transform((val) => val === null || val === undefined ? undefined : val),
        file: mandatoryFields.file
            ? z.file().min(1, `${labels.file} is required`)
            : z.union([z.null(), z.undefined()])
                .optional()
                .transform((val) => val === null || val === undefined ? undefined : val)
    };

    return z.object(schemaFields);
}