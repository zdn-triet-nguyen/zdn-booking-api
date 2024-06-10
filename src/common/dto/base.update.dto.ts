import { IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseDto {
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;

  @IsString()
  updatedBy?: string;
}
