import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import useAddTestMcq from "@/querys/professor/useAddTestMcq";
import useAddTestRq from "@/querys/professor/useAddTestRq";
import useDeleteTest from "@/querys/professor/useDeleteTest";
import useDeleteTestMcq from "@/querys/professor/useDeleteTestMcq";
import useDeleteTestRq from "@/querys/professor/useDeleteTestRq";
import useTests from "@/querys/professor/useTests";
import type { Exam as Test } from "@/querys/professor/useExams";
import type { Mcq } from "@/querys/professor/useAddExamMcq";
import type { Rq } from "@/querys/professor/useAddExamRq";
import useInitTest from "@/querys/professor/useInitTest";
import useUpdateTest from "@/querys/professor/useUpdateTest";
import useUpdateTestMcq from "@/querys/professor/useUpdateTestMcq";
import useUpdateTestRq from "@/querys/professor/useUpdateTestRq";
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

export const Route = createFileRoute("/prof/dashboard/tests/$courseId")({
  component: RouteComponent,
});

function Header({ courseId, count }: { courseId: string; count?: number }) {
  const { mutate: initTest } = useInitTest();

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
          <h1 className="text-3xl font-extrabold">Manage Tests</h1>
          <Badge className="px-3 py-1 bg-primary/10 text-primary">
            {count || 0} Total
          </Badge>
        </div>
      </header>

      <Button onClick={() => initTest(courseId)} className="gap-2">
        <IconPlus size={18} />
        Initialize New Test
      </Button>
    </section>
  );
}

