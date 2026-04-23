import { createFileRoute } from "@tanstack/react-router";
import {
  IconUsers,
  IconTrophy,
  IconChartBar,
  IconChevronRight,
  IconSearch,
  IconDownload,
  IconPencil,
} from "@tabler/icons-react";
import { useState } from "react";

// Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

// Hooks
import useGetCourseGrades, {
  type StudentGradeSummary,
} from "@/querys/professor/useGetCourseGrades";
import useGradeExamMcq from "@/querys/professor/useGradeExamMcq";
import useGradeExamRq from "@/querys/professor/useGradeExamRq";
import useGradeTestMcq from "@/querys/professor/useGradeTestMcq";
import useGradeTestRq from "@/querys/professor/useGradeTestRq";
import { Form, Formik } from "formik";
import { FormikInput } from "@/components/form/formikInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/prof/dashboard/grades/$courseId")({
  component: GradesDashboard,
});

function ManualGradeDialog() {
  const { mutate: gradeExamMcq } = useGradeExamMcq();
  const { mutate: gradeExamRq } = useGradeExamRq();
  const { mutate: gradeTestMcq } = useGradeTestMcq();
  const { mutate: gradeTestRq } = useGradeTestRq();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <IconPencil size={18} />
          Manual Grade
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Grading</DialogTitle>
          <DialogDescription>
            Directly grade a response using its ID. Use this for specific
            corrections.
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={{
            type: "exam-rq",
            responseId: "",
            score: 0,
          }}
          onSubmit={(values) => {
            const payload = {
              responseId: values.responseId,
              score: values.score,
            };
            if (values.type === "exam-mcq") gradeExamMcq(payload);
            else if (values.type === "exam-rq") gradeExamRq(payload);
            else if (values.type === "test-mcq") gradeTestMcq(payload);
            else if (values.type === "test-rq") gradeTestRq(payload);
          }}
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Response Type</label>
                <Select
                  onValueChange={(v) => setFieldValue("type", v)}
                  defaultValue={values.type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exam-mcq">Exam MCQ</SelectItem>
                    <SelectItem value="exam-rq">Exam Redaction</SelectItem>
                    <SelectItem value="test-mcq">Test MCQ</SelectItem>
                    <SelectItem value="test-rq">Test Redaction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <FormikInput
                name="responseId"
                label="Response ID (GUID)"
                placeholder="Enter the GUID..."
              />
              <FormikInput name="score" label="Score" type="number" />
              <Button type="submit" className="w-full">
                Submit Grade
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

function GradesDashboard() {
  const { courseId } = Route.useParams();
  const { data: students, isLoading } = useGetCourseGrades(courseId);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<StudentGradeSummary | null>(null);

  const filteredStudents = students?.filter((s) =>
    `${s.firstname} ${s.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );
  console.log(students);
  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 w-48 animate-pulse bg-muted rounded" />
        <div className="h-64 w-full animate-pulse bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <IconTrophy className="text-primary" size={20} />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Performance Tracking
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Students & Grades
          </h1>
        </div>
        <div className="flex gap-2">
          <ManualGradeDialog />
          <Button variant="outline" className="gap-2">
            <IconDownload size={18} />
            Export CSV
          </Button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Exam Score</CardDescription>
            <CardTitle className="text-2xl">
              {students && students.length > 0
                ? (
                    students.reduce(
                      (acc, s) => acc + Number(s.overallExamScoreOn20),
                      0,
                    ) / students.length
                  ).toFixed(2)
                : "0.00"}
              /20
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={
                students && students.length > 0
                  ? (students.reduce(
                      (acc, s) => acc + Number(s.overallExamScoreOn20),
                      0,
                    ) /
                      students.length) *
                    5
                  : 0
              }
              className="h-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Test Score</CardDescription>
            <CardTitle className="text-2xl">
              {students && students.length > 0
                ? (
                    students.reduce(
                      (acc, s) => acc + Number(s.overallTestScoreOn20),
                      0,
                    ) / students.length
                  ).toFixed(2)
                : "0.00"}
              /20
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={
                students && students.length > 0
                  ? (students.reduce(
                      (acc, s) => acc + Number(s.overallTestScoreOn20),
                      0,
                    ) /
                      students.length) *
                    5
                  : 0
              }
              className="h-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Students</CardDescription>
            <CardTitle className="text-2xl">{students?.length || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconUsers size={16} />
              Enrolled in course
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Area */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 max-w-sm">
          <div className="relative flex-1">
            <IconSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Search students..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-xl border bg-card/40 backdrop-blur-md shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Student</TableHead>
                <TableHead className="text-center">
                  Overall Exam (/20)
                </TableHead>
                <TableHead className="text-center">
                  Overall Test (/20)
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents?.map((student) => (
                <TableRow
                  key={student.studentId}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {student.firstname[0]}
                        {student.lastname[0]}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {student.firstname} {student.lastname}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {student.studentId.split("-")[0]}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        Number(student.overallExamScoreOn20) >= 10
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {student.overallExamScoreOn20}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        Number(student.overallTestScoreOn20) >= 10
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {student.overallTestScoreOn20}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground"
                      onClick={() => setSelectedStudent(student)}
                    >
                      View Details
                      <IconChevronRight size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStudents?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-muted-foreground italic"
                  >
                    No students found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Student Details Dialog */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={(open) => !open && setSelectedStudent(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 border-b">
            <DialogTitle className="text-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xl">
                {selectedStudent?.firstname[0]}
                {selectedStudent?.lastname[0]}
              </div>
              {selectedStudent?.firstname} {selectedStudent?.lastname}
            </DialogTitle>
            <DialogDescription>
              Detailed grade breakdown for {selectedStudent?.firstname}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-8">
              {/* Exams Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <IconChartBar className="text-primary" size={20} />
                  <h3 className="font-bold uppercase tracking-wider text-sm">
                    Exam Grades
                  </h3>
                </div>
                <div className="grid gap-3">
                  {selectedStudent?.examGrades.map((grade) => (
                    <div
                      key={grade.assessmentId}
                      className="flex justify-between items-center p-4 rounded-lg bg-muted/40 border"
                    >
                      <div>
                        <div className="font-medium">{grade.title}</div>
                        <div className="text-xs text-muted-foreground uppercase">
                          {grade.assessmentType}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {grade.score} / {grade.totalMarks}
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {grade.normalizedScoreOn20}/20
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {selectedStudent?.examGrades.length === 0 && (
                    <p className="text-sm text-muted-foreground italic pl-2">
                      No exams recorded.
                    </p>
                  )}
                </div>
              </section>

              {/* Tests Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <IconChartBar className="text-primary" size={20} />
                  <h3 className="font-bold uppercase tracking-wider text-sm">
                    Test Grades
                  </h3>
                </div>
                <div className="grid gap-3">
                  {selectedStudent?.testGrades.map((grade) => (
                    <div
                      key={grade.assessmentId}
                      className="flex justify-between items-center p-4 rounded-lg bg-muted/40 border"
                    >
                      <div>
                        <div className="font-medium">{grade.title}</div>
                        <div className="text-xs text-muted-foreground uppercase">
                          {grade.assessmentType}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {grade.score} / {grade.totalMarks}
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {grade.normalizedScoreOn20}/20
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {selectedStudent?.testGrades.length === 0 && (
                    <p className="text-sm text-muted-foreground italic pl-2">
                      No tests recorded.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-muted/20 flex justify-end">
            <Button
              variant="secondary"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
