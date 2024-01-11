import expressAsyncHandler from 'express-async-handler';
import { matchedData, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

import { ApiError, ApiValidationError } from '@/error';
import { MessageType } from '@/types/enums';

export const validationMiddleware = expressAsyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const messages: ApiError['messages'] = result
        .array({ onlyFirstError: true })
        .map((error) => ({ message: error.msg, type: MessageType.ERROR }));
      throw new ApiValidationError(messages, result.array());
    }

    const matchedBody = matchedData(req, { locations: ['body'] });
    const matchedParams = matchedData(req, { locations: ['params'] });

    req.body = matchedBody;
    req.params = matchedParams;

    next();
  },
);
