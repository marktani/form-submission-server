import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Form } from "./Form";
import type { InputField } from "../types";

@Entity()
export class FormSubmission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((_type) => Form)
  @JoinColumn({ name: "form_id" })
  form: Form;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column("simple-json")
  data: { fields: InputField[] };

  @Column()
  status: string;

  @Column()
  progressComment: string;
}
