import { createLogger, transports, format } from "winston";
import path from "path";
import fs from "fs";
import DailyRotateFile from "winston-daily-rotate-file";
import { environment, logDirectory } from "../config/config.js";

// Ensure log directory exists
const dir = logDirectory || "logs";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Set log level based on environment
const logLevel = environment === "development" ? "debug" : "warn";

// Setup daily rotate file transport
const dailyRotateFile = new DailyRotateFile({
  level: logLevel,
  filename: path.join(dir, "%DATE%-results.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: format.combine(format.timestamp(), format.json()),
});

// Create logger
const logger = createLogger({
  transports: [
    new transports.Console({
      level: logLevel,
      format: format.combine(
        format.errors({ stack: true }),
        format.colorize(),
        format.prettyPrint()
      ),
    }),
    dailyRotateFile,
  ],
  exceptionHandlers: [dailyRotateFile],
  exitOnError: false,
});

export default logger;
