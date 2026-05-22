import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Theme } from './theme.entity';

@Entity('theme_mappings')
export class ThemeMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'theme_id' })
  themeId: number;

  @Column({ name: 'preference_id' })
  preferenceId: number;

  @Column({ name: 'target_val', type: 'smallint' })
  targetVal: number;

  @ManyToOne(() => Theme, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'theme_id' })
  theme: Theme;
}
