import "./lib/process-handlers.js";
import { logger } from "./lib/logger.js";

import { app } from "./app.js";
import { env } from "./config/env.js";
import { runCleanups } from "./lib/shutdown.js";

const server = app.listen(env.PORT, () => {
    logger.info("Server is running");
});

let shuttingDown = false;

function shutDown(signal: string) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`${signal} recieved, shutting down`);

    //Backstop: if anything hangs, force-exit after 10s
    setTimeout(() => {
        logger.error("Shutdown timed out, forcing exit");
        process.exit(1);
    }, 10_000).unref();

    // Stop accepting new connections; callbacks runs once in-flight
    server.close(async (err) => {
        if (err) console.error("Error closing server", err);
        await runCleanups();
        process.exit(err ? 1 : 0);
    });

    server.closeIdleConnections();
}

process.on("SIGTERM", () => shutDown("SIGTERM"));

process.on("SIGINT", () => shutDown("SIGINT"));
