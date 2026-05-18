import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PreferenceCategory } from './preference-category.entity';

@Entity('attribute_mappings')
export class AttributeMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'preference_category_id' })
  preferenceCategoryId: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ name: 'profile_col', type: 'text', nullable: true })
  profileCol: string | null;

  @Column({ name: 'snapshot_col', type: 'text', nullable: true })
  snapshotCol: string | null;

  @ManyToOne(() => PreferenceCategory, (cat) => cat.attributes)
  @JoinColumn({ name: 'preference_category_id' })
  category: PreferenceCategory;
}
