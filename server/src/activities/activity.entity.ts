import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'destination_id' })
  destinationId: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'available_parking', default: false })
  availableParking: boolean;

  @Column({ name: 'is_wheelchair_accessible', default: false })
  isWheelchairAccessible: boolean;

  @Column({ name: 'allows_pets', default: false })
  allowsPets: boolean;

  @Column({ name: 'is_kid_friendly', default: false })
  isKidFriendly: boolean;

  @Column({ name: 'is_free', default: false })
  isFree: boolean;

  @Column({ name: 'is_cafe', default: false })
  isCafe: boolean;

  @Column({ name: 'is_shopping', default: false })
  isShopping: boolean;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @Column({ name: 'is_exhibition', default: false })
  isExhibition: boolean;

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
