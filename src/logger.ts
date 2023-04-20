import winston from "winston";
import { format } from "date-fns";

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: "HH:mm:ss YYYY-MM-DD",
        }),
        winston.format.printf(
          (info) => `[${info.timestamp}] [${info.level}]: ${info.message}`
        )
      ),
    }),
  ],
});
