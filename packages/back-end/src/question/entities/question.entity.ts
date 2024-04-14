import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '新问卷' })
  title: string;

  @Column({ default: '' })
  desc: string;

  @Column({ default: '' })
  js: string;

  @Column({ default: '' })
  css: string;

  @Column({ type: 'boolean', default: false })
  isStar: boolean;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column('json', { nullable: true })
  componentList: Array<Component>;

  @ManyToOne(() => User, user => user.question)
  user: User
}

interface Component {
  com_id: string;
  type: string;
  title: string;
  isHidden?: boolean;
  isLocked?: boolean;
  props: {
    [key: string]: any;
  };
}
