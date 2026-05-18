import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MbtiEnum, HormoneEnum } from '../common/enums';

@Entity('restaurant_ratings')
export class RestaurantRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'restaurant_id' })
  restaurantId: number;

  @Column({ name: 'overall_rating', type: 'decimal', precision: 2, scale: 1 })
  overallRating: number;

  @Column({ name: 'space_rating', type: 'decimal', precision: 2, scale: 1 })
  spaceRating: number;

  @Column({ name: 'taste_rating', type: 'decimal', precision: 2, scale: 1 })
  tasteRating: number;

  @Column({ name: 'visit_party_size' })
  visitPartySize: number;

  @Column({ name: 'total_spent_amount' })
  totalSpentAmount: number;

  @Column({ name: 'res_oily_snap', type: 'smallint' })
  resOilySnap: number;

  @Column({ name: 'res_mild_snap', type: 'smallint' })
  resMildSnap: number;

  @Column({ name: 'res_clean_snap', type: 'smallint' })
  resCleanSnap: number;

  @Column({ name: 'res_stim_snap', type: 'smallint' })
  resStimSnap: number;

  @Column({ name: 'res_spicy_snap', type: 'smallint' })
  resSpicySnap: number;

  @Column({ name: 'res_noise_snap', type: 'smallint' })
  resNoiseSnap: number;

  @Column({ name: 'res_interior_snap', type: 'smallint' })
  resInteriorSnap: number;

  @Column({ name: 'res_service_snap', type: 'smallint' })
  resServiceSnap: number;

  @Column({ name: 'mbti_snap', type: 'enum', enum: MbtiEnum, enumName: 'mbti_enum' })
  mbtiSnap: MbtiEnum;

  @Column({ name: 'hormone_snap', type: 'enum', enum: HormoneEnum, enumName: 'hormone_enum' })
  hormoneSnap: HormoneEnum;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
