import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/error-codes';

export class BaseException extends HttpException {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string, status: HttpStatus) {
    super({ code, message }, status);
    this.code = code;
  }
}
