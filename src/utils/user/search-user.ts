// searchUsers.ts
import { Prisma } from '@prisma/client';

export const getUserSearchOptions = (
  search: string | undefined,
): Prisma.UserWhereInput | undefined => {
  return search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ] as Prisma.UserWhereInput[],
      }
    : undefined;
};
