import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table
class ProductCatalogs extends Model {
  @Column
  declare brandId: number;

  @Column
  declare brandName: string;

  @Column
  declare categoryId: number;

  @Column
  declare categoryName: string;

  @Column
  declare name: string;

  @Column
  declare parentName: string;

  @Column
  declare strainId: number;

  @Column
  declare strainName: string;

  @Column
  declare strainType: string;

  @Column
  declare measurementUnitId: number;

  @Column(DataType.TEXT)
  declare description: string;

  @Column(DataType.TEXT)
  declare geneticaProductDescription: string;

  @Column(DataType.TEXT)
  declare geneticaStrainDescription: string;

  @Column
  declare imageUrl: string;

  @Column
  declare price: number;

  @Column
  declare storeId: number;

  @Column
  declare storeProductId: number;

  @Column
  declare vendorId: number;

  @Column
  declare vendorName: string;

  @Column
  declare thcContent: number;

  @Column
  declare cbdContent: string;

  @Column
  declare flavors: string;

  @Column
  declare lineageName: string;

  @Column
  declare dosage: number;

  @Column
  declare allergens: string;

  @Column
  declare regulatoryCategory: string;

  @Column
  declare ingredientList: string;

  @Column
  declare g_tags: string;

  @Column
  declare createdBy: number;

  @Column
  declare updatedBy: number;
}

export default ProductCatalogs;
