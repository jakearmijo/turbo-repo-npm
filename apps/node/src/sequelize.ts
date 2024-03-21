import { Sequelize } from "sequelize-typescript";
import SecretsManagerClass from "./aws/secretsManagerClass.js";
import logger from "./middleware/logger/index.js";
import * as allModels from "./models/index.js";

let shouldLog = false;
if (process.env?.DEFAULT_SEQUELIZE_LOGGING === "true") {
  shouldLog = true;
}

const checkEnvironment = async () => {
  logger.info(`NODE ENV is ->${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV !== "production") {
    logger.info("Running Flora Dev PostgresQL in local");
    const floraSequelize = new Sequelize(
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
        logging: shouldLog,
      },
    );
    await floraSequelize.authenticate();

    return floraSequelize;
  } else {
    return await getDbSecretsAndInitSequelize();
  }
};

const getDbSecretsAndInitSequelize = async () => {
  try {
    const secretsManager = new SecretsManagerClass();
    const floraSecret = await secretsManager.getFloraDbSecret();

    const floraSequelize = new Sequelize({
      database: floraSecret.dbname,
      dialect: "postgres",
      username: floraSecret.username,
      password: floraSecret.password,
      models: Object.values(allModels).map((value) => value["default"]),
      define: {
        timestamps: true,
      },
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: shouldLog,
    });

    await floraSequelize.authenticate();

    return floraSequelize;
  } catch (error) {
    logger.error("Unable to connect to the Flora database:", error);
    throw error;
  }
};

const floraSequelize = checkEnvironment();

export default floraSequelize;
