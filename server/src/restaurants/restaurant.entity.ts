import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'district_id' })
  districtId: number;

  @Column({ name: 'restaurant_category_id' })
  restaurantCategoryId: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'has_parking', default: false })
  hasParking: boolean;

  @Column({ name: 'allows_pets', default: false })
  allowsPets: boolean;

  @Column({ name: 'has_spicy_food', default: false })
  hasSpicyFood: boolean;

  @Column({ name: 'has_single_seating', default: false })
  hasSingleSeating: boolean;

  @Column({ name: 'has_table_seating', default: false })
  hasTableSeating: boolean;

  @Column({ name: 'has_floor_seating', default: false })
  hasFloorSeating: boolean;

  @Column({ name: 'has_group_seating', default: false })
  hasGroupSeating: boolean;

  @Column({ name: 'has_private_room', default: false })
  hasPrivateRoom: boolean;

  @Column({ name: 'has_bar_table', default: false })
  hasBarTable: boolean;

  @Column({ name: 'has_baby_chair', default: false })
  hasBabyChair: boolean;

  @Column({ name: 'image_url', type: 'text' })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
