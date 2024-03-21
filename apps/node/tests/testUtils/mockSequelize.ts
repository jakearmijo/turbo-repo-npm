import { Sequelize } from "sequelize-typescript";
import * as allModels from "../../src/models/index";
import { jest } from "@jest/globals";

const mockSequelize = new Sequelize(
  `${process.env.LOCAL_FLORA_DB_NAME}`,
  `${process.env.LOCAL_FLORA_DB_USER_NAME}`,
  `${process.env.LOCAL_FLORA_DB_PASSWORD}`,
  {
    host: process.env.LOCAL_FLORA_DB_HOST || "localhost",
    port: parseInt(process.env.LOCAL_FLORA_DB_PORT || "5432"),
    dialect: "postgres",
    models: Object.values(allModels).map((value) => value["default"]),
    define: {
      timestamps: true,
    },
    ssl: false,
    logging: false,
  },
);

mockSequelize.transaction = jest.fn() as any;

const closeConnection = async (db: Sequelize) => {
  await db.close();
};

export default mockSequelize;
export { closeConnection };
