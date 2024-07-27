import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export type TENANT_STATUS = 'ACTIVE' | 'INACTIVE' | 'PENDING';

@Entity()
export default class Tenant {
  @PrimaryGeneratedColumn()
  public tenantID: number | undefined;

  @Column('varchar', { length: 255 })
  public name: string | undefined;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public companyType: string | undefined;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  public companyRepresentative: string | undefined;

  @Column('varchar', { length: 50, nullable: false })
  public primaryPhoneNumber: number | undefined;

  @Column('varchar', { length: 50, nullable: true })
  public secondaryPhoneNumber: number | undefined;

  @Column('varchar', { length: 50, nullable: true })
  public tertiaryPhoneNumber: number | undefined;

  @Column('varchar', { length: 255, nullable: true })
  public email: string | undefined;

  @Column('varchar', { length: 255, nullable: true })
  public accountManager: string | undefined;

  @Column({
    type: 'date',
    nullable: true,
  })
  public createdDate: Date | undefined;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE', 'PENDING'],
    default: ['ACTIVE'],
  })
  public status: TENANT_STATUS = 'ACTIVE';

  @Column('text', { nullable: true })
  public note: string | undefined;
}
