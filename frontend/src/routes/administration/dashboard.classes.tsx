import { useState } from "react";
import { FormikInput } from "@/components/form/formikInput";
import { Button } from "@/components/ui/button";
import useAddClassMetadata from "@/querys/administration/useAddClassMetadata";
import useGetClassMetadata from "@/querys/administration/useGetClassMetadata";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Formik, Form } from "formik";

import z from "zod";
import * as yup from "yup";
import useGetInstitue from "@/querys/administration/useGetInstitue";
import useAddClass from "@/querys/administration/useAddClass";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  IconArrowLeft,
  IconArrowRight,
  IconDisc,
  IconPlus,
} from "@tabler/icons-react";

export const Route = createFileRoute("/administration/dashboard/classes")({
  component: RouteComponent,
  validateSearch: z.object({
    pageNumber: z.coerce.number(),
    pageSize: z.coerce.number(),
  }),
});

function RouteComponent() {
  const { pageNumber, pageSize } = Route.useSearch();
  const { data: institue, isLoading: isInstitueLoading } = useGetInstitue();

  const { mutate: addClass } = useAddClass();
  const { mutate: addClassMetadata, isPending } = useAddClassMetadata();

  const [isMetadataDialogOpen, setIsMetadataDialogOpen] = useState(false);
  const [selectedMetadataId, setSelectedMetadataId] = useState<string | null>(
    null,
  );

  const instituteId = institue?.id ?? "";

  const handleConfirmAddClass = () => {
    if (!selectedMetadataId) return;
    addClass({ metadataId: selectedMetadataId });
    setSelectedMetadataId(null);
  };

  const { data: classMetadata, isLoading: isClassMetadataLoading } =
    useGetClassMetadata({
      instituteId,
      pageNumber,
      pageSize,
      enabled: !!instituteId,
    });
  console.log(classMetadata);
  const numberOfPages = Math.max(
    Math.ceil((classMetadata?.length || 0) / pageSize),
    1,
  );
  if (isInstitueLoading) return <div>Loading...</div>;

  if (isClassMetadataLoading) return <div>Loading...</div>;

  return (
    <main className="p-8 flex flex-col mt-20">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Class Metadata Management</h1>
          <p className="text-muted-foreground max-w-[40ch]">
            Configure and audit educational structures across your institute.
          </p>
        </div>

        <Dialog
          open={isMetadataDialogOpen}
          onOpenChange={setIsMetadataDialogOpen}
        >
          <DialogTrigger asChild>
            <Button disabled={!instituteId} variant="default">
              <IconPlus />
              Add class metadata
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Class Metadata</DialogTitle>
              <DialogDescription>
                Create a new class metadata structure for your institute.
              </DialogDescription>
            </DialogHeader>

            <Formik
              onSubmit={(values) => {
                if (!instituteId) return;
                addClassMetadata({
                  ...values,
                  instituteId: instituteId,
                });
                setIsMetadataDialogOpen(false);
              }}
              initialValues={{
                specialty: "",
                levelOfStudies: "",
                maxYears: 0,
                defaultMaxTerms: 0,
              }}
              validationSchema={yup.object({
                specialty: yup.string().required("Specialty is required"),
                levelOfStudies: yup
                  .string()
                  .required("Level of studies is required"),
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
                <Form className="grid gap-4">
                  <FormikInput name="specialty" label="Specialty" />
                  <FormikInput name="levelOfStudies" label="Level of Studies" />
                  <FormikInput
                    name="maxYears"
                    label="Max Years"
                    type="number"
                  />
                  <FormikInput
                    name="defaultMaxTerms"
                    label="Default Max Terms"
                    type="number"
                  />

                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                      <IconDisc />
                      Save metadata
                    </Button>
                  </DialogFooter>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <Table className="border">
          <TableCaption>Class Metadata</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Specialty</TableHead>
              <TableHead>Level of Studies</TableHead>
              <TableHead>Max Years</TableHead>
              <TableHead>Max Terms</TableHead>
              <TableHead>Number of Classes</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classMetadata?.map((metadata) => (
              <TableRow key={metadata.metadataId}>
                <TableCell>{metadata.specialty}</TableCell>
                <TableCell>{metadata.levelOfStudies}</TableCell>
                <TableCell>{metadata.maxYears}</TableCell>
                <TableCell>{metadata.maxTerms}</TableCell>
                <TableCell>{metadata.numberOfClasses}</TableCell>
                <TableCell>{metadata.level}</TableCell>
                <TableCell>
                  <AlertDialog
                    onOpenChange={(open) => {
                      if (!open) {
                        setSelectedMetadataId(null);
                      }
                    }}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setSelectedMetadataId(metadata.metadataId)
                        }
                      >
                        Add class
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm add class</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to add a new class for this
                          metadata entry?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button onClick={handleConfirmAddClass}>
                            Confirm
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter className="bg-background hover:bg-background">
            <TableRow>
              <TableCell colSpan={9}>
                <div className="flex justify-end items-center gap-2">
                  {/* Previous */}
                  <Link
                    to="/administration/dashboard/classes"
                    search={{
                      pageNumber: Math.max(pageNumber - 1, 1),
                      pageSize: pageSize,
                    }}
                  >
                    <Button disabled={pageNumber === 1} variant={"outline"}>
                      <IconArrowLeft />
                    </Button>
                  </Link>

                  <Button variant={"ghost"}>{pageNumber}</Button>

                  {/* Next */}
                  <Link
                    to="/administration/dashboard/classes"
                    search={{
                      pageNumber: Math.min(pageNumber + 1, numberOfPages),
                      pageSize: pageSize,
                    }}
                  >
                    <Button
                      size={"icon-lg"}
                      variant={"outline"}
                      disabled={pageNumber === numberOfPages}
                    >
                      <IconArrowRight />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </main>
  );
}
