import { IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseCreateDto {
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsString()
  createdBy: string;
}
