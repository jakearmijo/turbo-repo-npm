import dotenv from "dotenv";
import logger from "../middleware/logger/index.js";

dotenv.config();

function getEnvPath(): string {
  switch (process.env?.NODE_ENV) {
    case "development":
      return "./config/env/.env.development";
    case "staging":
      return "./config/env/.env.staging";
    case "production":
      return "./config/env/.env.production";
    default:
      throw new Error(`'NODE_ENV' ${process.env.NODE_ENV} is not handled!`);
  }
}
// Load the environment-specific .env file
const envPath = getEnvPath();
dotenv.config({ path: envPath });
logger.info(
  `⚙️ ⚙️ ⚙️ The Configured environment is '${(
    process.env.NODE_ENV ?? ""
  ).toUpperCase()}'`,
);
