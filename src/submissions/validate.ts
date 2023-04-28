import type { InputField } from "../types";
import { Constraint } from "../entity/Constraint";
import { Field } from "../entity/Field";

export class ValidationError {
  constructor(readonly message: string) {}

  static isInstance(err: unknown): err is ValidationError {
    if (err === undefined) return false;
    if (typeof err !== "object") return false;
    if (err === null) return false;
    return err instanceof ValidationError;
  }
}

class RequiredFieldMissingError {
  constructor(readonly fieldId: number) {}

  static isInstance(err: unknown): err is RequiredFieldMissingError {
    if (err === undefined) return false;
    if (typeof err !== "object") return false;
    if (err === null) return false;
    return err instanceof RequiredFieldMissingError;
  }
}

class ConstraintNotMetError {
  constructor(
    readonly type: string,
    readonly constraintValue: string,
    readonly fieldId: number
  ) {}

  static isInstance(err: unknown): err is ConstraintNotMetError {
    if (err === undefined) return false;
    if (typeof err !== "object") return false;
    if (err === null) return false;
    return err instanceof ConstraintNotMetError;
  }
}

export const validateFormSubmission = (
  inputFieldsMap: Map<string, InputField>,
  expectedFields: Field[],
  constraints: Constraint[]
): boolean | ValidationError => {
  const requiredFieldsResult = checkRequiredFieldsArePresent(
    expectedFields,
    inputFieldsMap
  );
  if (RequiredFieldMissingError.isInstance(requiredFieldsResult)) {
    return new ValidationError(
      `required field ${requiredFieldsResult.fieldId} is missing`
    );
  }

  const constraintsResult = validateConstraints(inputFieldsMap, constraints);
  if (ConstraintNotMetError.isInstance(constraintsResult)) {
    return new ValidationError(
      `constraint with type ${constraintsResult.type} and value ${constraintsResult.constraintValue} was not met for field ${constraintsResult.fieldId}`
    );
  }

  return true;
};

const checkRequiredFieldsArePresent = (
  expectedFields: Field[],
  inputFieldsMap: Map<string, InputField>
): boolean | RequiredFieldMissingError => {
  for (const field of expectedFields) {
    if (field.required) {
      if (!inputFieldsMap.has(`${field.id}`)) {
        return new RequiredFieldMissingError(field.id);
      }
    }
  }

  return true;
};

const validateConstraints = (
  inputFieldsMap: Map<string, InputField>,
  constraints: Constraint[]
) => {
  for (const constraint of constraints) {
    switch (constraint.field.type) {
      case "number": {
        const inputField = inputFieldsMap.get(`${constraint.field.id}`);
        const inputValue = parseInt(inputField.value);

        switch (constraint.type) {
          case "min": {
            if (inputValue < parseInt(constraint.value)) {
              return new ConstraintNotMetError(
                constraint.type,
                constraint.value,
                constraint.field.id
              );
            }
            break;
          }
          case "max": {
            if (inputValue > parseInt(constraint.value)) {
              return new ConstraintNotMetError(
                constraint.type,
                constraint.value,
                constraint.field.id
              );
            }
            break;
          }
          default: {
            throw new Error("not implemented");
          }
        }
        break;
      }
      case "string": {
        const inputField = inputFieldsMap.get(`${constraint.field.id}`);
        const inputValue = inputField.value;

        switch (constraint.type) {
          case "minLength": {
            if (inputValue.length < parseInt(constraint.value)) {
              return new ConstraintNotMetError(
                constraint.type,
                constraint.value,
                constraint.field.id
              );
            }
            break;
          }
          case "maxLength": {
            if (inputValue.length > parseInt(constraint.value)) {
              return new ConstraintNotMetError(
                constraint.type,
                constraint.value,
                constraint.field.id
              );
            }
            break;
          }
        }
        break;
      }
      default: {
        throw new Error("not implemented");
      }
    }
  }
};
