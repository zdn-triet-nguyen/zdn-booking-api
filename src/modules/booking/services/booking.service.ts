/* eslint-disable @typescript-eslint/no-unused-vars */
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { FieldEntity } from 'src/modules/field/entities/field.entity';
import { SportFieldEntity } from 'src/modules/sport-field/entities/sport-field.entity';
import { ReadUserDTO } from 'src/modules/user/dto/read-user-dto';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { ReadBookingDto } from '../dto/read-booking.dto';
import { BookingEntity } from '../entities/booking.entity';

@Injectable()
export class BookingService extends BaseService<BookingEntity> {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(BookingEntity)
    private readonly sportFieldRepository: Repository<SportFieldEntity>,
    @InjectRepository(FieldEntity)
    private readonly fieldRepository: Repository<FieldEntity>,
    @InjectMapper()
    public readonly mapper: Mapper,
  ) {
    super(bookingRepository);
  }

  async createBooking(user: ReadUserDTO, createBookingDto: CreateBookingDto) {
    const field = await this.fieldRepository.findOne({
      where: { id: createBookingDto.fieldId },
    });

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    const { id, ...userInfo } = user;

    const newBooking = await this.bookingRepository.save({
      ...createBookingDto,
      ...userInfo,
      field,
      fullName: user.name,
      createdBy: user.id,
      updatedBy: user.id,
    });

    return newBooking;
  }

  getBookings(readBookingDto: ReadBookingDto) {
    return this.bookingRepository.find({
      where: {
        field: { id: readBookingDto.fieldId },
        startTime:
          MoreThanOrEqual(readBookingDto.startTime) &&
          LessThanOrEqual(readBookingDto.endTime),
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
  removeBookingOfSportField(id: string) {
    const sportField = this.sportFieldRepository.find({
      where: { id: id },
    });

    return 'This action removes all bookings of a field';
  }
}
