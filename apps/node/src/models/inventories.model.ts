import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
} from "sequelize-typescript";
import Stores from "./stores.model.js";

@Table
class Inventories extends Model {
  @Column
  declare productId: number;

  @Column
  declare storeId: number;

  @Column
  declare productName: string;

  @Column
  declare imageUrl: string;

  @Column
  declare category: string;

  @Column
  declare masterCategory: string;

  @Column(DataType.TEXT)
  declare description: string;

  @Column(DataType.TEXT)
  declare geneticaDescription: string;

  @Column(DataType.TEXT)
  declare geneticaProductDescription: string;

  @Column(DataType.TEXT)
  declare geneticaStrainDescription: string;

  @Column
  declare batchId: number;

  @Column
  declare batchName: string;

  @Column
  declare quantityAvailable: number;

  @Column
  declare unitWeight: number;

  @Column
  declare unitWeightUnit: string;

  @Column
  declare unitPrice: number;

  @Column
  declare medUnitPrice: number;

  @Column
  declare recUnitPrice: number;

  @Column
  declare pricingTierName: string;

  @Column
  declare strainId: string;

  @Column
  declare strainName: string;

  @Column
  declare strainType: string;

  @Column(DataType.ARRAY(DataType.JSON))
  declare labResults: [];

  @Column
  declare testedDate: Date;

  @Column
  declare sampleDate: Date;

  @Column
  declare packagedDate: Date;

  @Column
  declare manufacturingDate: Date;

  @Column
  declare labTestStatus: string;

  @Column
  declare vendor: string;

  @Column
  declare vendorId: number;

  @Column
  declare expirationDate: number;

  @Column
  declare brandId: string;

  @Column
  declare brandName: string;

  @Column
  declare medicalOnly: boolean;

  @Column
  declare externalPackageId: string;

  @Column
  declare producer: string;

  @Column
  declare potencyIndicator: number;

  @Column
  declare flavors: string;

  @Column
  declare headspace: string;

  @Column
  declare effects: string;

  @Column
  declare terpenes: string;

  @Column
  declare thccontent: string;

  @Column
  declare cbdcontent: string;

  @Column
  declare cannabinoids: string;

  @Column
  declare cannabinoidLevels: string;

  @Column(DataType.ARRAY(DataType.JSON))
  declare tags: [];

  @Column
  declare createdBy: number;

  @Column
  declare updatedBy: number;

  @BelongsTo(() => Stores, "storeId")
  declare RetailStore: ReturnType<() => Stores>;
}

export default Inventories;
