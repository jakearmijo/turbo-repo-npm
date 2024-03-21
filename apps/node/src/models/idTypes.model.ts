import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table
class IdTypes extends Model {
  @Column
  declare name: string;

  @Column
  declare description: string;

  @Column
  declare isStateId: boolean;

  @Column
  declare isMedicalId: boolean;

  @Column
  declare isInsuranceId: boolean;

  @Column
  declare isMrz: boolean;

  @Column(DataType.ARRAY(DataType.STRING))
  declare states: [];

  @Column
  declare createdBy: number;

  @Column
  declare updatedBy: number;
}

export default IdTypes;
