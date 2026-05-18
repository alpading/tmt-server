import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MbtiEnum, HormoneEnum } from '../common/enums';

@Entity('activity_ratings')
export class ActivityRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'activity_id' })
  activityId: number;

  @Column({ name: 'overall_rating', type: 'decimal', precision: 2, scale: 1 })
  overallRating: number;

  @Column({ name: 'mbti_snap', type: 'enum', enum: MbtiEnum, enumName: 'mbti_enum' })
  mbtiSnap: MbtiEnum;

  @Column({ name: 'hormone_snap', type: 'enum', enum: HormoneEnum, enumName: 'hormone_enum' })
  hormoneSnap: HormoneEnum;

  @Column({ name: 'act_culture_snap', type: 'smallint' })
  actCultureSnap: number;

  @Column({ name: 'act_view_snap', type: 'smallint' })
  actViewSnap: number;

  @Column({ name: 'act_healing_snap', type: 'smallint' })
  actHealingSnap: number;

  @Column({ name: 'act_active_snap', type: 'smallint' })
  actActiveSnap: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
