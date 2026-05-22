import { HttpStatus } from '@nestjs/common';
import { ERROR_CODE, ErrorCode } from '../constants/error-codes';
import { BaseException } from './base.exception';

export class ForbiddenException extends BaseException {
  constructor(
    code: ErrorCode = ERROR_CODE.FORBIDDEN,
    message = 'Forbidden',
  ) {
    super(code, message, HttpStatus.FORBIDDEN);
  }
}
