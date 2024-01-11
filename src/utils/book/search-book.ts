// searchBooks.ts
import { Prisma } from '@prisma/client';

export const getSearchOptions = (
  search: string | undefined,
): Prisma.BookWhereInput | undefined => {
  return search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } },
          { ISBN: { contains: search, mode: 'insensitive' } },
        ] as Prisma.BookWhereInput[],
      }
    : undefined;
};
