import { Module } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { BookingController } from './controllers/booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './entities/booking.entity';
import { FieldEntity } from '../field/entities/field.entity';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [TypeOrmModule.forFeature([BookingEntity, FieldEntity])],
})
export class BookingModule {}
