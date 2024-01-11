import { StatusCodes } from 'http-status-codes';

import { ApiError } from './api.error';

import { MessageType, ResponseStatus } from '@/types/enums';

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super({
      messages: [{ message, type: MessageType.ERROR }],
      statusCode: StatusCodes.UNAUTHORIZED,
      status: ResponseStatus.FAIL,
    });
  }
}
