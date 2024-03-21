import { z } from "zod";
export const StoresSchema = z.object({
    id: z.number().optional(),
    chainId: z.number(),
    ageLimit: z.number(),
    stateId: z.number(),
    name: z.string(),
    city: z.string(),
    state: z.string(),
    address: z.string(),
    zip: z.string(),
    phone: z.string(),
    location: z.string(),
    message: z.string(),
    externalOrgId: z.string().optional(),
    licenseNumber: z.string(),
    createdBy: z.number().optional(),
    updatedBy: z.number().optional(),
});
