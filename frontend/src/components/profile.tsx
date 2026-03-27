import useAccount from "@/querys/useAccount";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { IconLoader, IconMail, IconUser } from "@tabler/icons-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useState } from "react";
import useUpdateAccount from "@/querys/useUpdateAccount";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { FormikInput } from "./form/formikInput";
import { Button } from "./ui/button";
import ImageUpload from "./UploadImage";

export default function Profile() {
  const { data: account, isPending } = useAccount();

  const { mutate: updateAccount, isPending: isUpdating } = useUpdateAccount();
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Profile settings
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Info</DialogTitle>
            <DialogDescription>
              Manage and update your account details, profile picture, and login
              information
            </DialogDescription>
          </DialogHeader>
          <Formik
            initialValues={{
              firstname: account?.firstname || "",
              lastname: account?.lastname || "",
              pfp: null,
              email: account?.email || "",
            }}
            validationSchema={yup.object({
              firstname: yup.string(),
              lastname: yup.string(),
              email: yup.string(),
              pfp: yup.mixed(),
            })}
            onSubmit={(values) => {
              console.log(values);
              const formData = new FormData();

              formData.append("firstname", values.firstname);
              formData.append("lastname", values.lastname);
              formData.append("email", values.email);
              if (values.pfp) {
                formData.append("pfp", values.pfp);
              }
              for (const x of formData.entries()) {
                console.log(x[0], x[1]);
              }

              updateAccount(formData);
            }}
          >
            {() => (
              <Form className="flex flex-col" encType="multipart/form-data">
                <section className="flex flex-col items-center gap-3">
                  <ImageUpload name="pfp" preview={account?.pfpUrl} />

                  <h1>
                    {account?.firstname} {account?.lastname}
                  </h1>
                  <p className="text-muted-foreground">{account?.email}</p>
                </section>
                <FormikInput
                  name="firstname"
                  label="new firstname :"
                  rightElement={<IconUser />}
                />
                <FormikInput
                  name="lastname"
                  label="new lastname :"
                  rightElement={<IconUser />}
                />
                <FormikInput
                  name="email"
                  label="new email :"
                  type="email"
                  rightElement={<IconMail />}
                />

                <Button
                  type="submit"
                  className="self-end"
                  disabled={isPending || isUpdating}
                >
                  {isPending || isUpdating ? (
                    <IconLoader className="animate-spin" />
                  ) : (
                    "save changes"
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
}
