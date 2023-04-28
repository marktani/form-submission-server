import { Constraint } from "../entity/Constraint";
import { Field } from "../entity/Field";

export const createBoundaryConstraints = (
  field: Field,
  min: number,
  max: number
): Constraint[] => {
  if (field.type !== "number") {
    throw Error("Boundary constraints can only be created for number fields.");
  }

  return [createMinConstraint(field, min), createMaxConstraint(field, max)];
};

export const createMinConstraint = (field: Field, min: number): Constraint => {
  if (field.type !== "number") {
    throw Error("Min constraints can only be created for number fields.");
  }

  const constraint = new Constraint();
  constraint.field = field;
  constraint.type = "min";
  constraint.value = `${min}`;

  return constraint;
};

export const createMaxConstraint = (field: Field, max: number): Constraint => {
  if (field.type !== "number") {
    throw Error("Max constraints can only be created for number fields.");
  }

  const constraint = new Constraint();
  constraint.field = field;
  constraint.type = "max";
  constraint.value = `${max}`;

  return constraint;
};
