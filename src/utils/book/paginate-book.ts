// paginateBooks.ts

export const getPaginationOptions = (
  page: string | undefined,
  limit: string | undefined,
): { currentPage: number; itemsPerPage: number } => {
  const parsedPage = parseInt(page || '1');
  const parsedLimit = parseInt(limit || '10');

  const currentPage = parsedPage > 0 ? parsedPage : 1;
  const itemsPerPage = parsedLimit > 0 ? parsedLimit : 10;

  return { currentPage, itemsPerPage };
};
