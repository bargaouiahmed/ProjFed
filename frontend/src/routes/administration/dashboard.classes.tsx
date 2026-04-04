import { FormikInput } from "@/components/form/formikInput";
import { Button } from "@/components/ui/button";
import useAddClassMetadata from "@/querys/administration/useAddClassMetadata";
import useGetClassMetadata from "@/querys/administration/useGetClassMetadata";
import { createFileRoute } from "@tanstack/react-router";
import { Formik, Form } from "formik";

import z from "zod";
import * as yup from "yup";
import useGetInstitue from "@/querys/administration/useGetInstitue";
export const Route = createFileRoute("/administration/dashboard/classes")({
  component: RouteComponent,
  validateSearch: z.object({
    pageNumber: z.coerce.number().optional(),
    pageSize: z.coerce.number().optional(),
  }),
});

function RouteComponent() {
  const { pageNumber, pageSize } = Route.useSearch();
  const { data: institue, isLoading: isInstitueLoading } = useGetInstitue();

  const { mutate: addClassMetadata, isPending } = useAddClassMetadata();

  const instituteId = institue?.id ?? "";

  const { data: classMetadata, isLoading: isClassMetadataLoading } =
    useGetClassMetadata({
      instituteId,
      pageNumber,
      pageSize,
      enabled: !!instituteId,
    });

  if (isInstitueLoading) return <div>Loading...</div>;

  if (isClassMetadataLoading) return <div>Loading...</div>;

  return (
    <main className="p-8 ">
      <Formik
        onSubmit={(values) => {
          if (!instituteId) return;
          addClassMetadata({
            ...values,
            instituteId: instituteId,
          });
        }}
        initialValues={{
          specialty: "",
          levelOfStudies: "",
          maxYears: 0,
          defaultMaxTerms: 0,
        }}
        validationSchema={yup.object({
          specialty: yup.string().required("Specialty is required"),
          levelOfStudies: yup.string().required("Level of studies is required"),
          maxYears: yup
            .number()
            .required("Max years is required")
            .positive("Max years must be positive")
            .integer("Max years must be an integer"),
          defaultMaxTerms: yup
            .number()
            .required("Default max terms is required")
            .positive("Default max terms must be positive")
            .integer("Default max terms must be an integer"),
        })}
      >
        {() => (
          <Form>
            <FormikInput name="specialty" label="Specialty" />

            <FormikInput name="levelOfStudies" label="Level of Studies" />
            <FormikInput name="maxYears" label="Max Years" type="number" />
            <FormikInput
              name="defaultMaxTerms"
              label="Default Max Terms"
              type="number"
            />

            <Button type="submit" disabled={isPending}>
              Add Class Metadata
            </Button>
          </Form>
        )}
      </Formik>

      <div>{JSON.stringify(classMetadata)}</div>
    </main>
  );
}
