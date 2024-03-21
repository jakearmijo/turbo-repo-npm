import { Table, Column, Model } from "sequelize-typescript";

@Table
class Categories extends Model {
  @Column
  declare name: string;

  @Column
  declare description: string;

  @Column
  declare masterCategory: string;

  // TODO: possible FK here?
  @Column
  declare storeId: number;

  @Column
  declare createdBy: number;

  @Column
  declare updatedBy: number;
}

export default Categories;
