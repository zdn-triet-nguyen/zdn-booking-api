import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { API_BEARER_AUTH } from 'src/constants/constants';
import { FieldService } from './../services/field.service';

import { CreateFieldDto } from '../dto/create-field.dto';
// import { FieldEntity } from '../entities/field.entity';
import { UpdateFieldDto } from '../dto/update-field.dto';
import { ReadFieldDto } from '../dto/read-field.dto';
import { BaseResponse } from 'src/common/response/base.response';

@ApiTags('field')
@Controller('field')
@ApiBearerAuth(API_BEARER_AUTH)
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Post()
  async create(@Body() createFieldDto: CreateFieldDto): Promise<BaseResponse> {
    const field: ReadFieldDto =
      await this.fieldService.createField(createFieldDto);
    return new BaseResponse(
      [field],
      'field_created',
      201,
      new Date().toString(),
    );
  }

  @Get(':sportFieldId')
  async findFieldsBySportField(
    @Param('sportFieldId') sportFieldId: string,
  ): Promise<BaseResponse> {
    const fields: ReadFieldDto[] =
      await this.fieldService.findFieldsBySportField(sportFieldId);
    return new BaseResponse(
      fields,
      'fields_retrieved',
      200,
      new Date().toString(),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFieldDto: UpdateFieldDto,
  ): Promise<BaseResponse> {
    const field: ReadFieldDto = await this.fieldService.updateField(
      id,
      updateFieldDto,
    );
    if (!field) {
      return new BaseResponse([], 'field_notFound', 404, new Date().toString());
    }
    return new BaseResponse(
      [field],
      'field_updated',
      200,
      new Date().toString(),
    );
  }

  // @Get()
  // async findAll() {
  //   return this.fieldService.findAll();
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   const field = await this.fieldService.findOne({ where: { id } }); // Corrected where clause
  //   return this.fieldService.mapper.map(field, Field, ReadFieldDto);
  // }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateFieldDto: UpdateFieldDto,
  // ) {
  //   return this.fieldService.update(id, updateFieldDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.fieldService.remove(id);
  }
}
