import type { FormikValues } from "formik";

export const validation = (values: FormikValues) => {
  function isValidPassword(password: string) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  }

  const errors: {
    email?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
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

  if (!values.firstname) {
    errors.firstname = "firstName is required";
  }

  if (!values.lastname) {
    errors.lastname = "lastName is required";
  }
  return errors;
};
