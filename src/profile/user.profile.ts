/* istanbul ignore file */
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  // forMember,
  // ignore,
  // mapFrom,
  Mapper,
  // MappingProfile,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { ReadUserDTO } from 'src/user/dto/read-user-dto';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        User,
        ReadUserDTO,
        // forMember((dest) => dest.password, ignore()),
      );
    };
  }
}
