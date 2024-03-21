import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
} from "sequelize-typescript";
import Customers from "./customers.model.js";
import Employees from "./employees.model.js";
import Stores from "./stores.model.js";

@Table
class Queues extends Model {
  @Column({ type: DataType.INTEGER })
  declare storeId: number;

  @Column({ type: DataType.INTEGER })
  declare employeeId: number | null;

  @Column({ type: DataType.INTEGER })
  declare customerId: number;

  @Column
  declare status: string;

  @Column
  declare createdBy: number;

  @Column
  declare updatedBy: number;

  @BelongsTo(() => Customers, "customerId")
  declare Customer: ReturnType<() => Customers>;

  @BelongsTo(() => Employees, "employeeId")
  declare Employee: ReturnType<() => Employees>;

  @BelongsTo(() => Stores, "storeId")
  declare Store: ReturnType<() => Stores>;
}

export default Queues;
