import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table
class ProductReviews extends Model {
  @Column
  declare storeId: string;

  @Column
  declare customerId: number;

  @Column
  declare productId: number;

  //PRODUCT INFO (I took TREEZ product data as model here) - we might want to display this info later to users
  @Column
  declare productType: string;

  @Column
  declare productSubtype: string;

  @Column(DataType.TEXT)
  declare feedback: string;

  @Column
  declare productBrand: string;

  @Column
  declare productUnit: string;

  @Column(DataType.FLOAT)
  declare productAmount: number;

  @Column(DataType.INTEGER)
  declare starRating: number;

  @Column(DataType.TEXT)
  declare effectsLiked: string;

  @Column(DataType.TEXT)
  declare positiveMedicalEffects: string;

  @Column(DataType.TEXT)
  declare effectsDisliked: string;

  @Column(DataType.BOOLEAN)
  declare comments: boolean;

  @Column
  declare createdBy: number;

  @Column
  declare updatedBy: number;
}

export default ProductReviews;
