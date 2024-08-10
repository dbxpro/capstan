import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import User from './user.entity';

@Entity()
export default class UserPermission {
  @PrimaryGeneratedColumn()
  public userPermissionID: number | undefined;

  @Column('varchar', { length: 255 })
  public name: string | undefined;

  @Column('varchar', { nullable: true })
  public type: string | undefined;

  @Column('varchar', { nullable: true })
  public value: string | undefined;

  @Column('tinyint', { width: 1, nullable: true })
  public isActive: boolean | undefined;

  @ManyToOne(() => User, (user) => user.permissions, { cascade: true })
  public user: User | undefined;
}
