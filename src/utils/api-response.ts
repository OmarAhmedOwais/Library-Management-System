import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import { MessageType, ResponseStatus } from '@/types/enums';

export interface ApiPagination {
  total: number;
  limit: number;
  page: number;
  pages: number;
  length: number;
}

interface ApiResponseOptions {
  name: string;
  statusCode: StatusCodes;
  status: ResponseStatus;
  messages: { message: string; type: MessageType }[];
  pagination?: ApiPagination;
  data: any;
  metadata?: any;
}

export class ApiResponse {
  public statusCode;
  name;
  status;
  messages;
  pagination?: ApiPagination;
  data;
  constructor({
    statusCode = StatusCodes.OK,
    messages,
    data,
    pagination,
  }: {
    messages: ApiResponseOptions['messages'];
    data: ApiResponseOptions['data'];
    statusCode?: ApiResponseOptions['statusCode'];
    pagination?: ApiResponseOptions['pagination'];
  }) {
    this.name = getReasonPhrase(statusCode);
    this.statusCode = statusCode;
    this.status = ResponseStatus.SUCCESS;
    this.messages = messages;
    if (pagination) {
      this.pagination = {
        pages: pagination.pages,
        page: pagination.page,
        length: pagination.length,
        limit: pagination.limit,
        total: pagination.total,
      };
    }
    this.data = data;
  }
}
