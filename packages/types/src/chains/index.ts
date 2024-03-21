import { z } from "zod";

export const CreateChainSchema = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  logo: z.string(),
  createdBy: z.number().optional(),
  updatedBy: z.number().optional(),
})

export const ChainsSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  logo: z.string(),
  externalOrgId: z.string(),
  createdBy: z.number().optional(),
  updatedBy: z.number().optional(),
});

export type ChainsType = z.infer<typeof ChainsSchema>;
export type CreateChainType = z.infer<typeof CreateChainSchema>