function DeleteDialog({ test }: { test: Test }) {
  const { mutate: deleteTest } = useDeleteTest();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <IconTrash size={18} className="text-destructive" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogTitle>
          Are you sure you want to delete this test?
        </AlertDialogTitle>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteTest(test.id)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function UpdateTestDialog({ test }: { test: Test }) {
  const { mutate: updateTest } = useUpdateTest();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <IconPencil size={18} className="text-emerald-400" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>{test.title}</DialogHeader>
        <DialogDescription>Update test</DialogDescription>

        <Formik
          initialValues={{
            id: test.id,
            title: test.title,
            description: test.description,
            totalMarks: test.totalMarks,
          }}
          validationSchema={yup.object({
            id: yup.string().required(),
          })}
          onSubmit={(values) => updateTest(values)}
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

function AddMcqDialog({ testId }: { testId: string }) {
  const { mutate: addTestMcq, isPending: isAddingMcq } = useAddTestMcq();

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
            addTestMcq(
              {
                formData: {
                  id: "", // generated by backend
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
                testId: testId,
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
  const { mutate: updateMcq, isPending: isUpdating } = useUpdateTestMcq();

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

function McqItem({ mcq }: { mcq: Mcq & { id: string }; testId: string }) {
  const { mutate: deleteMcq } = useDeleteTestMcq();

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
        <UpdateMcqDialog mcq={mcq} />
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

function AddRqDialog({ testId }: { testId: string }) {
  const { mutate: addTestRq, isPending: isAdding } = useAddTestRq();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <IconPlus size={16} className="mr-1" />
          Add Redaction Question
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogTitle>Add a Redaction Question</DialogTitle>

        <Formik
          initialValues={{
            questionText: "",
            questionMark: "",
            attachments: [] as File[],
          }}
          onSubmit={(values, { resetForm }) => {
            addTestRq(
              {
                testId: testId,
                rq: {
                  questionText: values.questionText,
                  questionMark: Number(values.questionMark),
                  attachments: values.attachments,
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
                placeholder="e.g. Describe the water cycle."
                icon={<IconQuestionMark />}
              />
              <FormikInput
                label="Points"
                name="questionMark"
                type="number"
                placeholder="e.g. 10"
                icon={<IconStar />}
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

              <Button type="submit" className="w-full" disabled={isAdding}>
                {isAdding ? "Adding…" : "Add Question"}
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

function UpdateRqDialog({ rq }: { rq: Rq }) {
  const { mutate: updateRq, isPending: isUpdating } = useUpdateTestRq();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <IconPencil size={16} className="text-emerald-400" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogTitle>Update Redaction Question</DialogTitle>

        <Formik
          initialValues={{
            questionText: rq.questionText,
            questionMark: String(rq.questionMark),
            attachments: [] as File[],
          }}
          onSubmit={(values, { resetForm }) => {
            updateRq(
              {
                id: rq.id!,
                formData: {
                  questionText: values.questionText,
                  questionMark: Number(values.questionMark),
                  attachments: values.attachments,
                },
              },
              { onSuccess: () => resetForm() },
            );
          }}
        >
          {({ setFieldValue, values, handleChange }) => (
            <Form className="space-y-4">
              <div>
                <label>question text :</label>
                <Textarea
                  name="questionText"
                  onChange={handleChange}
                  value={values.questionText}
                ></Textarea>
              </div>
              <FormikInput
                label="Points"
                name="questionMark"
                type="number"
                icon={<IconStar />}
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

function RqItem({ rq }: { rq: Rq }) {
  const { mutate: deleteRq } = useDeleteTestRq();

  return (
    <div className="border rounded-lg p-4 flex justify-between items-center gap-4">
      <div className="flex-1 space-y-1">
        <p className="font-medium">{rq.questionText}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge className="bg-amber-600">{rq.questionMark} pts</Badge>

        <UpdateRqDialog rq={rq} />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <IconTrash size={16} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>
              Are you sure you want to delete "{rq.questionText}"?
            </AlertDialogTitle>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => deleteRq(rq.id!)}
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

function TestItem({ test }: { test: Test }) {
  const [type, setType] = React.useState<"mcq" | "rq">("mcq");

  const mcqs = test.mcqs ?? [];
  const rqs = test.redactionQuestions ?? [];

  return (
    <Collapsible className="border rounded-xl">
      <section className="p-5 flex justify-between items-center">
        <div>
          <h3 className="font-bold">{test.title}</h3>
          <p className="text-sm text-muted-foreground">{test.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-amber-600">{test.totalMarks} Marks</Badge>
          <UpdateTestDialog test={test} />
          <DeleteDialog test={test} />

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
            className="flex-1"
            variant={type === "mcq" ? "outline" : "ghost"}
            onClick={() => setType("mcq")}
          >
            Multiple choice questions
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
            <div className="text-center py-16 border rounded-xl">
              <IconLayoutDashboard size={40} className="mx-auto mb-4" />
              <h2>No MCQ questions created</h2>
              <AddMcqDialog testId={test.id} />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {mcqs.length} question{mcqs.length !== 1 && "s"}
                </p>
                <AddMcqDialog testId={test.id} />
              </div>

              {mcqs.map((mcq) => (
                <McqItem key={mcq.id} mcq={mcq} testId={test.id} />
              ))}
            </div>
          )
        ) : rqs.length === 0 ? (
          <div className="text-center py-16 border rounded-xl">
            <IconLayoutDashboard size={40} className="mx-auto mb-4" />
            <h2>No redaction questions created</h2>
            <AddRqDialog testId={test.id} />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {rqs.length} question{rqs.length !== 1 && "s"}
              </p>
              <AddRqDialog testId={test.id} />
            </div>

            {rqs.map((rq) => (
              <RqItem key={rq.id} rq={rq} />
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

function RouteComponent() {
  const { courseId } = Route.useParams();
  const { data: tests, isLoading } = useTests(courseId);

  if (isLoading) return <p>Loading...</p>;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <Header courseId={courseId} count={tests?.length} />

      <div className="grid gap-4">
        {!tests || tests.length === 0 ? (
          <div className="text-center py-16 border rounded-xl">
            <IconLayoutDashboard size={40} className="mx-auto mb-4" />
            <h2>No tests found</h2>
          </div>
        ) : (
          tests.map((test) => <TestItem key={test.id} test={test} />)
        )}
      </div>
    </main>
  );
}
