import { AutoMap } from '@automapper/classes';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt: Date;

  @AutoMap()
  @ManyToOne(() => User, (user) => user.createdEntities)
  @JoinColumn({
    name: 'created_by',
  })
  createdBy: User;

  @AutoMap()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @AutoMap()
  @ManyToOne(() => User, (user) => user.updatedEntities)
  @JoinColumn({
    name: 'updated_by',
    nullable: true,
  })
  updatedBy: User;

  @AutoMap()
  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @AutoMap()
  @ManyToOne(() => User, (user) => user.deletedEntities)
  @JoinColumn({
    name: 'deleted_by',
  })
  deletedBy: User;
}
