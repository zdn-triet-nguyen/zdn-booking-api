import { AutoMap } from '@automapper/classes';
import { CreateSportFieldDto } from './create-sport-field.dto';
import { ReadSportFieldImageDto } from './sport-field-image/read-sport-field-image.dto';
import { Field } from 'multer';
import { FieldEntity } from 'src/modules/field/entities/field.entity';

export class ReadSportFieldDto extends CreateSportFieldDto {
  @AutoMap()
  id: string;

  @AutoMap()
  fields: FieldEntity[];

  @AutoMap()
  fieldIds: string[];

  // @AutoMap()
  // location: LocationEntity;

  @AutoMap()
  sportFieldImages: ReadSportFieldImageDto[];
}
