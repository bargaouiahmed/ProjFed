import { useState } from "react";
import { Form, Formik } from "formik";
import { Button } from "../../ui/button";
import {
  IconEye,
  IconEyeOff,
  IconLoader,
  IconMail,
  IconUser,
  IconUserExclamation,
} from "@tabler/icons-react";

import Logo from "../../Logo";
import { validation } from "./validation";
import { Heading } from "../heading";

import { FormikInput } from "@/components/formikInput";

export default function SignIn({ goToSignIn }: { goToSignIn: () => void }) {
  const [showPassword, setShowPasswod] = useState(false);
  return (
    <main className="flex-1 flex flex-col justify-center items-center px-6 py-6 md:px-20 shadow-md dark:shadow-xl">
      <div className="w-full max-w-112.5 flex flex-col gap-8">
        <header className="flex flex-col gap-2 text-center md:text-left">
          <Logo />
          <Heading title="Create your account" />
        </header>
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={validation}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            setTimeout(() => {
              console.log(values);
              setSubmitting(false);
            }, 1500);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-3">
              <div className="flex  justify-center gap-2 ">
                <Button variant={"outline"} className="w-1/2" type="button">
                  As a Student
                </Button>
                <Button variant={"outline"} className="w-1/2" type="button">
                  As a Teacher
                </Button>
              </div>

              <FormikInput
                name="firstName"
                label="firstName"
                type="text"
                placeholder="abdelkodous"
                icon={<IconUser />}
              />
              <FormikInput
                name="lastName"
                label="lastName"
                type="text"
                placeholder="ben younes"
                icon={<IconUserExclamation />}
              />
              <FormikInput
                name="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={<IconMail />}
              />

              <FormikInput
                name={"password"}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPasswod((p) => !p)}
                  >
                    {showPassword ? (
                      <IconEyeOff size={18} />
                    ) : (
                      <IconEye size={18} />
                    )}
                  </button>
                }
              />
              <p className="text-center text-sm">
                <span className="text-muted-foreground">have an account ?</span>{" "}
                <span
                  className="hover:underline cursor-pointer font-medium"
                  onClick={goToSignIn}
                >
                  sign in
                </span>
              </p>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2"
              >
                {isSubmitting ? (
                  <IconLoader className="animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
