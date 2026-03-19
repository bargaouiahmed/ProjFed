import { useState } from "react";
import { Form, Formik } from "formik";
import { Button } from "../../ui/button";
import { IconEye, IconEyeOff, IconLoader, IconMail } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import Logo from "../../Logo";
import { validation } from "./validation";
import { Heading } from "../heading";
import { OrSeparator } from "../orSeparator";
import { FormikInput } from "@/components/formikInput";
import useLogin from "@/querys/useLogin";

export default function SignIn({ goToSignUp }: { goToSignUp: () => void }) {
  const { mutate: login, isPending } = useLogin();

  const [showPassword, setShowPasswod] = useState(false);
  return (
    <main className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-20 shadow-md dark:shadow-xl">
      <div className="w-full max-w-112.5 flex flex-col gap-8">
        <header className="flex flex-col gap-6 text-center md:text-left">
          <Logo />
          <Heading title={"Sign in to your account"} />
        </header>
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={validation}
          onSubmit={(values) => {
            login(values);
          }}
        >
          {() => (
            <Form className="flex flex-col gap-4">
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
              <Link
                to="/"
                className="text-sm underline text-indigo-400 hover:text-indigo-600 self-start"
              >
                forgot password?
              </Link>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full mt-2"
              >
                {isPending ? (
                  <IconLoader className="animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>

              <p className="text-center text-sm">
                <span className="text-muted-foreground">
                  new to our platform?
                </span>{" "}
                <span
                  className="hover:underline cursor-pointer font-medium"
                  onClick={goToSignUp}
                >
                  Create an account
                </span>
              </p>

              <OrSeparator />
              <Button variant="ghost" type="button" className="w-full">
                request a business plan
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
