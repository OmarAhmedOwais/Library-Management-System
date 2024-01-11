// sortUsers.ts
import { User, Prisma } from '@prisma/client';

export const getUserSortOptions = (
  sort: string | undefined,
):
  | Prisma.UserOrderByWithRelationInput
  | Prisma.UserOrderByWithRelationInput[]
  | undefined => {
  //  EX: ?title:asc,name:des
  if (sort) {
    const sortArray = sort.split(',');
    const sortOptions = sortArray.map((sortOption) => {
      const [field, order] = sortOption.split(':') as [
        keyof User,
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
