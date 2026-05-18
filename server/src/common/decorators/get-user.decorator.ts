import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface RequestUser {
  id: number;
  role: string;
}

export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): RequestUser => ctx.switchToHttp().getRequest().user,
);
