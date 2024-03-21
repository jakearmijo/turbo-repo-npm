import { z } from "zod";
export const RecommendationsSchema = z.object({
    id: z.number().optional(),
    customerId: z.number(),
    employeeId: z.number(),
    storeId: z.number(),
    formRequestId: z.number(),
    category: z.string(),
    subCategory: z.string(),
    products: z.string(),
    createdBy: z.number().optional(),
    updatedBy: z.number().optional(),
});
export const SeaplaneResponseSchema = z.object({
    request_id: z.string(),
});
