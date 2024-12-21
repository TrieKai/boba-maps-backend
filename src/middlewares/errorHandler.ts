import { Request, Response, NextFunction } from "express";
import { ValidationError } from "sequelize";
import { ApiResponse } from "../types";

export class AppError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      header: { status: "error" },
      body: { data: { error: err.message } },
    });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      header: { status: "error" },
      body: { data: { error: err.errors[0].message } },
    });
  }

  return res.status(500).json({
    header: { status: "error" },
    body: { data: { error: "Internal server error" } },
  });
};

export const notFound = (req: Request, res: Response): Response => {
  return res.status(404).json({
    header: { status: "error" },
    body: { data: { error: "Route not found" } },
  });
};
