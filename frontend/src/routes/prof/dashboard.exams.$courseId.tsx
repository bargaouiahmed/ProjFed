import React from "react";
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
          <h1 className="text-3xl font-extrabold">Manage Exams</h1>
          <Badge className="px-3 py-1 bg-primary/10 text-primary">
            {count || 0} Total
          </Badge>
        </div>
      </header>

      <Button onClick={() => initExam(courseId)} className="gap-2">
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
        <Button variant="ghost" size="icon">
          <IconTrash size={18} className="text-destructive" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogTitle>
          Are you sure you want to delete this exam?
        </AlertDialogTitle>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteExam(exam.id)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function UpdateExamDialog({ exam }: { exam: Exam }) {
  const { mutate: updateExam } = useUpdateExam();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <IconPencil size={18} className="text-emerald-400" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>{exam.title}</DialogHeader>
        <DialogDescription>Update exam</DialogDescription>

        <Formik
          initialValues={{
            id: exam.id,
            title: exam.title,
            description: exam.description,
            totalMarks: exam.totalMarks,
          }}
          validationSchema={yup.object({
            id: yup.string().required(),
          })}
          onSubmit={(values) => updateExam(values)}
        >
          {({ handleChange, values }) => (
            <Form className="space-y-4">
              <FormikInput name="title" label="Title" />

              <ScrollArea className="h-24 border">
                <Textarea
                  name="description"
                  onChange={handleChange}
                  value={values.description}
                />
              </ScrollArea>

              <FormikInput name="totalMarks" label="Marks" type="number" />

              <Button type="submit">Update</Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

function ExamItem({ exam }: { exam: Exam }) {
  const [type, setType] = React.useState<"mcq" | "rq">("mcq");

  return (
    <Collapsible className="border rounded-xl">
      <section className="p-5 flex justify-between items-center">
        <div>
          <h3 className="font-bold">{exam.title}</h3>
          <p className="text-sm text-muted-foreground">{exam.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-amber-600">{exam.totalMarks} Marks</Badge>
          <UpdateExamDialog exam={exam} />
          <DeleteDialog exam={exam} />

          <CollapsibleTrigger asChild>
            <Button size="icon" variant="ghost">
              <IconChevronDown />
            </Button>
          </CollapsibleTrigger>
        </div>
      </section>

      <CollapsibleContent className="p-5 border-t space-y-4">
        <div className="flex w-full overflow-hidden rounded-lg border">
          <Button
            type="button"
            className="flex-1 "
            variant={type === "rq" ? "ghost" : "outline"}
            onClick={() => setType("mcq")}
          >
            MCQ
          </Button>

          <Button
            type="button"
            className="flex-1 "
            variant={type === "rq" ? "outline" : "ghost"}
            onClick={() => setType("rq")}
          >
            Redaction
          </Button>
        </div>

        {type === "mcq" ? (
          <div className="text-center py-16 border rounded-xl">
            <IconLayoutDashboard size={40} className="mx-auto mb-4" />
            <h2>No mcqs question created</h2>
          </div>
        ) : (
          <div className="text-center py-16 border rounded-xl">
            <IconLayoutDashboard size={40} className="mx-auto mb-4" />
            <h2>No redaction question found</h2>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

function RouteComponent() {
  const { courseId } = Route.useParams();
  const { data: exams, isLoading } = useExams(courseId);

  if (isLoading) return <p>Loading...</p>;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <Header courseId={courseId} count={exams?.length} />

      <div className="grid gap-4">
        {!exams || exams.length === 0 ? (
          <div className="text-center py-16 border rounded-xl">
            <IconLayoutDashboard size={40} className="mx-auto mb-4" />
            <h2>No exams found</h2>
          </div>
        ) : (
          exams.map((exam) => <ExamItem key={exam.id} exam={exam} />)
        )}
      </div>
    </main>
  );
}
