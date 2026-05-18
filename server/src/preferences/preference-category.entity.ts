import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DomainEnum } from '../common/enums';
import { AttributeMapping } from './attribute-mapping.entity';

@Entity('preference_categories')
export class PreferenceCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  name: string | null;

  @Column({ name: 'target_rating', type: 'text' })
  targetRating: string;

  @Column({ type: 'enum', enum: DomainEnum, enumName: 'domain_enum' })
  domain: DomainEnum;

  @OneToMany(() => AttributeMapping, (attr) => attr.category)
  attributes: AttributeMapping[];
}
