import { BaseEntity } from 'src/common/entity/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { FieldEntity } from '../../field/entities/field.entity';
import { Location } from '../../location/entities/location.entity';
import { SportFieldImage } from './sport-field-image.entity';
import { SportFieldType } from './sport-field-type.entity';

@Entity({ synchronize: true })
export class SportField extends BaseEntity {
  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ type: 'integer', nullable: false })
  quantity: number;

  @Column({ length: 10, nullable: false })
  phone: string;

  @Column({ nullable: false })
  startTime: string;

  @Column({ nullable: false })
  endTime: string;

  @Column({ type: 'float', nullable: false })
  price: number;

  @Column({ length: 65535 })
  rule: string;

  @ManyToOne(
    () => SportFieldType,
    (sportFieldType) => sportFieldType.sportFields,
  )
  @JoinColumn({ name: 'sport_field_type_id' })
  sportFieldType: SportFieldType;

  @OneToMany(
    () => SportFieldImage,
    (sportFieldImage) => sportFieldImage.sportField,
  )
  sportFieldImages: SportFieldImage[];

  @OneToOne(() => Location, (location) => location.sportField)
  location: Location;

  @OneToMany(() => FieldEntity, (field) => field.sportFieldId)
  fields: FieldEntity[];
}
