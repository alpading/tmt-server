import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GenderEnum, HormoneEnum, MbtiEnum, RoleEnum } from '../common/enums';
import { UserPreference } from './user-preference.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'login_id', type: 'varchar', length: 30, unique: true, nullable: true })
  loginId: string;

  @Column({ name: 'hashed_pw', type: 'text', nullable: true })
  hashedPw: string;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ type: 'enum', enum: GenderEnum, enumName: 'gender_enum' })
  gender: GenderEnum;

  @Column({ type: 'enum', enum: MbtiEnum, enumName: 'mbti_enum' })
  mbti: MbtiEnum;

  @Column({ type: 'enum', enum: HormoneEnum, enumName: 'hormone_enum' })
  hormone: HormoneEnum;

  @Column({ type: 'enum', enum: RoleEnum, enumName: 'role_enum', default: RoleEnum.USER })
  role: RoleEnum;

  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refreshToken: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @OneToOne(() => UserPreference, (pref) => pref.user)
  preferences: UserPreference;
}
