// sortBooks.ts
import { Book, Prisma } from '@prisma/client';

export const getSortOptions = (
  sort: string | undefined,
):
  | Prisma.BookOrderByWithRelationInput
  | Prisma.BookOrderByWithRelationInput[]
  | undefined => {
  //  EX: ?title:asc,name:des
  if (sort) {
    const sortArray = sort.split(',');
    const sortOptions = sortArray.map((sortOption) => {
      const [field, order] = sortOption.split(':') as [
        keyof Book,
        Prisma.SortOrder,
      ];
      return {
        [field]: order,
      };
    });
    return sortOptions;
  }
  return undefined;
};
