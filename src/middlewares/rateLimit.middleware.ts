import RateLimit from 'express-rate-limit';
import { NextFunction, Request, Response } from 'express';

import { TimeExceedError } from '@/error';

const env = process.env.NODE_ENV || 'development';
const rateLimitRequest = Number(process.env.RATE_LIMIT_TIME) || 15;
const rateLimitTime = Number(process.env.RATE_LIMIT_REQUEST) || 100;

export const rateLimitMiddleware = RateLimit({
  windowMs: (env === 'production' ? rateLimitTime : 5) * 60 * 1000,
  max: env === 'production' ? rateLimitRequest : 3000,
  handler: function (_req: Request, _res: Response, next: NextFunction) {
    next(
      new TimeExceedError(
        'Rate limit exceeded, please try again later some time.',
      ),
    );
  },
});
