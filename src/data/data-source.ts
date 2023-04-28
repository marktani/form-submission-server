import "reflect-metadata";
import { DataSource } from "typeorm";
import { Form } from "../entity/Form";
import { Field } from "../entity/Field";
import { FormSubmission } from "../entity/FormSubmission";
import { Constraint } from "../entity/Constraint";

export const FormSubmissionDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "postgres",
  synchronize: true,
  logging: false,
  entities: [Form, Field, FormSubmission, Constraint],
  migrations: [],
  subscribers: [],
});
