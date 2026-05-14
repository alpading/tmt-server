import { ErrorCode } from '../constants/error-codes';

export class ConfigurationError extends Error {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
