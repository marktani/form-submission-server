import { createBoundaryConstraints } from "../constraints/number-constraints";
import { createLengthConstraints } from "../constraints/string-constraints";
import { FormSubmissionDataSource } from "../data/data-source";
import { Field } from "../entity/Field";
import { Form } from "../entity/Form";

FormSubmissionDataSource.initialize().then(async () => {
  // Create a new form
  const form = new Form();
  form.name = "User Form";
  form.description = "A form for basic information of a user.";
  form.version = "1";
  await FormSubmissionDataSource.manager.save(form);

  // Add basic fields
  const firstNameField = new Field();
  firstNameField.name = "First Name";
  firstNameField.type = "string";
  firstNameField.form = form;
  firstNameField.required = true;
  await FormSubmissionDataSource.manager.save(firstNameField);
  await FormSubmissionDataSource.manager.save(
    createLengthConstraints(firstNameField, 1, 200)
  );

  const lastNameField = new Field();
  lastNameField.name = "Last Name";
  lastNameField.type = "string";
  lastNameField.form = form;
  lastNameField.required = true;
  await FormSubmissionDataSource.manager.save(lastNameField);
  await FormSubmissionDataSource.manager.save(
    createLengthConstraints(lastNameField, 1, 200)
  );

  const commentField = new Field();
  commentField.name = "Comment";
  commentField.type = "string";
  commentField.form = form;
  commentField.required = false;
  await FormSubmissionDataSource.manager.save(commentField);
  await FormSubmissionDataSource.manager.save(
    createLengthConstraints(commentField, 1, 2000)
  );

  const ageField = new Field();
  ageField.name = "Age";
  ageField.type = "number";
  ageField.form = form;
  ageField.required = true;
  await FormSubmissionDataSource.manager.save(ageField);
  await FormSubmissionDataSource.manager.save(
    createBoundaryConstraints(ageField, 18, 150)
  );

  const savedFields = await FormSubmissionDataSource.manager.find(Field);
  console.log("All fields from the db: ", savedFields);
});
