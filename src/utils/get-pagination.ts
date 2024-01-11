import { ApiPagination } from './api-response';

interface PaginationParams {
  total: number;
  limit: number;
  length: number;
  page: number;
}
export const getPagination = ({
  total,
  limit,
  length,
  page,
}: PaginationParams): ApiPagination => {
  const pages = Math.ceil(total / Number(limit));
  return {
    length,
    page,
    limit,
    pages,
    total,
  };
};
