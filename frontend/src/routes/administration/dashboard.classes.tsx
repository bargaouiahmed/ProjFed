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
  IconBook,
  IconDisc,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import useUpdateClassMetadata from "@/querys/administration/useUpdateClassMetadata";
import useListMClasses from "@/querys/administration/useListMClasses";
import useListClassCourses from "@/querys/administration/useListClassCourses";
import useAddCourseToClass from "@/querys/administration/useAddCourseToClass";
import useRemoveCourse from "@/querys/administration/useDeleteCourseFromClass";
import { useState } from "react";

export const Route = createFileRoute("/administration/dashboard/classes")({
  component: RouteComponent,
  validateSearch: z.object({
    pageNumber: z.coerce.number(),
    pageSize: z.coerce.number(),
  }),
});

function RouteComponent() {
  const { pageNumber, pageSize } = Route.useSearch();

  const [selectedMetadataId, setSelectedMetadataId] = useState<string | null>(
    null,
  );
  const [courseManagerClass, setCourseManagerClass] = useState<{
    id: string;
    className: string;
    classCode: string;
  } | null>(null);

  const { data: institue, isLoading: isInstitueLoading } = useGetInstitue();
  const { mutate: addClass, isPending: isAddingToClass } = useAddClass();
  const { mutate: addClassMetadata, isPending } = useAddClassMetadata();

  const instituteId = institue?.id ?? "";

  const { data: classMetadata, isLoading: isClassMetadataLoading } =
    useGetClassMetadata({
      instituteId,
      pageNumber,
      pageSize,
      enabled: !!instituteId,
    });

  const { mutate: updateClassMetadata, isPending: isUpdatingClassMetadata } =
    useUpdateClassMetadata();

  const { data: classList, isLoading: isClassListLoading } = useListMClasses({
    metadataId: selectedMetadataId!,
    enabled: !!selectedMetadataId,
  });

  const { data: classCourses, isLoading: isClassCoursesLoading } =
    useListClassCourses({
      classId: courseManagerClass?.id ?? "",
      enabled: !!courseManagerClass,
    });

  const { mutate: addCourseToClass, isPending: isAddingCourse } =
    useAddCourseToClass();
  const { mutate: removeCourse, isPending: isRemovingCourse } =
    useRemoveCourse();

  const numberOfPages = Math.max(
    Math.ceil((classMetadata?.length || 0) / pageSize),
    1,
  );

  if (isInstitueLoading) return <div>Loading...</div>;
  if (isClassMetadataLoading) return <div>Loading...</div>;

  return (
    <main className="p-8 flex flex-col ">
      {/* HEADER */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Class Metadata Management</h1>
          <p className="text-muted-foreground max-w-[40ch]">
            Configure and audit educational structures across your institute.
          </p>
        </div>

        {/* ADD METADATA */}
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
                addClassMetadata({
                  ...values,
                  instituteId,
                });
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

      {/* TABLE */}
      <Table className="border">
        <TableCaption>Class Metadata</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Specialty</TableHead>
            <TableHead>Level</TableHead>
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
                  {/* VIEW CLASSES */}
                  <Dialog
                    onOpenChange={(open) => {
                      if (!open) setSelectedMetadataId(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setSelectedMetadataId(metadata.metadataId)
                        }
                      >
                        Classes
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Classes List</DialogTitle>
                      </DialogHeader>

                      <div className="max-h-100 overflow-y-auto border rounded-md p-2">
                        {isClassListLoading ? (
                          <div>Loading...</div>
                        ) : classList?.length === 0 ? (
                          <div>No classes found</div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {classList?.map((cls) => (
                              <div
                                key={cls.id}
                                className="p-3 border rounded-lg flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div>
                                  <p className="font-medium">{cls.className}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {cls.classCode}
                                  </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  <div className="text-sm text-muted-foreground">
                                    Term {cls.currentTerm}/{cls.maxTerms}
                                  </div>
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() =>
                                      setCourseManagerClass({
                                        id: cls.id,
                                        className: cls.className,
                                        classCode: cls.classCode,
                                      })
                                    }
                                  >
                                    <IconBook size={16} className="mr-1" />
                                    Courses
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* ADD CLASS */}
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
                  {/* EDIT */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant={"success"}>
                        <IconEdit />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Update</AlertDialogTitle>
                      </AlertDialogHeader>

                      <Formik
                        onSubmit={(values) => {
                          updateClassMetadata(values);
                        }}
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
                            <FormikInput name="levelOfStudies" label="Level" />
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
                  search={{
                    pageNumber: Math.max(pageNumber - 1, 1),
                    pageSize,
                  }}
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

      <Dialog
        open={!!courseManagerClass}
        onOpenChange={(open) => {
          if (!open) setCourseManagerClass(null);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Courses — {courseManagerClass?.className}</DialogTitle>
            <DialogDescription>
              {courseManagerClass?.classCode} · Add or remove courses for this
              class.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-md border">
              {isClassCoursesLoading ? (
                <div className="p-4 text-sm text-muted-foreground">
                  Loading courses…
                </div>
              ) : !classCourses?.length ? (
                <div className="p-4 text-sm text-muted-foreground">
                  No courses yet. Add one below.
                </div>
              ) : (
                <ul className="divide-y">
                  {classCourses.map((course) => (
                    <li
                      key={course.id}
                      className="flex items-start justify-between gap-2 p-3"
                    >
                      <div className="min-w-0">
                        <p className="font-medium leading-tight">
                          {course.courseName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Term {course.term}
                          {typeof course.studentCount === "number"
                            ? ` · ${course.studentCount} students`
                            : ""}
                        </p>
                        {course.description ? (
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {course.description}
                          </p>
                        ) : null}
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="shrink-0 text-destructive hover:text-destructive"
                            disabled={isRemovingCourse}
                            aria-label={`Remove ${course.courseName}`}
                          >
                            <IconTrash size={18} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove course?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This removes{" "}
                              <span className="font-medium text-foreground">
                                {course.courseName}
                              </span>{" "}
                              from this class. This cannot be undone from here.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button
                                variant="destructive"
                                disabled={isRemovingCourse}
                                onClick={() => removeCourse(course.id)}
                              >
                                Remove
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {courseManagerClass ? (
              <Formik
                initialValues={{
                  courseName: "",
                  term: 1,
                  description: "",
                }}
                validationSchema={yup.object({
                  courseName: yup.string().required("Name is required"),
                  term: yup
                    .number()
                    .integer()
                    .min(1, "Term must be at least 1")
                    .required(),
                  description: yup.string().optional(),
                })}
                onSubmit={(values, { resetForm }) => {
                  addCourseToClass(
                    {
                      classId: courseManagerClass.id,
                      courseName: values.courseName.trim(),
                      term: values.term,
                      description: values.description.trim() || undefined,
                    },
                    { onSuccess: () => resetForm() },
                  );
                }}
              >
                {() => (
                  <Form className="grid gap-3 rounded-md border p-4">
                    <p className="text-sm font-medium">Add course</p>
                    <FormikInput name="courseName" label="Course name" />
                    <FormikInput name="term" label="Term" type="number" />
                    <FormikInput name="description" label="Description" />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isAddingCourse}>
                        <IconPlus className="mr-1" size={16} />
                        Add course
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
