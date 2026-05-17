import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enums';

export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
