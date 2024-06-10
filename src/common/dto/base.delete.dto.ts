import { IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseDto {
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date;

  @IsString()
  deletedBy?: string;
}
