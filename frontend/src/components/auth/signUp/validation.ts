import type { FormikValues } from "formik";

export const validation = (values: FormikValues) => {
  function isValidPassword(password: string) {
    return /[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password);
  }

  const errors: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  } = {};

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Minimum 8 characters required";
  } else if (!isValidPassword(values.password)) {
    errors.password = "Must include 1 uppercase & 1 special character";
  }

  if (!values.firstName) {
    errors.firstName = "firstName is required";
  }

  if (!values.lastName) {
    errors.lastName = "lastName is required";
  }
  return errors;
};
