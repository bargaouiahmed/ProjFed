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
  IconEdit,
  IconPlus,
} from "@tabler/icons-react";
import useUpdateClassMetadata from "@/querys/administration/useUpdateClassMetadata";

import { useState } from "react";
import { CourseManagerDialog } from "@/components/classes/CourseMangerDialog";
import { ClassListDialog } from "@/components/classes/ClassListDialog";

// ─── Route ───────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/administration/dashboard/classes")({
  component: RouteComponent,
  validateSearch: z.object({
    pageNumber: z.coerce.number(),
    pageSize: z.coerce.number(),
  }),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CourseManagerTarget {
  id: string;
  className: string;
  classCode: string;
}

function RouteComponent() {
  const { pageNumber, pageSize } = Route.useSearch();

  const [courseManagerClass, setCourseManagerClass] =
    useState<CourseManagerTarget | null>(null);

  const { data: institue, isLoading: isInstitueLoading } = useGetInstitue();
  const { mutate: addClass, isPending: isAddingToClass } = useAddClass();
  const { mutate: addClassMetadata, isPending } = useAddClassMetadata();
  const { mutate: updateClassMetadata, isPending: isUpdatingClassMetadata } =
    useUpdateClassMetadata();

  const instituteId = institue?.id ?? "";

  const { data: classMetadata, isLoading: isClassMetadataLoading } =
    useGetClassMetadata({
      instituteId,
      pageNumber,
      pageSize,
      enabled: !!instituteId,
    });

  const numberOfPages = Math.max(
    Math.ceil((classMetadata?.length || 0) / pageSize),
    1,
  );

  if (isInstitueLoading || isClassMetadataLoading) return <div>Loading...</div>;

  return (
    <main className="p-8 flex flex-col">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Class Metadata Management</h1>
          <p className="text-muted-foreground max-w-[40ch]">
            Configure and audit educational structures across your institute.
          </p>
        </div>

        {/* Add metadata dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={!instituteId}>
              <IconPlus />
              Add class metadata
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Class Metadata</DialogTitle>
              <DialogDescription>
                Create a new class metadata structure.
              </DialogDescription>
            </DialogHeader>

            <Formik
              onSubmit={(values) => {
                if (!instituteId) return;
                addClassMetadata({ ...values, instituteId });
              }}
              initialValues={{
                specialty: "",
                levelOfStudies: "",
                maxYears: 0,
                defaultMaxTerms: 0,
              }}
              validationSchema={yup.object({
                specialty: yup.string().required(),
                levelOfStudies: yup.string().required(),
                maxYears: yup.number().positive().integer().required(),
                defaultMaxTerms: yup.number().positive().integer().required(),
              })}
            >
              {() => (
                <Form className="grid gap-4">
                  <FormikInput name="specialty" label="Specialty" />
                  <FormikInput name="levelOfStudies" label="Diploma" />
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
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                      <IconDisc />
                      Save
                    </Button>
                  </DialogFooter>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Table className="border">
        <TableCaption>Class Metadata</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Specialty</TableHead>
            <TableHead>Diploma:</TableHead>
            <TableHead>Max Years</TableHead>
            <TableHead>Max Terms</TableHead>
            <TableHead># Classes</TableHead>
            <TableHead>Year</TableHead>
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
                <div className="flex gap-2">
                  {/* View classes */}
                  <ClassListDialog
                    metadataId={metadata.metadataId}
                    onSelectCourse={setCourseManagerClass}
                    trigger={<Button variant="outline">Classes</Button>}
                  />

                  {/* Add class */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="success">
                        <IconPlus />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm</AlertDialogTitle>
                        <AlertDialogDescription>
                          Add new class?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            disabled={isAddingToClass}
                            onClick={() =>
                              addClass({ metadataId: metadata.metadataId })
                            }
                          >
                            Confirm
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {/* Edit metadata */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="success">
                        <IconEdit />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Update</AlertDialogTitle>
                      </AlertDialogHeader>
                      <Formik
                        onSubmit={(values) => updateClassMetadata(values)}
                        initialValues={{
                          metadataId: metadata.metadataId,
                          levelOfStudies: metadata.levelOfStudies,
                          specialty: metadata.specialty,
                          maxYears: metadata.maxYears,
                          level: metadata.level,
                          maxTerms: metadata.maxTerms,
                          numberOfClasses: metadata.numberOfClasses,
                        }}
                      >
                        {() => (
                          <Form className="grid gap-3">
                            <FormikInput name="specialty" label="Specialty" />
                            <FormikInput name="maxYears" label="Max Years" />
                            <FormikInput name="maxTerms" label="Max Terms" />
                            <FormikInput
                              name="levelOfStudies"
                              label="Diploma"
                            />
                            <FormikInput
                              name="numberOfClasses"
                              label="Classes"
                            />
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <Button
                                  type="submit"
                                  disabled={isUpdatingClassMetadata}
                                >
                                  Update
                                </Button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </Form>
                        )}
                      </Formik>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={9}>
              <div className="flex justify-end gap-2">
                <Link
                  to="/administration/dashboard/classes"
                  search={{ pageNumber: Math.max(pageNumber - 1, 1), pageSize }}
                >
                  <Button disabled={pageNumber === 1}>
                    <IconArrowLeft />
                  </Button>
                </Link>
                <Button variant="ghost">{pageNumber}</Button>
                <Link
                  to="/administration/dashboard/classes"
                  search={{
                    pageNumber: Math.min(pageNumber + 1, numberOfPages),
                    pageSize,
                  }}
                >
                  <Button disabled={pageNumber === numberOfPages}>
                    <IconArrowRight />
                  </Button>
                </Link>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* Course manager — rendered outside the table so it isn't nested in it */}
      <CourseManagerDialog
        target={courseManagerClass}
        onClose={() => setCourseManagerClass(null)}
      />
    </main>
  );
}
