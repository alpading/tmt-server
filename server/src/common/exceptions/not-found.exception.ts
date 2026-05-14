import { HttpStatus } from '@nestjs/common';
import { ERROR_CODE, ErrorCode } from '../constants/error-codes';
import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  constructor(
    code: ErrorCode = ERROR_CODE.RESOURCE_NOT_FOUND,
    message = 'Resource not found',
  ) {
    super(code, message, HttpStatus.NOT_FOUND);
  }
}
