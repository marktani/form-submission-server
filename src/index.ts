import type { FormSubmissionRequestBody, InputField } from "./types";
import { FormSubmissionDataSource } from "./data/data-source";
import * as express from "express";
import { FormSubmissionClient } from "./data/client";
import {
  ValidationError,
  validateFormSubmission,
} from "./submissions/validate";
import { FormSubmission } from "./entity/FormSubmission";

const app = express();
app.use(express.json());

const PORT = 8080;

FormSubmissionDataSource.initialize()
  .then(async () => {
    const client = new FormSubmissionClient(FormSubmissionDataSource);

    app.get("/", (req, res) => {
      res.send("Hello, world!");
    });

    app.get("/forms", async (req, res) => {
      res.json(await client.getAllForms());
    });

    app.get("/forms/:id", async (req, res) => {
      const id = req.params.id;

      const form = await client.getFormWithFieldsById(id);

      if (!form) {
        return res.status(404).json(`Form ${id} not found!`);
      }

      const data = {
        form,
      };

      res.json(data);
    });

    app.get("/submissions", async (req, res) => {
      res.json(await client.getAllFormSubmissions());
    });

    app.get("/submissions/:id", async (req, res) => {
      const id = req.params.id;

      const formSubmission = await client.getFormSubmissionWithDataById(id);

      if (!formSubmission) {
        return res.status(404).json(`Submission ${id} not found!`);
      }

      const data = {
        formSubmission,
      };

      res.json(data);
    });

    app.post("/submit", async (req, res) => {
      const requestBody = req.body;
      if (!isFormSubmissionRequestBody(requestBody)) {
        return res.status(400).json("Invalid form body!");
      }

      const formId = requestBody.formId;
      const inputFields = requestBody.fields;

      const inputFieldsMap = new Map<string, InputField>(
        inputFields.map((field) => [field.id, field])
      );

      const inputFieldIds: number[] = Array.from(inputFieldsMap.keys()).map(
        (id) => parseInt(id)
      );

      const form = await client.getFormWithFieldsById(formId);
      const expectedFields = form.fields;

      const constraints = await client.getAllConstraintsWithFieldByFieldIds(
        inputFieldIds
      );

      const validationResult = validateFormSubmission(
        inputFieldsMap,
        expectedFields,
        constraints
      );

      if (ValidationError.isInstance(validationResult)) {
        res.status(422).json(validationResult.message);
      } else {
        // submit form
        const formSubmission = new FormSubmission();
        formSubmission.data = {
          fields: requestBody.fields,
        };
        formSubmission.form = form;
        formSubmission.status = "SUBMITTED";
        formSubmission.progressComment =
          "We are checking your form submission, please wait for further updates.";

        const createdFormSubmission = await client.createNewFormSubmission(
          formSubmission
        );

        res.json({
          id: createdFormSubmission.id,
          createdAt: createdFormSubmission.createdAt,
          status: createdFormSubmission.status,
        });
      }
    });

    app.listen(PORT, () => {
      console.log(`From submission server listening on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

const isFormSubmissionRequestBody = (
  body: any
): body is FormSubmissionRequestBody => {
  return body.formId !== undefined && body.fields !== undefined;
};
