import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CourseItem } from './course-item.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'theme_id' })
  themeId: number;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'smallint' })
  duration: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => CourseItem, (item) => item.course)
  items: CourseItem[];
}
