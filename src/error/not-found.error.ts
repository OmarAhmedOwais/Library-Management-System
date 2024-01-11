import { StatusCodes } from 'http-status-codes';

import { ResponseStatus } from '@/types/enums';
import { ApiError } from './api.error';

export class NotFoundError extends ApiError {
  constructor(messages: ApiError['messages'], metadata?: ApiError['metadata']) {
    super({
      statusCode: StatusCodes.NOT_FOUND,
      messages,
      metadata,
      status: ResponseStatus.ERROR,
    });
  }
}
