import { UnauthorizedError } from '@/error';
import { prisma } from '@/utils';
import { Role } from '@prisma/client';
import expressAsyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';

export const allowedTo = (...roles: Role[]) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user!.role)) {
        throw new UnauthorizedError('You are not authorized');
      }

      next();
    },
  );
