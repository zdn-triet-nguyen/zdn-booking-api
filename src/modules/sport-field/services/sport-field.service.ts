import { FieldService } from './../../field/services/field.service';
import { LocationService } from './../../location/location.service';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

import { BaseService } from 'src/common/service/base.service';
import { CreateSportFieldDto } from '../dto/create-sport-field.dto';
import { UpdateSportFieldDto } from '../dto/update-sport-field.dto';
import { SportFieldEntity } from '../entities/sport-field.entity';
import { ReadSportFieldDto } from '../dto/read-sport-field.dto';
import { SportFieldImageService } from './sport-field-image/sport-field-image.service';
import { CreateLocationDto } from 'src/modules/location/dto/create-location.dto';
import { CreateSportFieldImageDto } from '../dto/sport-field-image/create-sport-field-image.dto';
import { UploadImageDto } from 'src/common/dto/upload-image.dto';
import { CreateFieldDto } from 'src/modules/field/dto/create-field.dto';
import { Pagination } from 'src/decorators/pagination.decorator';
import { getWhere } from 'src/helpers/typeorm.helper';
import { Filtering } from 'src/decorators/filter.decorator';

@Injectable()
export class SportFieldService extends BaseService<SportFieldEntity> {
  constructor(
    @InjectRepository(SportFieldEntity)
    private readonly sportFieldRepository: Repository<SportFieldEntity>,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly fieldService: FieldService,
    private readonly sportFieldImageService: SportFieldImageService,
    private readonly locationService: LocationService,
  ) {
    super(sportFieldRepository);
  }

  getSportFieldQuery(sportFieldId: string) {
    return sportFieldId ? { id: sportFieldId } : {};
  }

  async getUserSportFields(
    userId: string,
    { limit, offset }: Pagination,
    sportFieldTypeId?: string,
  ): Promise<ReadSportFieldDto[]> {
    const sportFieldType = this.getSportFieldQuery(sportFieldTypeId);
    const sportFields: SportFieldEntity[] =
      await this.sportFieldRepository.find({
        where: { ownerId: userId, sportFieldType },
        take: limit,
        skip: offset,
      });

    return this.mapper.mapArray(
      sportFields,
      SportFieldEntity,
      ReadSportFieldDto,
    );
  }

  async getSportFields(
    { limit, offset }: Pagination,
    filter?: Filtering,
    sportFieldTypeId?: string,
  ): Promise<ReadSportFieldDto[]> {
    const where = getWhere(filter);
    const sportFieldType = this.getSportFieldQuery(sportFieldTypeId);

    const sportFields: SportFieldEntity[] =
      await this.sportFieldRepository.find({
        where: {
          ...where,
          sportFieldType,
        },
        take: limit,
        skip: offset,
      });

    return this.mapper.mapArray(
      sportFields,
      SportFieldEntity,
      ReadSportFieldDto,
    );
  }

  async createSportField(
    createSportFieldDto: CreateSportFieldDto,
  ): Promise<ReadSportFieldDto> {
    const sportField: SportFieldEntity = this.mapper.map(
      createSportFieldDto,
      CreateSportFieldDto,
      SportFieldEntity,
    );
    const createdSportField: SportFieldEntity = await this.create(sportField);

    return this.mapper.map(
      createdSportField,
      SportFieldEntity,
      ReadSportFieldDto,
    );
  }

  async findSportFieldById(id: string): Promise<ReadSportFieldDto> {
    const sportField: SportFieldEntity = await this.findOne({ where: { id } });
    return this.mapper.map(sportField, SportFieldEntity, ReadSportFieldDto);
  }

  async updateSportField(
    id: string,
    updateSportFieldDto: Partial<UpdateSportFieldDto>,
  ): Promise<ReadSportFieldDto> {
    const sportField: SportFieldEntity = this.mapper.map(
      updateSportFieldDto,
      UpdateSportFieldDto,
      SportFieldEntity,
    );
    const updatedSportField: SportFieldEntity = await this.update(
      id,
      { where: { id } },
      sportField,
    );
    return this.mapper.map(
      updatedSportField,
      SportFieldEntity,
      ReadSportFieldDto,
    );
  }

  async deleteSportField(id: string): Promise<ReadSportFieldDto> {
    const sportField: SportFieldEntity = await this.delete(id, {
      where: { id },
    });

    return this.mapper.map(sportField, SportFieldEntity, ReadSportFieldDto);
  }
}
