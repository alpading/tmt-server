import { HttpStatus } from '@nestjs/common';
import { ERROR_CODE } from '../constants/error-codes';
import { BaseException } from './base.exception';

export class InternalServerException extends BaseException {
  constructor(cause?: Error) {
    super(
      ERROR_CODE.INTERNAL_SERVER_ERROR,
      cause?.message ?? 'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
