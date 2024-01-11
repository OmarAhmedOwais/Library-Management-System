import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

import { NotFoundError } from '@/error';
import { MessageType } from '@/types/enums';

export const globalNotFoundMiddleware = expressAsyncHandler(
  async (req: Request, _res: Response): Promise<void> => {
    const message = `Route not found for ${req.method} ${req.path}`;
    throw new NotFoundError([{ message, type: MessageType.ERROR }]);
  },
);
