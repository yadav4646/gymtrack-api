export class AppError extends Error {
    constructor(
        public readonly status: number,
        public readonly code: string,
        message: string,
        public readonly details?: unknown,
    ) {
        super(message);
        this.name = new.target.name;
    }
}

export class BadRequestError extends AppError {
    constructor(
        message = "Bad request",
        details?: unknown,
        code = "BAD_REQUEST",
    ) {
        super(400, code, message, details);
    }
}

export class UnauthorizedError extends AppError {
    constructor(
        message = "Unauthorized",
        details?: unknown,
        code = "UNAUTHORIZED",
    ) {
        super(401, code, message, details);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden", details?: unknown, code = "FORBIDDEN") {
        super(403, code, message, details);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Not found", details?: unknown, code = "NOT_FOUND") {
        super(404, code, message, details);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict", details?: unknown, code = "CONFLICT") {
        super(409, code, message, details);
    }
}
