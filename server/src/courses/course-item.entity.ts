import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DomainEnum } from '../common/enums';
import { Course } from './course.entity';

@Entity('course_items')
export class CourseItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column({ type: 'enum', enum: DomainEnum, enumName: 'domain_enum' })
  domain: DomainEnum;

  @Column({ name: 'item_id' })
  itemId: number;

  @Column({ name: 'item_order', type: 'smallint', default: 0 })
  itemOrder: number;

  @Column({ name: 'day', type: 'smallint', default: 0 })
  day: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Course, (course) => course.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
