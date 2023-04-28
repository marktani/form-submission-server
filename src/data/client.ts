import { DataSource, In } from "typeorm";
import { Form } from "../entity/Form";
import { Field } from "../entity/Field";
import { Constraint } from "../entity/Constraint";
import { FormSubmission } from "../entity/FormSubmission";

export class FormSubmissionClient {
  dataSource: DataSource;

  constructor(formSubmissionDataSource: DataSource) {
    this.dataSource = formSubmissionDataSource;
  }

  getFormById = (id: number): Promise<Form> => {
    return this.dataSource.manager.findOne(Form, {
      relations: {},
      where: {
        id: id,
      },
    });
  };

  getFormWithFieldsById = (id: number): Promise<Form> => {
    return this.dataSource.manager.findOne(Form, {
      relations: {
        fields: true,
      },
      where: {
        id: id,
      },
    });
  };

  getAllForms = (): Promise<Form[]> => {
    return this.dataSource.manager.find(Form);
  };

  getAllFieldsByFormId = (formId: number): Promise<Field[]> => {
    return this.dataSource.manager.find(Field, {
      where: {
        form: {
          id: formId,
        },
      },
    });
  };

  getAllConstraintsWithFieldByFieldIds = (
    fieldIds: number[]
  ): Promise<Constraint[]> => {
    return this.dataSource.manager.find(Constraint, {
      relations: {
        field: true,
      },
      where: {
        field: {
          id: In([...fieldIds]),
        },
      },
    });
  };

  createNewFormSubmission = (
    formSubmission: FormSubmission
  ): Promise<FormSubmission> => {
    return this.dataSource.manager.save(FormSubmission, formSubmission);
  };

  getAllFormSubmissions = (): Promise<FormSubmission[]> => {
    return this.dataSource.manager.find(FormSubmission, {
      select: {
        id: true,
        createdAt: true,
        status: true,
        progressComment: true,
      },
    });
  };

  getFormSubmissionWithDataById = (id: number): Promise<FormSubmission> => {
    return this.dataSource.manager.findOne(FormSubmission, {
      relations: {
        form: true,
      },
      where: {
        id: id,
      },
    });
  };
}
