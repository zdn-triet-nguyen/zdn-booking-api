import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './controllers/booking.controller';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
