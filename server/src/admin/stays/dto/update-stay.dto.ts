import { PartialType } from '@nestjs/mapped-types';
import { CreateStayDto } from './create-stay.dto';

export class UpdateStayDto extends PartialType(CreateStayDto) {}
