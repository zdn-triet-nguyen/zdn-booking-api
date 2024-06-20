/* eslint-disable @typescript-eslint/no-unused-vars */
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { FieldEntity } from 'src/modules/field/entities/field.entity';
import { SportFieldEntity } from 'src/modules/sport-field/entities/sport-field.entity';
import { UpdateStatusBookingDto } from '../dto/update-status-booking.dto';
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
    @InjectRepository(SportFieldEntity)
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
  async removeBookingOfSportField(id: string) {
    const sportField = await this.sportFieldRepository.find({
      where: { id: id },
    });
    console.log('123zczx', sportField);
    if (sportField.length === 0) {
      return {
        statusCode: 404,
        status: 'Error',
        message: 'Sport field not exists',
      };
    }
    // const a = await this.bookingRepository
    //   .createQueryBuilder('booking')
    //   .innerJoinAndSelect('booking.field', 'field')
    //   .innerJoinAndSelect('field.sportField', 'sportField')
    //   .delete()
    //   .from(BookingEntity)
    //   .where('sportField.id = :sportFieldId', { sportFieldId: id })
    //   .execute();
    const fields = await this.fieldRepository.find({
      where: { sportField: { id: id } },
    });
    const fieldIds = fields.map((field) => field.id);
    await this.bookingRepository
      .createQueryBuilder()
      .delete()
      .where('field_id IN (:...fieldIds)', { fieldIds })
      .execute();

    return {
      statusCode: 200,
      status: 'Success',
      message: 'Deleted successfully',
    };
  }
  async updateStatusBooking(id: string, data: UpdateStatusBookingDto) {
    const booking = await this.bookingRepository.findOne({
      where: { id: id },
    });
    if (!booking) {
      return {
        statusCode: 404,
        status: 'Error',
        message: 'Booking not exists',
      };
    }
    await this.bookingRepository.update(id, data);
    return {
      statusCode: 200,
      status: 'Success',
      message: 'Updated successfully',
    };
  }
}
