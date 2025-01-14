import { Module } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { BookingController } from './controllers/booking.controller';
import { BookingEntity } from './entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportFieldEntity } from '../sport-field/entities/sport-field.entity';
import { FieldEntity } from '../field/entities/field.entity';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [
    TypeOrmModule.forFeature([BookingEntity, SportFieldEntity, FieldEntity]),
  ],
  exports: [BookingService],
})
export class BookingModule {}
