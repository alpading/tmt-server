import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DomainEnum } from '../common/enums';

@Entity('wish_list')
export class WishList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'enum', enum: DomainEnum, enumName: 'domain_enum' })
  domain: DomainEnum;

  @Column({ name: 'item_id' })
  itemId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
