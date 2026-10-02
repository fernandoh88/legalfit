import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code = "API_ERROR"
  ) {
    super(message);
  }
}

export const notFound = (message = "Resource not found") => new ApiError(404, message);

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        message: "Invalid request",
        details: error.flatten()
      }
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
    return;
  }

  res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" } });
};
