import { z } from "zod";
export const IdTypesSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    description: z.string(),
    createdBy: z.number().optional(),
    updatedBy: z.number().optional(),
});
