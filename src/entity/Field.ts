import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Form } from "./Form";

@Entity()
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Form, (form) => form.fields)
  form: Form;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  type: string;

  @Column()
  required: boolean;
}
