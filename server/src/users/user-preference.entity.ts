import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @OneToOne(() => User, (user) => user.preferences)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'res_oily', type: 'smallint' }) resOily: number;
  @Column({ name: 'res_clean', type: 'smallint' }) resClean: number;
  @Column({ name: 'res_stim', type: 'smallint' }) resStim: number;
  @Column({ name: 'res_spicy', type: 'smallint' }) resSpicy: number;
  @Column({ name: 'res_noise', type: 'smallint' }) resNoise: number;
  @Column({ name: 'res_interior', type: 'smallint' }) resInterior: number;
  @Column({ name: 'res_service', type: 'smallint' }) resService: number;

  @Column({ name: 'stay_view', type: 'smallint' }) stayView: number;
  @Column({ name: 'stay_interior', type: 'smallint' }) stayInterior: number;
  @Column({ name: 'stay_space', type: 'smallint' }) staySpace: number;
  @Column({ name: 'stay_noise', type: 'smallint' }) stayNoise: number;
  @Column({ name: 'stay_clean', type: 'smallint' }) stayClean: number;
  @Column({ name: 'stay_service', type: 'smallint' }) stayService: number;

  @Column({ name: 'act_culture', type: 'smallint' }) actCulture: number;
  @Column({ name: 'act_view', type: 'smallint' }) actView: number;
  @Column({ name: 'act_healing', type: 'smallint' }) actHealing: number;
  @Column({ name: 'act_active', type: 'smallint' }) actActive: number;
}
