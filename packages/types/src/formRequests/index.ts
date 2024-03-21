import { z } from "zod";

export const FormRequestsSchema = z.object({
  id: z.number().optional(),
  storeId: z.number().optional(),
  customerId: z.number().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  dob: z.date(),
  phone: z.string(),
  zipCode: z.string(),
  treatmentCategory: z.string(),
  treatmentSubcategory: z.string(),
  experienceLevel: z.string(),
  frequency: z.string(),
  budget: z.string(),
  consumptionMethods: z.string(),
  headspace: z.string(),
  diet: z.string(),
  activityLevel: z.string(),
  medicationUse: z.string(),
  alcoholUse: z.string(),
  cigaretteUse: z.string(),
  createdBy: z.number().optional(),
  updatedBy: z.number().optional(),
});

export type FormRequestsType = z.infer<typeof FormRequestsSchema>;
