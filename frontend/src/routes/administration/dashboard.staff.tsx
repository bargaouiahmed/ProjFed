import { Button } from "@/components/ui/button";
import useAddUniStaff from "@/querys/administration/useAddUniStaff";
import useRegisterUniStaff from "@/querys/administration/useRegisterUniStaff";
import { IconPlus, IconUserPlus } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { FormikInput } from "@/components/form/formikInput";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/administration/dashboard/staff")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutate: addUniStaff, isPending: isAddPending } = useAddUniStaff();
  const { mutate: registerUniStaff, isPending: isRegisterPending } =
    useRegisterUniStaff();

  return (
    <main className="p-8">
      <div className="flex items-center justify-between ">
        <div>
          <p className="text-gray-400 text-sm">REGISTRY MANGEMENT</p>
          <h1 className="text-4xl font-semibold">Staff Registry</h1>
        </div>

        <div className="flex gap-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"outline"}>
                <IconUserPlus />
                Add Existing Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Existing Staff</DialogTitle>
                <DialogDescription>
                  Add an existing staff member to your institute by their email
                  address.
                </DialogDescription>
              </DialogHeader>

              <Formik
                onSubmit={(values) => {
                  addUniStaff(values);
                }}
                initialValues={{
                  email: "",
                }}
                validationSchema={yup.object({
                  email: yup
                    .string()
                    .email("Invalid email address")
                    .required("Email is required"),
                })}
              >
                {() => (
                  <Form className="grid gap-4">
                    <FormikInput name="email" label="Email" type="email" />

                    <DialogFooter className="mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" disabled={isAddPending}>
                        Add Staff
                      </Button>
                    </DialogFooter>
                  </Form>
                )}
              </Formik>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <IconPlus />
                Register New Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register New Staff</DialogTitle>
                <DialogDescription>
                  Register a new staff member by providing their personal
                  information and email address.
                </DialogDescription>
              </DialogHeader>

              <Formik
                onSubmit={(values) => {
                  registerUniStaff(values);
                }}
                initialValues={{
                  firstname: "",
                  lastname: "",
                  email: "",
                }}
                validationSchema={yup.object({
                  firstname: yup.string().required("First name is required"),
                  lastname: yup.string().required("Last name is required"),
                  email: yup
                    .string()
                    .email("Invalid email address")
                    .required("Email is required"),
                })}
              >
                {() => (
                  <Form className="grid gap-4">
                    <FormikInput name="firstname" label="First Name" />
                    <FormikInput name="lastname" label="Last Name" />
                    <FormikInput name="email" label="Email" type="email" />

                    <DialogFooter className="mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" disabled={isRegisterPending}>
                        Register Staff
                      </Button>
                    </DialogFooter>
                  </Form>
                )}
              </Formik>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </main>
  );
}
