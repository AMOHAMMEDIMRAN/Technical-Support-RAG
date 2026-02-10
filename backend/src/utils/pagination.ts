import { PaginationQuery } from "../types";

export const getPaginationParams = (query: any): PaginationQuery => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  return { page, limit, sortBy, sortOrder };
};

export const getPaginationMeta = (
  page: number,
  limit: number,
  total: number,
) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const getSkipValue = (page: number, limit: number): number => {
  return (page - 1) * limit;
};
