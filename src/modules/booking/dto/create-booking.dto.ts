import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { BookingStatus } from 'src/modules/booking/entities/booking.entity';
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

  @IsEnum(BookingStatus)
  status: BookingStatus = BookingStatus.BOOKING;
}
