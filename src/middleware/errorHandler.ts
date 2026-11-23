import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import  {AppError, BadRequestError}  from "../lib/errors.js";
import { ZodError } from "zod";


function normalizeError(err: unknown): AppError {
    if (err instanceof AppError) return err;

    if (err instanceof ZodError) {
        return new BadRequestError('Validation Failed', err.issues, 'VALIDATION_ERROR')
    }

    if (err instanceof SyntaxError && 'body' in err) {
        return new BadRequestError("Invalid JSON body", undefined, "INVALID_JSON")
    }

    return new AppError(500, "INTERNAL_ERROR", "Something went wrong"); // unknown bug → 500

}
export function errorHandler(err: unknown): ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) =>{
    if (res.headersSent) return next(err);

    const appError = normalizeError(err)

    if (appError.status >= 500) console.error(err)

    res.status(appError.status).json({
        error: {
            code: appError.code,
            message: appError.message,
            details: appError.details
        }
    })
}
