import { IsOptional } from 'class-validator';
import { CreateSportFieldDto } from './create-sport-field.dto';
import { AutoMap } from '@automapper/classes';

export class UpdateSportFieldDto extends CreateSportFieldDto {
  @AutoMap()
  @IsOptional()
  updatedBy?: string;

  @IsOptional()
  removeImageIds?: string[];
}
