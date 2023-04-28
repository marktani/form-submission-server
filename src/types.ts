export type FormSubmissionRequestBody = {
  formId: number;
  fields: InputField[];
};

export type InputField = {
  id: string;
  value: string;
};
