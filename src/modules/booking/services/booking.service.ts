/* eslint-disable @typescript-eslint/no-unused-vars */
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { FieldEntity } from 'src/modules/field/entities/field.entity';
import { SportFieldEntity } from 'src/modules/sport-field/entities/sport-field.entity';
import { UpdateStatusBookingDto } from '../dto/update-status-booking.dto';
import { ReadUserDTO } from 'src/modules/user/dto/read-user-dto';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { ReadBookingDto } from '../dto/read-booking.dto';
import { BookingEntity, BookingStatus } from '../entities/booking.entity';

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
      ...userInfo,
      ...createBookingDto,
      status: BookingStatus.BOOKING,
      field,
      fullName: user.name,
      createdBy: user.id,
      updatedBy: user.id,
    });

    return newBooking;
  }

  getBookings(readBookingDto: ReadBookingDto) {
    return this.bookingRepository.find({
      // where: {
      //   field: { id: readBookingDto.fieldId },
      //   startTime: MoreThanOrEqual(readBookingDto.startTime),
      // },
    });
  }

  async remove(id: string, user: ReadUserDTO) {
    const booking = await this.bookingRepository.findOne({
      where: {
        id,
      },
      relations: {
        field: true,
      },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.field.createdBy !== user.id) {
      throw new UnauthorizedException(
        'You do not have permission to delete this booking',
      );
    }
    booking.deletedBy = user.id;
    await this.bookingRepository.save(booking);
    await this.bookingRepository.softDelete(id);

    return {
      statusCode: 200,
      status: 'Success',
      message: 'Deleted successfully',
    };
  }
  async removeBookingOfSportField(id: string, user: ReadUserDTO) {
    const sportField = await this.sportFieldRepository.find({
      where: { id: id },
    });

    if (sportField.length === 0) {
      return {
        statusCode: 404,
        status: 'Error',
        message: 'Sport field not exists',
      };
    }
    if (sportField[0].createdBy !== user.id) {
      return {
        statusCode: 403,
        status: 'Error',
        message:
          'You do not have permission to delete  bookings of this  sport field',
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
    console.log(fieldIds);
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

  async getBookingsBySportFieldId(id: string) {
    const sportField = await this.sportFieldRepository.findOne({
      where: { id: id },
    });
    if (!sportField) {
      return {
        statusCode: 404,
        status: 'Error',
        message: 'Sport field not exists',
      };
    }
    const fields = await this.fieldRepository.find({
      where: { sportField: { id: id } },
    });
    const fieldIds = fields.map((field) => field.id);
    const bookings = await this.bookingRepository.find({
      where: { field: { id: In(fieldIds) } },
    });

    return bookings;
  }
  async updateStatusBooking(
    id: string,
    data: UpdateStatusBookingDto,
    user: ReadUserDTO,
  ) {
    const booking = await this.bookingRepository.findOne({
      where: {
        id,
      },
      relations: {
        field: true,
      },
    });
    if (!booking) {
      return {
        statusCode: 404,
        status: 'Error',
        message: 'Booking not exists',
      };
    }
    if (booking.field.createdBy !== user.id) {
      return {
        statusCode: 403,
        status: 'Error',
        message: 'You do not have permission to update this booking',
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
