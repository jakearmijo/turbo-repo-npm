import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import Customers from "./customers.model.js";
import FormRequests from "./formRequests.model.js";

@Table
class Recommendations extends Model {
  @ForeignKey(() => Customers)
  @Column
  declare customerId: number;

  @Column
  declare inventoryId: number;

  @Column
  declare employeeId: number;

  @Column
  declare storeId: number;

  @ForeignKey(() => FormRequests)
  @Column
  declare formRequestId: number;

  @Column
  declare sesPlaneRequestId: string;

  @Column(DataType.TEXT)
  declare category: string;

  @Column(DataType.TEXT)
  declare subCategory: string;

  @Column(DataType.JSON)
  declare products: object;

  @Column
  declare createdBy: number;

  @Column
  declare updatedBy: number;

  @BelongsTo(() => Customers)
  declare Customer: ReturnType<() => Customers>;

  @BelongsTo(() => FormRequests)
  declare FormRequest: ReturnType<() => FormRequests>;
}

export default Recommendations;
