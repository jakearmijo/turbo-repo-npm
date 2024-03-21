import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string(),
  masterCategory: z.string(),
  createdBy: z.number().optional(),
  updatedBy: z.number().optional(),
});

export type CategoryType = z.infer<typeof CategorySchema>;
