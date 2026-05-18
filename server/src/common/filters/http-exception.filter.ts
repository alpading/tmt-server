import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_CODE } from '../constants/error-codes';
import { BaseException } from '../exceptions/base.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    let status: number;
    let code: string;
    let message: string;

    if (exception instanceof BaseException) {
      const body = exception.getResponse() as { code: string; message: string };
      status = exception.getStatus();
      code = body.code;
      message = body.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      if (status === HttpStatus.NOT_FOUND) code = ERROR_CODE.ROUTE_NOT_FOUND;
      else if (status === HttpStatus.BAD_REQUEST) code = ERROR_CODE.INVALID_FORMAT;
      else if (status === HttpStatus.UNAUTHORIZED) code = ERROR_CODE.UNAUTHORIZED;
      else if (status === HttpStatus.FORBIDDEN) code = ERROR_CODE.FORBIDDEN;
      else code = ERROR_CODE.INTERNAL_SERVER_ERROR;
      message = exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = ERROR_CODE.INTERNAL_SERVER_ERROR;
      message = exception instanceof Error ? exception.message : 'Internal server error';
    }

    const context = `[${req.method}] ${req.url}`;

    if (status >= 500 && status !== 503) {
      this.logger.error(`${context} ${status} ${code}: ${message}`);
    } else if (status === 503 || status >= 400) {
      this.logger.warn(`${context} ${status} ${code}: ${message}`);
    }

    res.status(status).json({ error: { code, message } });
  }
}
