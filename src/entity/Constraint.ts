import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Field } from "./Field";

@Entity()
export class Constraint {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((_type) => Field)
  @JoinColumn({ name: "field_id" })
  field: Field;

  @Column()
  type: string;

  @Column()
  value: string;
}
