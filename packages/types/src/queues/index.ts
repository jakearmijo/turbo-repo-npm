import { z } from "zod";
import { CustomersSchema } from "../customers/index.js";
import { EmployeeSchema } from "../employees/index.js";
import { Recommendation } from "../recommendations/index.js";

export const SlotStatuses = {
  EMPTY: "ACTIVE",
  WAITING: "WAITING",
  ASSIGNED: "ASSIGNED",
  COMPLETED: "COMPLETED",
};

export const QueuesSchema = z.object({
  id: z.number().optional(),
  storeId: z.number(),
  employeeId: z.number().nullable().optional(),
  customerId: z.number(),
  status: z.string(),
  createdBy: z.number().optional(),
  updatedBy: z.number().optional(),
  Customer: CustomersSchema.optional(),
  Employee: EmployeeSchema.optional(),
  // FE only
  recommendations: z.array(z.custom<Recommendation>()).optional(),
});

export type QueueType = z.infer<typeof QueuesSchema>;

export type QueueData = {
  id: number;
  storeId: number;
  customerId: number;
  employeeId: number;
  status: keyof typeof SlotStatuses;
  Customer: typeof CustomersSchema;
  Employee: typeof EmployeeSchema | null;
  recommentations?: Array<{}>;
};

export type QueueUpdate = {
  id: number;
} & Partial<Omit<QueueType, "id">>;
