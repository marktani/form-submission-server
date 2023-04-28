import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Field } from "./Field";

@Entity()
export class Form {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((_type) => Field, (field) => field.form)
  fields: Field[];

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  version: string;
}
