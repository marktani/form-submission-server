import { Constraint } from "../entity/Constraint";
import { Field } from "../entity/Field";

export const createLengthConstraints = (
  field: Field,
  minLength: number,
  maxLength: number
): Constraint[] => {
  if (field.type !== "string") {
    throw Error("Length constraints can only be created for string fields.");
  }

  return [
    createMinLengthConstraint(field, minLength),
    createMaxLengthConstraint(field, maxLength),
  ];
};

export const createMinLengthConstraint = (
  field: Field,
  minLength: number
): Constraint => {
  if (field.type !== "string") {
    throw Error("Length constraints can only be created for string fields.");
  }

  const constraint = new Constraint();
  constraint.field = field;
  constraint.type = "minLength";
  constraint.value = `${minLength}`;

  return constraint;
};

export const createMaxLengthConstraint = (
  field: Field,
  maxLength: number
): Constraint => {
  if (field.type !== "string") {
    throw Error("Length constraints can only be created for string fields.");
  }

  const constraint = new Constraint();
  constraint.field = field;
  constraint.type = "maxLength";
  constraint.value = `${maxLength}`;

  return constraint;
};
