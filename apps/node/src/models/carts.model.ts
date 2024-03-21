import { Table, Column, Model, BelongsTo } from "sequelize-typescript";
import Stores from "./stores.model.js";

@Table
class StoreCarts extends Model {
  @Column
  declare storeId: number;

  @Column
  declare customerId: number;

  @Column
  declare itemId: number;

  @Column
  declare quantity: number;

  @Column
  declare createdBy: number;

  @Column
  declare updatedBy: number;

  @BelongsTo(() => Stores, "storeId")
  declare Stores: Stores[];
}

export default StoreCarts;
