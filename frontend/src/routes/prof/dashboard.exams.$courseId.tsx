import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import useAddExamMcq from "@/querys/professor/useAddExamMcq";
import useAddExamRq from "@/querys/professor/useAddExamRq";
import useDeleteExam from "@/querys/professor/useDeleteExam";
import useDeleteExamMcq from "@/querys/professor/useDeleteExamMcq";
import useDeleteExamRq from "@/querys/professor/useDeleteExamRq";
import useExams, { type Exam } from "@/querys/professor/useExams";
import useInitExam from "@/querys/professor/useInitExam";
import useUpdateExam from "@/querys/professor/useUpdateExam";
import useUpdateExamMcq from "@/querys/professor/useUpdateExamMcq";
import * as yup from "yup";
import {
  IconChevronDown,
  IconLayoutDashboard,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormikInput } from "@/components/form/formikInput";
import { Form, Formik } from "formik";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/prof/dashboard/exams/$courseId")({
  component: RouteComponent,
});

export function Header({
  courseId,
  count,
}: {
  courseId: string;
  count?: number;
}) {
  const { mutate: initExam } = useInitExam();
  return (
    <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <IconLayoutDashboard className="text-primary" size={18} />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Professor Space
          </span>
        </div>
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Manage Exams
          </h1>
          <Badge
            variant="secondary"
            className="px-3 py-1 rounded-full bg-primary/10 text-primary border-none"
          >
            {count || 0} Total
          </Badge>
        </div>
      </header>
      <Button
        className="shadow-sm gap-2"
        onClick={() => {
          initExam(courseId);
        }}
      >
        <IconPlus size={18} />
        Initialize New Exam
      </Button>
    </section>
  );
}

export function DeleteDialog({ exam }: { exam: Exam }) {
  const { mutate: deleteExam } = useDeleteExam();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10"
        >
          <IconTrash size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>
          Are you sure you want to delete this exam?
        </AlertDialogTitle>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              deleteExam(exam.id);
            }}
          >
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function UpdateExamDialog({ exam }: { exam: Exam }) {
  const { mutate: updateExam, isPending: isUpdatingExam } = useUpdateExam();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:bg-primary/10"
        >
          <IconPencil size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="font-bold text-lg">{exam.title}</DialogHeader>
        <DialogDescription>Update the details for this exam.</DialogDescription>

        <Formik
          validationSchema={yup.object({
            id: yup.string().required("id is required"),
            title: yup.string().optional(),
            description: yup.string().optional(),
            totalMarks: yup.number(),
          })}
          initialValues={{
            id: exam.id,
            title: exam.title,
            description: exam.description,
            totalMarks: exam.totalMarks,
          }}
          onSubmit={(values) => {
            updateExam(values);
          }}
        >
          {({ handleChange, values }) => (
            <Form className="space-y-4 py-4">
              <FormikInput name="id" label="Exam ID" />
              <FormikInput name="title" label="Title" />
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <ScrollArea className="h-24 w-full rounded-md border">
                  <Textarea
                    name="description"
                    placeholder="Enter exam description..."
                    className="border-none focus-visible:ring-0 "
                    onChange={handleChange}
                    value={values.description}
                  />
                </ScrollArea>
              </div>
              <FormikInput
                name="totalMarks"
                label="Total Marks"
                type="number"
              />
              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  disabled={isUpdatingExam}
                  className="w-full sm:w-auto"
                >
                  <IconPencil size={16} className="mr-2" />
                  Update Exam
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

function RouteComponent() {
  const { courseId } = Route.useParams();
  const { data: exams, isLoading: isLoadingExams } = useExams(courseId);

  if (isLoadingExams)
    return (
      <div className="flex items-center justify-center ">
        <p className="text-muted-foreground animate-pulse">Loading exams...</p>
      </div>
    );

  return (
    <main className="max-w-5xl mx-auto p-6 mt-4">
      <Header courseId={courseId} count={exams?.length} />

      <div className="grid gap-4">
        {exams?.map((exam) => (
          <Collapsible
            key={exam.id}
            className="group overflow-hidden rounded-xl border bg-card "
          >
            <section className="p-5 flex justify-between items-center gap-4">
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-bold leading-none tracking-tight">
                  {exam.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1 max-w-125">
                  {exam.description}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <Badge
                  variant="outline"
                  className="h-7 px-3 font-semibold bg-muted/50 border-border"
                >
                  {exam.totalMarks} Marks
                </Badge>

                <div className="flex items-center gap-1 border-x px-2">
                  <UpdateExamDialog exam={exam} />
                  <DeleteDialog exam={exam} />
                </div>

                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <IconChevronDown
                      size={20}
                      className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </section>
            <CollapsibleContent className="px-5 pb-5 pt-0 text-sm text-muted-foreground border-t bg-muted/20">
              <div className="mt-4">
                <h1>Question mangement</h1>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </main>
  );
}
