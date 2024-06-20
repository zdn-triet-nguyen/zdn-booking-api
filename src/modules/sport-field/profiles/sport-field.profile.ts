import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, createMap } from '@automapper/core';
import { SportFieldEntity } from '../entities/sport-field.entity';
import { ReadSportFieldDto } from '../dto/read-sport-field.dto';
import { CreateSportFieldDto } from '../dto/create-sport-field.dto';
import { UpdateSportFieldDto } from '../dto/update-sport-field.dto';

@Injectable()
export class SportFieldProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, SportFieldEntity, ReadSportFieldDto);
      createMap(mapper, CreateSportFieldDto, SportFieldEntity);
      createMap(mapper, UpdateSportFieldDto, SportFieldEntity);
    };
  }
}
