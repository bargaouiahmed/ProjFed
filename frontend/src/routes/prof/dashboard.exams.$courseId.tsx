import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import useAddExamMcq, { type Mcq } from "@/querys/professor/useAddExamMcq";
import useAddExamRq from "@/querys/professor/useAddExamRq";
import useDeleteExam from "@/querys/professor/useDeleteExam";
import useDeleteExamMcq from "@/querys/professor/useDeleteExamMcq";
import useDeleteExamRq from "@/querys/professor/useDeleteExamRq";
import useExams, { type Exam } from "@/querys/professor/useExams";
import useInitExam from "@/querys/professor/useInitExam";
import useUpdateExam from "@/querys/professor/useUpdateExam";
import useUpdateExamMcq from "@/querys/professor/useUpdateExamMcq";
import useUpdateExamRq from "@/querys/professor/useUpdateExamRq";
import * as yup from "yup";
import {
  IconCheck,
  IconChevronDown,
  IconInfoCircle,
  IconLayoutDashboard,
  IconOption,
  IconPencil,
  IconPlus,
  IconQuestionMark,
  IconStar,
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
  DialogTitle,
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

// Extracted reusable dialog
function AddMcqDialog({ examId }: { examId: string }) {
  const { mutate: addExamMcq, isPending: isAddingMcq } = useAddExamMcq();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4">
          <IconPlus size={16} className="mr-1" />
          Add MCQ Question
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogTitle>Add an MCQ Question</DialogTitle>

        <Formik
          initialValues={{
            questionText: "",
            options: "",
            correctOptions: "",
            questionMark: "",
            explanation: "",
            attachments: [] as File[],
          }}
          onSubmit={(values, { resetForm }) => {
            addExamMcq(
              {
                formData: {
                  questionText: values.questionText,
                  options: values.options,
                  correctOptions: values.correctOptions,
                  questionMark: values.questionMark,
                  explanation: values.explanation || undefined,
                  attachments:
                    values.attachments.length > 0
                      ? values.attachments
                      : undefined,
                },
                params: { examId },
              },
              { onSuccess: () => resetForm() },
            );
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4">
              <FormikInput
                label="Question text"
                name="questionText"
                placeholder="e.g. What is the capital of France?"
                icon={<IconQuestionMark />}
              />
              <FormikInput
                label="Options (comma-separated)"
                name="options"
                placeholder="e.g. Paris, London, Berlin"
                icon={<IconOption />}
              />
              <FormikInput
                label="Correct option"
                name="correctOptions"
                placeholder="e.g. Paris"
                icon={<IconCheck />}
              />
              <FormikInput
                label="Points"
                name="questionMark"
                type="number"
                placeholder="e.g. 5"
                icon={<IconStar />}
              />
              <FormikInput
                label="Explanation (optional)"
                name="explanation"
                placeholder="Brief explanation..."
                icon={<IconInfoCircle />}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium pl-1">
                  Attachments (optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  onChange={(e) =>
                    setFieldValue(
                      "attachments",
                      Array.from(e.currentTarget.files ?? []),
                    )
                  }
                />
              </div>

              <Button type="submit" className="w-full" disabled={isAddingMcq}>
                {isAddingMcq ? "Adding…" : "Add Question"}
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

function UpdateMcqDialog({ mcq }: { mcq: Mcq & { id: string } }) {
  const { mutate: updateMcq, isPending: isUpdating } = useUpdateExamMcq();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <IconPencil size={16} className="text-emerald-400" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogTitle>Update MCQ Question</DialogTitle>

        <Formik
          initialValues={{
            questionText: mcq.questionText,
            options: mcq.options,
            correctOptions: mcq.correctOptions,
            questionMark: mcq.questionMark,
            explanation: mcq.explanation ?? "",
            attachments: [] as File[],
          }}
          onSubmit={(values, { resetForm }) => {
            updateMcq(
              {
                id: mcq.id,
                formData: {
                  id: mcq.id,
                  questionText: values.questionText,
                  options: values.options,
                  correctOptions: values.correctOptions,
                  questionMark: values.questionMark,
                  explanation: values.explanation || undefined,
                  attachments:
                    values.attachments.length > 0
                      ? values.attachments
                      : undefined,
                },
              },
              { onSuccess: () => resetForm() },
            );
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4">
              <FormikInput
                label="Question text"
                name="questionText"
                icon={<IconQuestionMark />}
              />
              <FormikInput
                label="Options (comma-separated)"
                name="options"
                icon={<IconOption />}
              />
              <FormikInput
                label="Correct option"
                name="correctOptions"
                icon={<IconCheck />}
              />
              <FormikInput
                label="Points"
                name="questionMark"
                type="number"
                icon={<IconStar />}
              />
              <FormikInput
                label="Explanation (optional)"
                name="explanation"
                icon={<IconInfoCircle />}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium pl-1">
                  Attachments (optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  onChange={(e) =>
                    setFieldValue(
                      "attachments",
                      Array.from(e.currentTarget.files ?? []),
                    )
                  }
                />
              </div>

              <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? "Updating…" : "Update Question"}
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

// Updated McqItem — add UpdateMcqDialog next to the delete button
function McqItem({ mcq }: { mcq: Mcq & { id: string }; examId: string }) {
  const { mutate: deleteMcq } = useDeleteExamMcq();

  return (
    <div className="border rounded-lg p-4 flex justify-between items-center gap-4">
      <div className="flex-1 space-y-1">
        <p className="font-medium">{mcq.questionText}</p>
        <p className="text-sm text-muted-foreground">Options: {mcq.options}</p>
        <p className="text-sm text-emerald-500">
          Correct: {mcq.correctOptions}
        </p>
        {mcq.explanation && (
          <p className="text-xs text-muted-foreground italic">
            {mcq.explanation}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge className="bg-amber-600">{mcq.questionMark} pts</Badge>
        <UpdateMcqDialog mcq={mcq} /> {/* ← added */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <IconTrash size={16} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>
              Are you sure you want to delete "{mcq.questionText}"?
            </AlertDialogTitle>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => deleteMcq(mcq.id)}
              >
                Yes, delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

// Updated ExamItem
function ExamItem({ exam }: { exam: Exam }) {
  const [type, setType] = React.useState<"mcq" | "rq">("mcq");

  const mcqs = exam.mcqs ?? [];
  const rqs = exam.redactionQuestions ?? [];

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
        {/* Tab switcher */}
        <div className="flex w-full overflow-hidden rounded-lg border">
          <Button
            type="button"
            className="flex-1"
            variant={type === "mcq" ? "outline" : "ghost"}
            onClick={() => setType("mcq")}
          >
            Multiple choise questions
          </Button>
          <Button
            type="button"
            className="flex-1"
            variant={type === "rq" ? "outline" : "ghost"}
            onClick={() => setType("rq")}
          >
            Redaction questions
          </Button>
        </div>

        {type === "mcq" ? (
          mcqs.length === 0 ? (
            // Empty state
            <div className="text-center py-16 border rounded-xl">
              <IconLayoutDashboard size={40} className="mx-auto mb-4" />
              <h2>No MCQ questions created</h2>
              <AddMcqDialog examId={exam.id} />
            </div>
          ) : (
            // MCQ list
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {mcqs.length} question{mcqs.length !== 1 && "s"}
                </p>
                <AddMcqDialog examId={exam.id} />
              </div>

              {mcqs.map((mcq) => (
                <McqItem key={mcq.questionText} mcq={mcq} examId={exam.id} />
              ))}
            </div>
          )
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
  console.log(exams);
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
