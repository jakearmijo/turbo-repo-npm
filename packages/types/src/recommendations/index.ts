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

export type RecommendationsType = z.infer<typeof RecommendationsSchema>;


export const SeaplaneResponseSchema = z.object({
  request_id: z.string(),
});

export type SeaplaneResponseType = z.infer<typeof SeaplaneResponseSchema>;

export interface Recommendation {
	id: number;
	name: string;
	strainname: string;
	category: string;
	subcategory: string;
	description: string;
	recommendationReason: string;
	effects: string[];
	flavors: string[];
	terpenes: string[];
	cannabinoids: string[];
	ishybrid: string;
	price: number;
	available: number;
	productgrams: string;
	thccontent: number | string;
	cbdcontent: number | string;
	unittype: string;
	image: string;
}
