import { z } from "zod";
import { RecommendationsSchema } from "../recommendations/index.js";

export const TermsAndConditionsStatusSchema = z.object({
  hasReadTermsAndConditions: z.boolean(),
  hasReadHipaa: z.boolean(),
  hasReadPrivacyPolicy: z.boolean(),
});

export interface ContactInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  zipCode: string;
  password: string;
  notificationEnabled: boolean;
}

export const IdentityInformationSchema = z.object({
  idType: z.string(),
  driversLicense: z.string(),
  driversLicenseExpiration: z.string(),
  gender: z.string().nullable(),
  address: z.string().nullable(),
  address2: z.string().nullable(),
  address3: z.string().nullable(),
  eyeColor: z.string().nullable(),
});

export const UsageHistorySchema = z.object({
  experienceLevel: z.number(),
  frequency: z.number(),
});

export const TreatmentInfoSchema = z.object({
  preferNotToSay: z.boolean(),
  treatmentCategory: z.number(),
  treatmentSubcategory: z.number().array(),
});

export const ConsumableInteractionsSchema = z.object({
  medicationUse: z.number(),
  alcoholUse: z.number(),
  alcoholUseStatus: z.number(),
  cigaretteUse: z.number(),
});

export const RatingUpdatePayloadSchema = z.object({
  recommendationId: z.number(),
  ratingId: z.number(),
  effectivenessId: z.number(),
  negativeSideEffectId: z.number(),
  symptomReliefId: z.number(),
});

export const CustomersSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  address: z.string(),
  activityLevel: z.string(),
  age: z.number(),
  ageLimit: z.number(),
  alcoholUse: z.number(),
  alcoholUseStatus: z.number(),
  birthDate: z.string(),
  budget: z.string(),
  cigaretteUse: z.number(),
  consumptionMethods: z.string().array(),
  diet: z.string(),
  driversLicense: z.string(),
  driversLicenseExpiration: z.string(),
  email: z.string(),
  experienceLevel: z.number(),
  eyeColor: z.string(),
  firstName: z.string(),
  frequency: z.number(),
  gender: z.string(),
  hasReadHipaa: z.boolean(),
  hasReadPrivacyPolicy: z.boolean(),
  hasReadTermsAndConditions: z.boolean(),
  headspace: z.string(),
  idType: z.string(),
  isAnonymous: z.boolean(),
  isNewCustomer: z.boolean(),
  lastName: z.string(),
  medicationUse: z.number(),
  middleName: z.string(),
  notificationEnabled: z.boolean(),
  pastEffectiveness: z.string(),
  password: z.string(),
  phone: z.string(),
  postalCode: z.string(),
  preferNotToSay: z.boolean(),
  recommendations: z.array(RecommendationsSchema),
  showReviewPopup: z.boolean(),
  storeId: z.string(),
  treatmentCategory: z.string(),
  treatmentSubcategory: z.string().array(),
  createdBy: z.number().optional(),
  updatedBy: z.number().optional(),
});

export type CustomersType = z.infer<typeof CustomersSchema>;

export interface CustomerInfoState {
  id: number;
  storeId: string;
  ageLimit: number;
  termsAndConditionsStatus: typeof TermsAndConditionsStatusSchema;
  contactInfo: ContactInfo;
  identityInformation: typeof IdentityInformationSchema;
  age: number;
  usageHistory: typeof UsageHistorySchema;
  pastEffectiveness: number;
  consumptionMethods: Array<string>;
  treatmentInfo: typeof TreatmentInfoSchema;
  headspace: number;
  budget: number;
  diet: number;
  activityLevel: number;
  consumableInteractions: typeof ConsumableInteractionsSchema;
  recommendations: Array<typeof RecommendationsSchema>;
  isNewCustomer: boolean;
  isAnonymous: boolean;
  showReviewPopup: boolean;
}

export type PasswordResetLinkApiData = {
  email: string;
};

export type ResetPasswordApiData = {
  password: string;
  token: string;
};
