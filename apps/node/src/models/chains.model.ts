import { Table, Column, Model, HasMany, DataType } from "sequelize-typescript";
import Stores from "./stores.model.js";

@Table
class Chains extends Model {
  @Column
  declare name: string;

  @Column
  declare address: string;

  @Column
  declare phone: string;

  @Column
  declare logo: string;

  @Column
  declare externalOrgId: string;

  @Column({
    defaultValue: false,
    type: DataType.BOOLEAN,
  })
  declare addToCart: boolean;
  @Column({
    defaultValue: false,
    type: DataType.BOOLEAN,
  })
  declare budTenderViewFinancials: boolean;
  @Column({
    defaultValue: false,
    type: DataType.BOOLEAN,
  })
  declare whiteLabeling: boolean;

  @Column
  declare createdBy: number;

  @Column
  declare updatedBy: number;

  @HasMany(() => Stores, "chainId")
  declare stores: Stores[];
}

export default Chains;
