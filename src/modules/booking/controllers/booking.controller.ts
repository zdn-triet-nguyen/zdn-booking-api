import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { API_BEARER_AUTH } from 'src/constants/constants';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateStatusBookingDto } from '../dto/update-status-booking.dto';

@Controller('booking')
@ApiBearerAuth(API_BEARER_AUTH)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return ' this.bookingService.create(createBookingDto);';
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return 'booking';
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return ' this.bookingService.update(id, updateBookingDto);';
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }

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
}

