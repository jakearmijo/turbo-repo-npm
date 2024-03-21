import { z } from "zod";

export const EmployeeSlotsSchema = z.object({
  id: z.number().optional(),
  slotId: z.number(),
  customerId: z.number(),
  storeId: z.number(),
  employeeId: z.number(),
  externalId: z.string(),
  externalOrgId: z.string(),
  queueNumber: z.number(),
  status: z.string(),
  customer: z.object({}),
  applicationUser: z.object({}),
  createdBy: z.number().optional(),
  createdAt: z.date().optional(),
  updatedBy: z.number().optional(),
  updatedAt: z.date().optional(),
});

export type EmployeeSlotsType = z.infer<typeof EmployeeSlotsSchema>;