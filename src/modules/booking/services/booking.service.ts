/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../entities/booking.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service/base.service';
import { SportFieldEntity } from 'src/modules/sport-field/entities/sport-field.entity';
import { ReadUserDTO } from 'src/modules/user/dto/read-user-dto';
import { FieldEntity } from 'src/modules/field/entities/field.entity';

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
