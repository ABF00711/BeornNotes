import { z } from "zod";

export const getDocumentSchema = (mandatoryFields, labels, role = "create") => {
    const schemaFields = {
        description: mandatoryFields.description
            ? z.string().min(1, `${labels.description} is required`)
            : z.union([z.string(), z.null(), z.undefined()])
                .optional()
                .transform((val) => val === null || val === undefined ? undefined : val),
        name: mandatoryFields.name
            ? role === "update"
                // In update mode, file is optional (user can keep existing file)
                ? z.union([
                    z.instanceof(File),
                    z.undefined(),
                    z.null()
                ]).optional()
                // In create mode, file is required
                : z.instanceof(File, { message: `${labels.name} is required` })
            : z.union([z.null(), z.undefined(), z.string()])
                .optional()
                .transform((val) => val === null || val === undefined ? null : val)
    };

    return z.object(schemaFields);
}