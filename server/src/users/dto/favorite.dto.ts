import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { DomainEnum } from '../../common/enums';

export class FavoriteDto {
  @IsEnum(DomainEnum)
  domain: DomainEnum;

  @IsInt()
  @IsPositive()
  itemId: number;
}
