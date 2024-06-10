import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseDto {
  // @IsUUID()
  // id: string;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsString()
  createdBy: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;

  @IsOptional()
  @IsString()
  updatedBy?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date;

  @IsOptional()
  @IsString()
  deletedBy?: string;
}
