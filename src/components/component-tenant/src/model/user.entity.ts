import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Tenant from './tenant.entity';

export type USER_STATUS = 'ACTIVE' | 'LEAVE' | 'SUSPENDED' | 'INACTIVE';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  public userID: number | undefined;

  @Column('varchar', { length: 255 })
  public firstName: string | undefined;

  @Column('varchar', { length: 255 })
  public lastName: string | undefined;

  @Column('varchar', { length: 255 })
  public fullName: string | undefined;

  @Column('varchar', { length: 255 })
  public nationalID: string | undefined;

  @Column('varchar', { length: 255 })
  public title: string | undefined;

  @Column('int', { nullable: true })
  public managerID: number | undefined;

  @Column('varchar', { length: 50 })
  public primaryPhoneNumber: number | undefined;

  @Column('text', { nullable: true })
  public note: string | undefined;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'LEAVE', 'SUSPENDED', 'INACTIVE'],
    default: 'ACTIVE',
  })
  public status: USER_STATUS = 'ACTIVE';

  @Column('datetime', { default: null })
  public createUTCDate: Date | undefined;

  @Column('integer', { nullable: false })
  public createdBy: number | undefined;

  @Column('datetime', { default: null })
  public modifyUTCDate: Date | undefined;

  @Column('integer', { default: null })
  public modifyBy: number | undefined;

  @ManyToOne(() => Tenant, (tenant) => tenant.user, { cascade: true })
  @JoinColumn()
  public tenant: Tenant | undefined;
}
