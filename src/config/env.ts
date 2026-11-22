import "dotenv/config";
import { z } from "zod";

const schema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]),
    PORT: z.coerce.number().min(1).max(65535).default(3000),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().min(1),
    DATABASE_URL: z.url(),
    CORS_ORIGIN: z.string(),
    LOG_LEVEL: z
        .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
        .default("info"),
    GYM_TIMEZONE: z.string().default("Asia/Kolkata"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid envireoment variables: ");
    for (const issues of parsed.error.issues) {
        console.error(`${issues.path.join(".")}: ${issues.message}`);
    }
    process.exit(1);
}

export const env = Object.freeze(parsed.data);

export type Env = typeof env;
