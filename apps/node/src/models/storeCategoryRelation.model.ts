import { Table, Column, Model } from "sequelize-typescript";

@Table
class StoreCategoryRelation extends Model {
  @Column
  declare storeId: number;

  @Column
  declare customerId: number;

  @Column
  declare categories: string;

  @Column
  declare headspace: string;

  @Column
  declare pastEffectiveness: string;

  @Column
  declare createdBy: number;

  @Column
  declare updatedBy: number;
}

export default StoreCategoryRelation;
