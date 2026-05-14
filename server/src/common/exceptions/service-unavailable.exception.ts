import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/error-codes';
import { BaseException } from './base.exception';

export class ServiceUnavailableException extends BaseException {
  constructor(code: ErrorCode, message: string) {
    super(code, message, HttpStatus.SERVICE_UNAVAILABLE);
  }
}
