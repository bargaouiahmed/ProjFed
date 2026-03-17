import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { IconEye, IconEyeOff, IconLoader } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import logo from "@/assets/react.svg";
import ThemeToggler from "../ThemeToggler";
export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:h-screen">
      <div className="absolute top-2 left-2">
        <ThemeToggler />
      </div>
      <div className="px-20 py-7 shadow-md dark:shadow-xl h-full flex-1  flex flex-col gap-6 ">
        <div className="flex flex-col gap-6 text-center sm:text-left">
          {/* Logo + Brand */}
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <img src={logo} className="w-10 h-10 object-contain" />
            <h1 className="text-2xl font-bold tracking-tight">Website Name</h1>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-0.5">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-md text-muted-foreground">
              Make education easier
            </p>
          </div>
        </div>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validate={(values) => {
            function isValidPassword(password: string) {
              return /[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password);
            }

            const errors: { email?: string; password?: string } = {};

            if (!values.email) {
              errors.email = "Email is required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }

            if (!values.password) {
              errors.password = "Password is required";
            } else if (values.password.length < 8) {
              errors.password = "Minimum 8 characters required";
            } else if (!isValidPassword(values.password)) {
              errors.password =
                "Must include 1 uppercase & 1 special character";
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);

            setTimeout(() => {
              console.log(values);
              setSubmitting(false);
            }, 1500);
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="flex flex-col gap-4">
              <div className="flex justify-center gap-3 mt-10 flex-wrap sm:flex-nowrap">
                <Button variant={"outline"} className="sm:px-10" type="button">
                  signin as Student
                </Button>
                <Button variant={"outline"} className="sm:px-10" type="button">
                  signin as Teacher
                </Button>
              </div>
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className={cn(
                    "text-sm font-medium cursor-pointer pl-1",
                    errors.email && touched.email && "text-red-400 ",
                  )}
                >
                  Email :
                </label>

                <Field
                  autoComplete="off"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border outline-none transition",
                    "focus:ring-2",
                    errors.email && touched.email
                      ? "border-red-400 focus:ring-red-400"
                      : "  focus:ring-primary",
                  )}
                />

                <div className="h-4">
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-sm text-red-400"
                  />
                </div>
              </div>
              {/* Password */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className={cn(
                      "text-sm font-medium cursor-pointer pl-1",
                      errors.password && touched.password && "text-red-400",
                    )}
                  >
                    Password :
                  </label>
                </div>

                <div className="relative">
                  <Field
                    autoComplete="off"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={cn(
                      "w-full px-3 py-2 pr-10 rounded-lg border outline-none transition",
                      "focus:ring-2",
                      errors.password && touched.password
                        ? "border-red-400 focus:ring-red-400"
                        : "focus:ring-primary",
                    )}
                  />

                  {/* Eye button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <IconEyeOff size={18} />
                    ) : (
                      <IconEye size={18} />
                    )}
                  </button>
                </div>

                <div className="h-4">
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-sm text-red-400"
                  />
                </div>
              </div>
              <Link
                to="/"
                className="underline text-indigo-400 hover:text-indigo-600"
              >
                forgot password ?
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2"
              >
                {isSubmitting ? (
                  <IconLoader
                    className={cn(
                      "animate-spin",
                      errors.password && touched.password && "bg-red-400",
                    )}
                  />
                ) : (
                  "Sign In"
                )}
              </Button>
              <p className="text-center">
                <span className="text-muted-foreground">
                  new to our platform ?
                </span>{" "}
                <span className="hover:underline cursor-pointer">
                  Create an account
                </span>
              </p>
              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <p>or</p>
                <Separator className="flex-1" />
              </div>
              <Button variant={"ghost"} type="button">
                request a business plan
              </Button>
            </Form>
          )}
        </Formik>
      </div>
      <section className="bg-red-500 flex-1/3 h-full"></section>
    </div>
  );
}
