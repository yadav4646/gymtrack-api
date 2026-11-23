import express from "express";
import { apiRouter } from "./routes.js";
import { pinoHttp } from "pino-http";
import { logger } from "./lib/logger.js";
import { randomUUID } from "node:crypto";
import helmet from "helmet";
import { env } from "./config/env.js";
import cors from "cors";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(
    pinoHttp({
        logger,
        genReqId: (req, res) => {
            const id = (req.headers["x-request-id"] as string) ?? randomUUID();
            res.setHeader("x-request-id", id);
            return id;
        },
        customLogLevel: (_req, res, err) =>
            err || res.statusCode >= 500
                ? "error"
                : res.statusCode >= 400
                  ? "warn"
                  : "info",
        autoLogging: { ignore: (req) => req.url === "/health" },
    }),
);

// Helmet

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));

app.use(express.json({ limit: "100kb" }));
app.use(apiRouter);
app.use(notFound);
app.use(errorHandler);
