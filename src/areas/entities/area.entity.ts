import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Programa } from '../../programas/entities/programa.entity';

@Entity('areas')
export class Area {
  @PrimaryGeneratedColumn()
  id_area: number;

  @Column({ length: 100, unique: true })
  nombre_area: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_modificacion: Date;

  @OneToMany(() => Programa, programa => programa.area)
  programas: Programa[];
}
