/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { API_BEARER_AUTH } from 'src/constants/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { SportFieldService } from '../services/sport-field.service';

import { CreateSportFieldDto } from '../dto/create-sport-field.dto';
import { UpdateSportFieldDto } from '../dto/update-sport-field.dto';
import { BaseResponse } from 'src/common/response/base.response';
import { Public } from 'nest-keycloak-connect';
import { FieldService } from 'src/modules/field/services/field.service';
import { SportFieldImageService } from '../services/sport-field-image/sport-field-image.service';
import { LocationService } from 'src/modules/location/location.service';
import { CreateFieldDto } from 'src/modules/field/dto/create-field.dto';
import { UploadImageDto } from 'src/common/dto/upload-image.dto';
import { CreateSportFieldImageDto } from '../dto/sport-field-image/create-sport-field-image.dto';
import { CreateLocationDto } from 'src/modules/location/dto/create-location.dto';
import {
  CreateFieldEvent,
  CreateLocationEvent,
  CreateSportFieldImageEvent,
  RemoveSportFieldImageEvent,
  UpdateLocationEvent,
} from '../events/sport-field-events.event';

@ApiTags('sport-field')
@Controller('sport-field')
@ApiBearerAuth(API_BEARER_AUTH)
@Public()
export class SportFieldController {
  constructor(
    private readonly sportFieldService: SportFieldService,
    private readonly fieldService: FieldService,
    private readonly sportFieldImageService: SportFieldImageService,
    private readonly locationService: LocationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createSportField(
    @Body() createSportFieldDto: CreateSportFieldDto,
  ): Promise<BaseResponse> {
    try {
      const res =
        await this.sportFieldService.createSportField(createSportFieldDto);
      if (!res) {
        throw new BadRequestException('sport_field_not_created');
      }

      // Emit event for location creation if locationObj is provided
      if (createSportFieldDto.locationObj) {
        this.eventEmitter.emit(
          'create.location',
          new CreateLocationEvent(res.id, createSportFieldDto.locationObj),
        );
      }

      // Emit events for field creation
      for (let i = 0; i < createSportFieldDto.quantity; i++) {
        this.eventEmitter.emit(
          'create.field',
          new CreateFieldEvent(`${res.name} - ${i + 1}`, res.id, res.createdBy),
        );
      }

      // Emit events for image creation
      for (const image of createSportFieldDto.sportFieldImages) {
        this.eventEmitter.emit(
          'create.sportFieldImage',
          new CreateSportFieldImageEvent(res.id, image, res.createdBy),
        );
      }

      // for (let i = 0; i < createSportFieldDto.quantity; i++) {
      //   const field: CreateFieldDto = {
      //     name: `${res.name} - ${i + 1}`,
      //     sportFieldId: res.id,
      //     createdBy: res.createdBy,
      //   };
      //   const fieldCreated = await this.fieldService.createField(field);
      //   if (!fieldCreated) {
      //     throw new BadRequestException('field_not_created');
      //   }
      // }

      // for (const image of createSportFieldDto.sportFieldImages) {
      //   const sportFieldImage: CreateSportFieldImageDto = {
      //     sportField: res.id,
      //     ...image,
      //     createdBy: res.createdBy,
      //   };
      //   const imageCreated =
      //     await this.sportFieldImageService.createSportFieldImage(
      //       sportFieldImage,
      //     );
      //   if (!imageCreated) {
      //     throw new BadRequestException('image_not_created');
      //   }
      // }

      // if (createSportFieldDto.locationObj) {
      //   const location = await this.locationService.create({
      //     sportFieldId: res.id,
      //     ...(createSportFieldDto.locationObj as CreateLocationDto),
      //   });
      //   if (!location) {
      //     throw new BadRequestException('location_not_created');
      //   }
      // }

      return new BaseResponse(
        [res],
        'sport_field_created',
        201,
        new Date().toString(),
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BaseResponse> {
    const sportField = await this.sportFieldService.findSportFieldById(id);
    if (!sportField) {
      throw new BadRequestException('sport_field_not_found');
    }
    return new BaseResponse(
      [sportField],
      'sport_field_found',
      200,
      new Date().toString(),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSportFieldDto: Partial<UpdateSportFieldDto>,
  ) {
    if (updateSportFieldDto.locationObj) {
      this.eventEmitter.emit(
        'create.location',
        new UpdateLocationEvent(
          updateSportFieldDto.locationObj.id,
          updateSportFieldDto.locationObj,
        ),
      );
    }

    if (updateSportFieldDto.sportFieldImages) {
      updateSportFieldDto.sportFieldImages.forEach((image) => {
        this.eventEmitter.emit(
          'create.sportFieldImage',
          new CreateSportFieldImageEvent(id, image, 'system'),
        );
      });
    }

    if (updateSportFieldDto.removeImageIds) {
      updateSportFieldDto.removeImageIds.forEach((imageId) => {
        this.eventEmitter.emit(
          'remove.sportFieldImage',
          new RemoveSportFieldImageEvent(imageId),
        );
      });
    }

    const res = await this.sportFieldService.updateSportField(
      id,
      updateSportFieldDto,
    );
    if (!res) {
      throw new BadRequestException('sport_field_not_updated');
    }
    return new BaseResponse(
      [res],
      'sport_field_updated',
      200,
      new Date().toString(),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const res = await this.sportFieldService.deleteSportField(id);
    if (!res) {
      throw new BadRequestException('sport_field_not_deleted');
    }
    return new BaseResponse(
      [],
      'sport_field_deleted',
      200,
      new Date().toString(),
    );
  }
}
