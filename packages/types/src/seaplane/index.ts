import { z } from "zod";

export const SeaplaneLambdaInputSchema = z.object({
  retailcustomer_id: z.number(),
  number_of_recommendations: z.number(),
  physical_health: z.array(z.string()),
  medical_allowed: z.string(),
  headspace: z.string(),
  category: z.string(),
  max_price: z.number(),
  temp: z.number(),
  retail_store_id: z.number(),
  available_products: z.array(z.number()),
});

export type SeaplaneLambdaInputType = z.infer<typeof SeaplaneLambdaInputSchema>;
