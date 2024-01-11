import { StatusCodes } from 'http-status-codes';

import { ResponseStatus } from '@/types/enums';
import { ApiError } from './api.error';

export class ApiValidationError extends ApiError {
  constructor(messages: ApiError['messages'], metadata?: ApiError['metadata']) {
    super({
      messages,
      statusCode: StatusCodes.BAD_REQUEST,
      metadata,
      status: ResponseStatus.ERROR,
    });
  }
}
