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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useListInstitueUsers from "@/querys/administration/useListInstitueUsers";
import z from "zod";

export const Route = createFileRoute("/administration/dashboard/staff")({
  component: RouteComponent,
  validateSearch: z.object({
    pageNumber: z.coerce.number().default(1),
    pageSize: z.coerce.number().default(10),
  }),
});

function RouteComponent() {
  const params = Route.useSearch();

  const { mutate: addUniStaff, isPending: isAddPending } = useAddUniStaff();

  const { mutate: registerUniStaff, isPending: isRegisterPending } =
    useRegisterUniStaff();

  const { data: users, isPending } = useListInstitueUsers({ params });

  if (isPending) return <div>Loading...</div>;

  return (
    <main className="p-8 flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">REGISTRY MANAGEMENT</p>
          <h1 className="text-4xl font-semibold">Staff Registry</h1>
        </div>

        <div className="flex gap-2">
          {/* Add Existing Staff */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <IconUserPlus />
                Add Existing Staff
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Existing Staff</DialogTitle>
                <DialogDescription>
                  Add an existing staff member to your institute.
                </DialogDescription>
              </DialogHeader>

              <Formik
                initialValues={{ email: "" }}
                validationSchema={yup.object({
                  email: yup.string().email().required("Email is required"),
                })}
                onSubmit={(values) => addUniStaff(values)}
              >
                {() => (
                  <Form className="grid gap-4">
                    <FormikInput name="email" label="Email" />

                    <DialogFooter>
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

          {/* Register New Staff */}
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
                  Create a new staff account.
                </DialogDescription>
              </DialogHeader>

              <Formik
                initialValues={{
                  firstname: "",
                  lastname: "",
                  email: "",
                }}
                validationSchema={yup.object({
                  firstname: yup.string().required(),
                  lastname: yup.string().required(),
                  email: yup.string().email().required(),
                })}
                onSubmit={(values) => registerUniStaff(values)}
              >
                {() => (
                  <Form className="grid gap-4">
                    <FormikInput name="firstname" label="First Name" />
                    <FormikInput name="lastname" label="Last Name" />
                    <FormikInput name="email" label="Email" />

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" disabled={isRegisterPending}>
                        Register
                      </Button>
                    </DialogFooter>
                  </Form>
                )}
              </Formik>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* TABLE */}
      <Table className="border">
        <TableCaption>Institute Staff Members</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.firstname}</TableCell>
              <TableCell>{user.lastname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
