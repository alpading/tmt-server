import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('preference_questions')
export class PreferenceQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'section_title', length: 50 })
  sectionTitle: string;

  @Column({ name: 'section_order', type: 'smallint' })
  sectionOrder: number;

  @Column({ name: 'disp_order', type: 'smallint' })
  dispOrder: number;

  @Column({ name: 'question_text', type: 'text' })
  questionText: string;

  @Column({ name: 'pref_key', length: 30 })
  prefKey: string;

  @Column({ name: 'option_high', length: 40 })
  optionHigh: string;

  @Column({ name: 'option_mid', length: 40 })
  optionMid: string;

  @Column({ name: 'option_low', length: 40 })
  optionLow: string;
}
