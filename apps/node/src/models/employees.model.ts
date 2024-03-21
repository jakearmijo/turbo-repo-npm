import {
  Table,
  Column,
  Model,
  HasMany,
  BelongsTo,
  DataType,
} from "sequelize-typescript";
import Stores from "./stores.model.js";
import Queues from "./queues.model.js";
import * as floraTypes from "@repo/types";
const { EmployeeStatusSchema } = floraTypes;

@Table
class Employees extends Model {
  @Column
  declare storeId: number;

  @Column
  declare chainName: string;

  @Column
  declare chainId: number;

  @Column
  declare externalOrgId: string;

  @Column
  declare firstName: string;

  @Column
  declare lastName: string;

  @Column
  declare name: string;

  @Column
  declare externalId: string;

  @Column
  declare loginCount: number;

  @Column
  declare email: string;

  @Column
  declare phone: string;

  @Column({
    defaultValue: "INACTIVE",
    type: DataType.ENUM,
    values: EmployeeStatusSchema.options,
    validate: {
      isIn: [EmployeeStatusSchema.options],
    },
  })
  declare activeStatus: typeof EmployeeStatusSchema.enum;

  @Column
  declare isDeleted: boolean;

  @Column
  declare isDisabled: boolean;

  @Column
  declare image: string;

  @Column
  declare role: string;

  @Column
  declare createdBy: number;

  @Column
  declare updatedBy: number;

  @BelongsTo(() => Stores, "storeId")
  declare Store: ReturnType<() => Stores>;

  @HasMany(() => Queues, "employeeId")
  declare Queues: Queues[];
}

export default Employees;
