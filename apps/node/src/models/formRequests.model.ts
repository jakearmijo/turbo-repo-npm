import {
  Table,
  Column,
  Model,
  BelongsTo,
  HasMany,
  ForeignKey,
} from "sequelize-typescript";
import Stores from "./stores.model.js";
import Customers from "./customers.model.js";
import Recommendations from "./recommendations.model.js";

@Table
class FormRequests extends Model {
  @Column
  declare storeId: number;

  @ForeignKey(() => Customers)
  @Column
  declare customerId: number;

  @Column
  declare firstName: string;

  @Column
  declare lastName: string;

  @Column
  declare email: string;

  @Column
  declare dob: string;

  @Column
  declare phone: string;

  @Column
  declare zipCode: string;

  @Column
  declare treatmentCategory: string;

  @Column
  declare treatmentSubcategory: string;

  @Column
  declare experienceLevel: string;

  @Column
  declare frequency: string;

  @Column
  declare budget: string;

  @Column
  declare consumptionMethods: string;

  @Column
  declare headspace: string;

  @Column
  declare diet: string;

  @Column
  declare activityLevel: string;

  @Column
  declare medicationUse: string;

  @Column
  declare alcoholUse: string;

  @Column
  declare cigaretteUse: string;

  @Column
  declare createdBy: number;

  @Column
  declare updatedBy: number;

  @BelongsTo(() => Stores, "storeId")
  declare RetailStore: ReturnType<() => Stores>;

  // @ForeignKey(() => Customers)
  @BelongsTo(() => Customers)
  declare Customer: ReturnType<() => Customers>;

  @HasMany(() => Recommendations, "id")
  declare Recommendations: Recommendations[];
}

export default FormRequests;
