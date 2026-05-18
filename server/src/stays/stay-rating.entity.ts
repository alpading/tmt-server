import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MbtiEnum, HormoneEnum } from '../common/enums';

@Entity('stay_ratings')
export class StayRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'stay_id' })
  stayId: number;

  @Column({ name: 'overall_rating', type: 'decimal', precision: 2, scale: 1 })
  overallRating: number;

  @Column({ name: 'interior_rating', type: 'decimal', precision: 2, scale: 1 })
  interiorRating: number;

  @Column({ name: 'clean_rating', type: 'decimal', precision: 2, scale: 1 })
  cleanRating: number;

  @Column({ name: 'visit_party_size' })
  visitPartySize: number;

  @Column({ name: 'total_spent_amount' })
  totalSpentAmount: number;

  @Column({ name: 'stay_view_snap', type: 'smallint' })
  stayViewSnap: number;

  @Column({ name: 'stay_interior_snap', type: 'smallint' })
  stayInteriorSnap: number;

  @Column({ name: 'stay_space_snap', type: 'smallint' })
  staySpaceSnap: number;

  @Column({ name: 'stay_noise_snap', type: 'smallint' })
  stayNoiseSnap: number;

  @Column({ name: 'stay_clean_snap', type: 'smallint' })
  stayCleanSnap: number;

  @Column({ name: 'stay_service_snap', type: 'smallint' })
  stayServiceSnap: number;

  @Column({ name: 'mbti_snap', type: 'enum', enum: MbtiEnum, enumName: 'mbti_enum' })
  mbtiSnap: MbtiEnum;

  @Column({ name: 'hormone_snap', type: 'enum', enum: HormoneEnum, enumName: 'hormone_enum', nullable: true })
  hormoneSnap: HormoneEnum | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
