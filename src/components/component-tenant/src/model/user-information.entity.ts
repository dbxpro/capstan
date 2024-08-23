import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import User from './user.entity';

@Entity()
export default class UserInformation {
  @PrimaryGeneratedColumn()
  public userInfoID: number | undefined;

  @Column('varchar', { length: 50 })
  public secondaryPhoneNumber: number | undefined;

  @Column('varchar', { length: 50 })
  public tertiaryPhoneNumber: number | undefined;

  @Column('varchar', { length: 50 })
  public email: string | undefined;

  @Column('text', { nullable: true })
  public note: string | undefined;

  @Column('datetime', { default: null })
  public onBoardDate: Date | undefined;

  @Column('datetime', { default: null })
  public departedDate: Date | undefined;

  @OneToOne(() => User)
  @JoinColumn()
  public user: User | undefined;
}
