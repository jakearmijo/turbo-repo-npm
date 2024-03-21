import { z } from "zod";

export type LabResults = {
  labTest: string;
  value: number;
  labResultUnitId: number;
  labResultUnit: string;
};

export const LabResultsSchema = z.object({
  labTest: z.string().optional(),
  value: z.number().optional(),
  labResultUnitId: z.number().optional(),
  labResultUnit: z.string().optional(),
})

export type LabResultsType = z.infer<typeof LabResultsSchema>;

export const InventoriesSchema = z.object({
  id: z.number().optional(),
  productId: z.number(),
  storeId: z.number(),
  productName: z.string(),
  imageUrl: z.string(),
  category: z.string(),
  masterCategory: z.string(),
  description: z.string(),
  geneticaDescription: z.string(),
  geneticaProductDescription: z.string(),
  geneticaStrainDescription: z.string(),
  batchId: z.number(),
  batchName: z.string(),
  quantityAvailable: z.number(),
  unitWeight: z.number(),
  unitWeightUnit: z.string(),
  unitPrice: z.number(),
  medUnitPrice: z.number(),
  recUnitPrice: z.number(),
  pricingTierName: z.string(),
  strainId: z.string(),
  strainName: z.string(),
  strainType: z.string(),
  labResults: z.array(z.object({})),
  testedDate: z.date(),
  sampleDate: z.date(),
  packagedDate: z.date(),
  manufacturingDate: z.date(),
  labTestStatus: z.string(),
  vendor: z.string(),
  vendorId: z.number(),
  expirationDate: z.number(),
  brandId: z.string(),
  brandName: z.string(),
  medicalOnly: z.boolean(),
  externalPackageId: z.string(),
  producer: z.string(),
  potencyIndicator: z.number(),
  flavors: z.string(),
  headspace: z.string(),
  effects: z.string(),
  terpenes: z.string(),
  thccontent: z.string(),
  cbdcontent: z.string(),
  cannabinoids: z.string(),
  cannabinoidLevels: z.string(),
  tags: z.array(z.object({})),
  createdBy: z.number(),
  updatedBy: z.number(),
  RetailStore: z.object({}),
});

export type InventoriesType = z.infer<typeof InventoriesSchema>;

export type InventoryInfo = {
  [productId: string]: {
    category: string;
    masterCategory: string;
    qtyAvailable: number;
    unitPrice: number;
  };
};
