import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PreferenceCategory } from './preference-category.entity';

@Entity('preferences')
export class Preference {
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

  @Column({ name: 'question_text', type: 'text', nullable: true })
  questionText: string | null;

  @Column({ name: 'option_high', length: 40, nullable: true })
  optionHigh: string | null;

  @Column({ name: 'option_mid', length: 40, nullable: true })
  optionMid: string | null;

  @Column({ name: 'option_low', length: 40, nullable: true })
  optionLow: string | null;

  @ManyToOne(() => PreferenceCategory, (cat) => cat.attributes)
  @JoinColumn({ name: 'preference_category_id' })
  category: PreferenceCategory;
}
