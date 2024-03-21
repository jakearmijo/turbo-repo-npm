import {
  Table,
  Column,
  Model,
  BelongsTo,
  HasMany,
  DataType,
} from "sequelize-typescript";
import Chains from "./chains.model.js";
import Employees from "./employees.model.js";
import Inventories from "./inventories.model.js";
import FormRequests from "./formRequests.model.js";
import Queues from "./queues.model.js";

@Table
class Stores extends Model {
  @Column
  declare chainId: number;

  @Column
  declare ageLimit: number;

  @Column
  declare name: string;

  @Column
  declare address: string;

  @Column
  declare phone: string;

  @Column
  declare city: string;

  @Column
  declare state: string;

  @Column
  declare zip: string;

  @Column
  declare location: string;

  @Column
  declare message: string;

  @Column
  declare externalOrgId: string;

  @Column
  declare licenseNumber: string;

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

  @BelongsTo(() => Chains, "chainId")
  declare Chain: Chains;

  @HasMany(() => Employees, "storeId")
  declare Employees: Employees[];

  @HasMany(() => Inventories, "storeId")
  declare Inventories: Inventories[];

  @HasMany(() => FormRequests, "storeId")
  declare FormRequests: FormRequests[];

  @HasMany(() => Queues, "storeId")
  declare Queues: Queues[];
}

export default Stores;
