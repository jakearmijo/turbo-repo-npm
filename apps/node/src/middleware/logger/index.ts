import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: "debug",
  format: combine(
    timestamp({
      format: "YYYY-MM-DDTHH:mm:ss.SSSZ",
    }),
    logFormat,
  ),
  transports: [new transports.Console()],
  silent: process.env.NODE_ENV === "test",
});

export default logger;
