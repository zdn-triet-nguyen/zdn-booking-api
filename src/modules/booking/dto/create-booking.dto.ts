import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';
export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  fieldId: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @IsNotEmpty()
  @IsPositive()
  amount: number;
}
