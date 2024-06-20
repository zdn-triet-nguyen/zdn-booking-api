import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateStatusBookingDto } from '../dto/update-status-booking.dto';
import { API_BEARER_AUTH } from 'src/constants/constants';
import { User } from 'src/decorators/user.decorator';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { ReadUserDTO } from 'src/modules/user/dto/read-user-dto';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { BookingService } from '../services/booking.service';
import { ReadBookingDto } from '../dto/read-booking.dto';

@Controller('booking')
@ApiBearerAuth(API_BEARER_AUTH)
@UseInterceptors(TransformInterceptor)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Delete('remove-bookings/:id')
  removeBookings(@Param('id') id: string) {
    return this.bookingService.removeBookingOfSportField(id);
  }
  @Patch('update-status-booking/:id')
  updateStatusBookings(
    @Param('id') id: string,
    @Body() data: UpdateStatusBookingDto,
  ) {
    return this.bookingService.updateStatusBooking(id, data);
  }
  @Post()
  create(
    @User() user: ReadUserDTO,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingService.createBooking(user, createBookingDto);
  }

  @Get()
  getBookings(@Body() readBookingDto: ReadBookingDto) {
    return this.bookingService.getBookings(readBookingDto);
  }
}
