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
  @Column({
    name: 'updated_by',
  })
  updatedBy: User;

  @AutoMap()
  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @AutoMap()
  @Column({ name: 'deleted_by', type: 'timestamp', nullable: true })
  deletedBy: User;
}
