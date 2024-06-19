import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { API_BEARER_AUTH } from 'src/constants/constants';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ReadUserDTO } from 'src/modules/user/dto/read-user-dto';
import { User } from 'src/decorators/user.decorator';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';

@Controller('booking')
@ApiBearerAuth(API_BEARER_AUTH)
@UseInterceptors(TransformInterceptor)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(
    @User() user: ReadUserDTO,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingService.createBooking(user, createBookingDto);
  }
}
