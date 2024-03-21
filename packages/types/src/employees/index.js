import { z } from "zod";
export const EmployeeStatusValues = ["ACTIVE", "INACTIVE"];
export const EmployeeStatusSchema = z.enum(EmployeeStatusValues);
export const EmployeeRolesValues = ["ADMIN", "OWNER", "MANAGER", "BUD TENDER"];
export const EmployeeRolesSchema = z.enum(EmployeeRolesValues);
export const EmployeeSchema = z.object({
    id: z.number(),
    storeId: z.number(),
    chainName: z.string(),
    chainId: z.number(),
    externalOrgId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    name: z.string(),
    externalId: z.string(),
    loginCount: z.number(),
    email: z.string(),
    phone: z.string(),
    activeStatus: z.enum(["ACTIVE", "INACTIVE"]),
    isDeleted: z.boolean(),
    isDisabled: z.boolean(),
    image: z.string(),
    role: z.string(),
    createdBy: z.number(),
    updatedBy: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    // - - - added for frontend
    isManager: z.boolean(),
    isOwner: z.boolean(),
    isAdmin: z.boolean(),
    isBudTender: z.boolean(),
});
