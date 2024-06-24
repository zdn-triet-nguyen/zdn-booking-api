import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateSportFieldDto } from '../dto/create-sport-field.dto';
import { ReadSportFieldDto } from '../dto/read-sport-field.dto';
import { UpdateSportFieldDto } from '../dto/update-sport-field.dto';
import { SportFieldEntity } from '../entities/sport-field.entity';
import { GetSportFieldDto } from '../dto/get-sport-field.dto';

@Injectable()
export class SportFieldProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, SportFieldEntity, ReadSportFieldDto);
      createMap(
        mapper,
        SportFieldEntity,
        GetSportFieldDto,
        forMember(
          (des) => des.sportFieldImages,
          mapFrom((src) => src.sportFieldImages),
        ),
        forMember(
          (des) => des.location,
          mapFrom((src) => src.location),
        ),
        forMember(
          (des) => des.sportFieldType,
          mapFrom((src) => src.sportFieldType),
        ),
      );
      createMap(mapper, CreateSportFieldDto, SportFieldEntity);
      createMap(mapper, UpdateSportFieldDto, SportFieldEntity);
    };
  }
}
