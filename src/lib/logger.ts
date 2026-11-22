import pino, { type LoggerOptions } from "pino";
import { env } from "../config/env.js";

const isProd = env.NODE_ENV === "production";

const options: LoggerOptions = {
    level: env.LOG_LEVEL ?? (isProd ? "info" : "debug"),
    // Adds this to every log
    base: { service: "gymTrack-api" },

    timestamp: pino.stdTimeFunctions.isoTime,

    redact: {
        paths: [
            "req.headers.authorization",
            "req.headers.cookie",
            'req.headers["set-cookie"]',
            "req.headers.password",
            "*.password",
            "*.token",
            "*.refreshToken",
        ],
        censor: "[REDACTED]",
    },
};

if (!isProd) {
    options.transport = {
        target: "pino-preety",

        options: {
            colorize: true,
            translateTime: "SYS:HH:MM:ss",
            ignore: "pid,hostname",
        },
    };
}

export const logger = pino(options);
