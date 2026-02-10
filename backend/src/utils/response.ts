import { Response } from "express";
import { ApiResponse } from "../types";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200,
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 500,
): Response => {
  const response: ApiResponse = {
    success: false,
    error,
  };
  return res.status(statusCode).json(response);
};

export const sendPaginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  message?: string,
): Response => {
  const response: ApiResponse<T[]> = {
    success: true,
    message,
    data,
    pagination,
  };
  return res.status(200).json(response);
};
