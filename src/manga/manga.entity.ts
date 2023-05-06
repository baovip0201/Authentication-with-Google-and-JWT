import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mn')
export class MangaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameManga: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}
