import { Table, Column, Model, HasMany } from "sequelize-typescript";
import FormRequests from "./formRequests.model.js";
import Queues from "./queues.model.js";
import Recommendations from "./recommendations.model.js";

@Table
class Customers extends Model {
  @Column
  declare name: string;

  @Column
  declare dob: Date;

  @Column
  declare firstName: string;

  @Column
  declare middleName: string;

  @Column
  declare lastName: string;

  @Column
  declare phone: string;

  @Column
  declare email: string;

  @Column
  declare password: string;

  @Column
  declare storeId: number;

  @Column
  declare status: string;

  @Column
  declare address: string;

  @Column
  declare city: string;

  @Column
  declare driversLicense: string;

  @Column
  declare driversLicenseExpiration: string;

  @Column
  declare gender: string;

  @Column
  declare postalCode: string;

  @Column
  declare medicalIdNumber: string;

  @Column
  declare experienceLevel: string;

  @Column
  declare frequency: string;

  @Column
  declare pastEffectiveness: string;

  @Column({
    type: "JSONB",
  })
  declare treatmentInfo: {
    preferNotToSay: boolean;
    treatmentCategory: string[];
    treatmentSubcategory: number[];
  };

  @Column
  declare preferNotToSay: string;

  @Column({
    type: "JSONB",
  })
  declare termsAndConditionsStatus: {
    hasReadTermsAndConditions: boolean;
    hasReadHipaa: boolean;
    hasReadPrivacyPolicy: boolean;
  };

  @Column
  declare zipCode: string;

  @Column
  declare notificationEnabled: boolean;

  @Column
  declare headspace: string;

  @Column
  declare budget: string;

  @Column
  declare diet: string;

  @Column
  declare activityLevel: string;

  @Column({
    type: "JSONB",
  })
  declare consumableInteractions: {
    medicationUseId: string;
    alcoholUseId: string;
    cigaretteUseId: string;
  };

  @Column
  declare isAnonymous: boolean;

  @Column
  declare medicationUse: string;

  @Column
  declare alcoholUse: string;

  @Column
  declare cigaretteUse: string;

  @Column
  declare treatmentCategory: string;

  @Column
  declare treatmentSubcategory: string;

  @Column
  declare consumptionMethods: string;

  @Column
  declare isNewCustomer: boolean;

  @Column
  declare createdBy: number;

  @Column
  declare updatedBy: number;

  @HasMany(() => FormRequests)
  declare FormRequests: FormRequests[];

  @HasMany(() => Queues, "customerId")
  declare Queues: Queues[];

  @HasMany(() => Recommendations)
  declare Recommendations: Recommendations[];
}

export default Customers;
