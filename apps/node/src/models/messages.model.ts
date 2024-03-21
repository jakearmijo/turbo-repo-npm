import { DataTypes } from "sequelize";
import {
  Table,
  Column,
  Model,
  BelongsTo,
  DataType,
} from "sequelize-typescript";
import Stores from "./stores.model.js";

@Table
class Messages extends Model {
  @Column
  declare storeId: number;

  @Column
  declare message: string;

  @Column({
    type: DataTypes.ENUM,
    defaultValue: "low priority",
    values: ["low priority", "medium priority", "high priority"],
  })
  declare severity: "low priority" | "medium priority" | "high priority";

  @Column
  declare category: string;

  @Column
  declare subCategory: string;

  @Column
  declare action: string;

  @Column
  declare alert: string;

  @Column
  declare priority: string;

  @Column
  declare reason: string;

  @Column(DataType.JSON)
  declare metadata: object;

  @BelongsTo(() => Stores, "storeId")
  declare Store: ReturnType<() => Stores>;
}

export default Messages;
