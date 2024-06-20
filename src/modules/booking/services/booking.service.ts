/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../entities/booking.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service/base.service';
import { SportFieldEntity } from 'src/modules/sport-field/entities/sport-field.entity';
import { UpdateStatusBookingDto } from '../dto/update-status-booking.dto';
import { FieldEntity } from 'src/modules/field/entities/field.entity';

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
