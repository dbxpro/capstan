import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class UserAuth {
  @PrimaryGeneratedColumn()
  public userAuthID: number | undefined;

  @Column('int', { nullable: false })
  public userID: number | undefined;

  @Column('varchar', { length: 255, unique: true, nullable: false })
  public userName: string | undefined;

  @Column('varchar', { length: 255, nullable: false })
  public password: string | undefined;
}
