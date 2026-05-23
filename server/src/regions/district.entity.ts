import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Province } from './province.entity';

@Entity('districts')
export class District {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'province_id' })
  provinceId: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @ManyToOne(() => Province, (p) => p.districts)
  @JoinColumn({ name: 'province_id' })
  province: Province;
}
