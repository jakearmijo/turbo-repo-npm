import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table
class Strains extends Model {
  @Column({ unique: true })
  declare strainName: string;

  @Column
  declare strainType: string;

  @Column(DataType.TEXT)
  declare strainDescription: string;

  @Column(DataType.TEXT)
  declare genneticaDescription: string;

  @Column
  declare abbreviation: string;

  @Column(DataType.ARRAY(DataType.STRING))
  declare conditions: string[];

  @Column(DataType.JSON)
  declare activities: object;

  @Column
  declare headspace: string;

  @Column
  declare thcContent: number;

  @Column(DataType.JSON)
  declare effects: object;

  @Column
  declare effectOne: string;

  @Column
  declare effectTwo: string;

  @Column
  declare effectThree: string;

  @Column
  declare terpenes: string;

  @Column(DataType.JSON)
  declare caryophyllene: object;

  @Column(DataType.JSON)
  declare humulene: object;

  @Column(DataType.JSON)
  declare limonene: object;

  @Column(DataType.JSON)
  declare linalool: object;

  @Column(DataType.JSON)
  declare myrcene: object;

  @Column(DataType.JSON)
  declare ocimene: object;

  @Column(DataType.JSON)
  declare pinene: object;

  @Column(DataType.JSON)
  declare terpinolene: object;

  @Column(DataType.JSON)
  declare aroused: object;

  @Column
  declare creative: number;

  @Column
  declare energetic: number;

  @Column
  declare euphoric: number;

  @Column
  declare focused: number;

  @Column
  declare giggly: number;

  @Column
  declare happy: number;

  @Column
  declare hungry: number;

  @Column
  declare relaxed: number;

  @Column
  declare sleepy: number;

  @Column
  declare talkative: number;

  @Column
  declare tingly: number;

  @Column
  declare uplifted: number;

  @Column
  declare createdBy: number;

  @Column
  declare updatedBy: number;
}

export default Strains;
