import { logger } from "./logger.js";

process.on("uncaughtException", (err) => {
    logger.fatal({ err }, "Uncaught exception, exiting");
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    logger.fatal({ err: reason }, "Unhadndled promise rejection, exiting");
    process.exit(1);
});
