import expressAsyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';

import { UnauthorizedError } from '@/error';
import { prisma, verifyToken } from '@/utils';

export const authMiddleware = expressAsyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = <string | undefined>req.session?.token;

    if (!token) {
      throw new UnauthorizedError('Session expired, please login again');
    }

    const { id, createdAt } = verifyToken(token);

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new UnauthorizedError('Your Account is not exist');
    }

    // check if user change password after token issued
    if (user.passwordChangeAt.getTime() > createdAt) {
      throw new UnauthorizedError(
        'You have changed your password recently, please login again',
      );
    }

    req.user = user;

    next();
  },
);
