import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseResponse } from '../../../../common/response/base.response';
import { API_BEARER_AUTH } from '../../../../constants/constants';
import { ReadSportFieldDto } from '../../dto/read-sport-field.dto';
import { CreateSportFieldTypeDto } from '../../dto/sport-field-type/create-sport-field-type.dto';
import { SportFieldTypeService } from '../../services/sport-field-type/sport-field-type.service';

@ApiTags('sport-field-type')
@ApiBearerAuth(API_BEARER_AUTH)
// @Public()
@Controller('sport-field-type')
export class SportFieldTypeController {
  constructor(private readonly sportFieldTypeSerive: SportFieldTypeService) {}

  @Post()
  async createSportFieldType(
    @Body() createSportFieldTypeDto: CreateSportFieldTypeDto,
  ): Promise<BaseResponse<ReadSportFieldDto>> {
    const res = await this.sportFieldTypeSerive.createSportFieldType(
      createSportFieldTypeDto,
    );
    if (!res) {
      throw new BadRequestException('sport_field_type_not_created');
    }
    return new BaseResponse(
      [res],
      'sport_field_type_created',
      201,
      new Date().toString(),
    );
  }

  @Get()
  async getAllSportFieldType(): Promise<BaseResponse<ReadSportFieldDto>> {
    const res = await this.sportFieldTypeSerive.findAllSportFieldType();
    if (!res) {
      throw new NotFoundException('sport_field_type_not_found');
    }
    return new BaseResponse(
      res,
      'sport_field_type_found',
      200,
      new Date().toString(),
    );
  }
}
