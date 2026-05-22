import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Stay } from '../stays/stay.entity';

@Entity('favorite_stays')
export class FavoriteStay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'stay_id' })
  stayId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Stay, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stay_id' })
  stay: Stay;
}
