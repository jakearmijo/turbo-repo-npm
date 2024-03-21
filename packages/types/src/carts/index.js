import { z } from "zod";
export const CartSchema = z.object({
    id: z.number().optional(),
    storeId: z.number(),
    customerId: z.number(),
    itemId: z.string(),
    quantity: z.number(),
    createdBy: z.number().optional(),
    updatedBy: z.number().optional(),
});
