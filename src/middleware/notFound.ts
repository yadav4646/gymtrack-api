import type { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../lib/errors.js";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(
        new NotFoundError(`Route ${req.method}  ${req.originalUrl} not found`),
    );
};
