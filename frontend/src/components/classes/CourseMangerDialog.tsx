import { AddProfessorForm } from "./AddProfessorForm"; // or adjusted path
import type { CourseManagerTarget } from "@/routes/administration/dashboard.classes"; // or co-locate the type
import { FormikInput } from "@/components/form/formikInput";
import { Button } from "@/components/ui/button";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useListClassCourses from "@/querys/administration/useListClassCourses";
import useAddCourseToClass from "@/querys/administration/useAddCourseToClass";
import useRemoveCourse from "@/querys/administration/useDeleteCourseFromClass";
import useRemoveProfFromCourse from "@/querys/professor/useRemoveProfFromCourse";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
  IconPlus,
  IconTrash,
  IconUserMinus,
  IconUserPlus,
} from "@tabler/icons-react";

interface CourseManagerDialogProps {
  target: CourseManagerTarget | null;
  onClose: () => void;
}

export function CourseManagerDialog({
  target,
  onClose,
}: CourseManagerDialogProps) {
  const { data: classCourses, isLoading: isClassCoursesLoading } =
    useListClassCourses({
      classId: target?.id ?? "",
      enabled: !!target,
    });

  const { mutate: addCourseToClass, isPending: isAddingCourse } =
    useAddCourseToClass();
  const { mutate: removeCourse, isPending: isRemovingCourse } =
    useRemoveCourse();
  const { mutate: removeProf, isPending: isRemoving } =
    useRemoveProfFromCourse();

  return (
    <Dialog
      open={!!target}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Courses — {target?.className}</DialogTitle>
          <DialogDescription>
            {target?.classCode} · Add or remove courses and professors for this
            class.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Course list */}
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

                    <div className="flex shrink-0 items-center gap-2">
                      {/* Add professor */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label={`Add professor to ${course.courseName}`}
                          >
                            <IconUserPlus size={18} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Professor</DialogTitle>
                            <DialogDescription>
                              {course.courseName}
                            </DialogDescription>
                          </DialogHeader>
                          <AddProfessorForm courseId={course.id} />
                        </DialogContent>
                      </Dialog>

                      {/* Remove professor */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label={`Remove professor from ${course.courseName}`}
                          >
                            <IconUserMinus size={18} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Remove Professor</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to remove the professor from{" "}
                              {course.courseName}?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="destructive"
                              onClick={() => removeProf(course.id)}
                              disabled={isRemoving}
                            >
                              Yes, remove
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Remove course */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:text-destructive"
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
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Add course form */}
          {target ? (
            <Formik
              initialValues={{ courseName: "", term: 1, description: "" }}
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
                    classId: target.id,
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
  );
}
