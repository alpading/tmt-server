import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('stays')
export class Stay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'district_id' })
  districtId: number;

  @Column({ name: 'stay_category_id' })
  stayCategoryId: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'has_parking', default: false })
  hasParking: boolean;

  @Column({ name: 'has_bathtub', default: false })
  hasBathtub: boolean;

  @Column({ name: 'has_breakfast', default: false })
  hasBreakfast: boolean;

  @Column({ name: 'has_tv', default: false })
  hasTv: boolean;

  @Column({ name: 'has_bbq', default: false })
  hasBbq: boolean;

  @Column({ name: 'allows_cooking', default: false })
  allowsCooking: boolean;

  @Column({ name: 'allows_pets', default: false })
  allowsPets: boolean;

  @Column({ name: 'is_wheelchair_accessible', default: false })
  isWheelchairAccessible: boolean;

  @Column({ name: 'image_url', type: 'text' })
  imageUrl: string;

  @Column({ length: 200 })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ name: 'naver_place_id', length: 30, nullable: true })
  naverPlaceId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
