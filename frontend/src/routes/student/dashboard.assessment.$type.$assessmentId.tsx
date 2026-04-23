import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  IconArrowLeft,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconLoader2,
  IconSend,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { z } from "zod";

import useGetStudentExam from "@/querys/student/useGetStudentExam";
import useGetStudentTest from "@/querys/student/useGetStudentTest";
import useSubmitExamMcqResponse from "@/querys/student/useSubmitExamMcqResponse";
import useSubmitExamRqResponse from "@/querys/student/useSubmitExamRqResponse";
import useSubmitTestMcqResponse from "@/querys/student/useSubmitTestMcqResponse";
import useSubmitTestRqResponse from "@/querys/student/useSubmitTestRqResponse";

export const Route = createFileRoute(
  "/student/dashboard/assessment/$type/$assessmentId",
)({
  validateSearch: z.object({
    courseId: z.string(),
  }),
  component: AssessmentTaking,
});

function AssessmentTaking() {
  const { type, assessmentId } = Route.useParams();
  const { courseId } = Route.useSearch();
  const navigate = useNavigate();

  const isExam = type === "exam";

  const examQuery = useGetStudentExam(isExam ? assessmentId : "");
  const testQuery = useGetStudentTest(!isExam ? assessmentId : "");

  const assessment = isExam ? examQuery.data : testQuery.data;
  const isLoading = isExam ? examQuery.isLoading : testQuery.isLoading;

  const { mutate: submitExamMcq } = useSubmitExamMcqResponse();
  const { mutate: submitExamRq } = useSubmitExamRqResponse();
  const { mutate: submitTestMcq } = useSubmitTestMcqResponse();
  const { mutate: submitTestRq } = useSubmitTestRqResponse();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [rqAnswers, setRqAnswers] = useState<Record<string, string>>({});

  const allQuestions = assessment
    ? [
        ...(assessment.mcqs || []).map((q) => ({ ...q, type: "mcq" as const })),
        ...(assessment.redactionQuestions || []).map((q) => ({
          ...q,
          type: "rq" as const,
        })),
      ]
    : [];

  const totalQuestions = allQuestions.length;
  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress =
    totalQuestions > 0
      ? ((currentQuestionIndex + 1) / totalQuestions) * 100
      : 0;

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitCurrentAnswer = () => {
    if (!currentQuestion) return;

    if (currentQuestion.type === "mcq") {
      const selectedOption = mcqAnswers[currentQuestion.id];
      if (selectedOption === undefined) return;

      const payload = {
        questionId: currentQuestion.id,
        selectedOptionIndex: selectedOption,
      };
      if (isExam) submitExamMcq(payload);
      else submitTestMcq(payload);
    } else {
      const answerText = rqAnswers[currentQuestion.id];
      if (!answerText) return;

      const payload = { questionId: currentQuestion.id, answerText };
      if (isExam) submitExamRq(payload);
      else submitTestRq(payload);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <IconLoader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground font-medium">
          Loading assessment...
        </p>
      </div>
    );
  }

  if (!assessment || totalQuestions === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 p-6 text-center">
        <IconAlertCircle className="text-destructive" size={64} />
        <h2 className="text-2xl font-bold">No questions found</h2>
        <p className="text-muted-foreground max-w-md">
          This assessment might be empty or unavailable. Please contact your
          professor.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/student/dashboard/$courseId" params={{ courseId }}>
            Back to Course
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link to="/student/dashboard/$courseId" params={{ courseId }}>
              <IconArrowLeft size={16} className="mr-2" />
              Exit Assessment
            </Link>
          </Button>
          <Badge className="capitalize px-4 py-1">
            {type}: {assessment.title}
          </Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <Badge variant="secondary" className="mb-2">
                  {currentQuestion.type === "mcq"
                    ? "Multiple Choice"
                    : "Redaction"}
                </Badge>
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.questionText}
                </CardTitle>
              </div>
              <Badge variant="outline" className="shrink-0 font-mono">
                {currentQuestion.questionMark} Pts
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 min-h-50">
            {currentQuestion.type === "mcq" ? (
              <RadioGroup
                value={mcqAnswers[currentQuestion.id]?.toString()}
                onValueChange={(val) =>
                  setMcqAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.id]: parseInt(val),
                  }))
                }
                className="space-y-3"
              >
                {(currentQuestion.options as string)
                  .split(",")
                  .map((option, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                        mcqAnswers[currentQuestion.id] === idx
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:bg-muted/50"
                      }`}
                      onClick={() =>
                        setMcqAnswers((prev) => ({
                          ...prev,
                          [currentQuestion.id]: idx,
                        }))
                      }
                    >
                      <RadioGroupItem
                        value={idx.toString()}
                        id={`option-${idx}`}
                      />
                      <Label
                        htmlFor={`option-${idx}`}
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {option.trim()}
                      </Label>
                    </div>
                  ))}
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                <Label className="text-muted-foreground">Your Answer:</Label>
                <Textarea
                  placeholder="Type your answer here..."
                  className="min-h-37 resize-none focus-visible:ring-primary"
                  value={rqAnswers[currentQuestion.id] || ""}
                  onChange={(e) =>
                    setRqAnswers((prev) => ({
                      ...prev,
                      [currentQuestion.id]: e.target.value,
                    }))
                  }
                />
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between p-6 bg-muted/20 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="gap-2"
            >
              <IconChevronLeft size={18} />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={submitCurrentAnswer}
                className="gap-2"
              >
                <IconSend size={18} />
                Save Answer
              </Button>

              {currentQuestionIndex === totalQuestions - 1 ? (
                <Button
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() =>
                    navigate({ to: `/student/dashboard/${courseId}` })
                  }
                >
                  <IconCheck size={18} />
                  Finish
                </Button>
              ) : (
                <Button onClick={handleNext} className="gap-2">
                  Next
                  <IconChevronRight size={18} />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Question Navigator (Dot grid) */}
        <div className="flex flex-wrap justify-center gap-2 p-4 bg-card rounded-2xl border">
          {allQuestions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                currentQuestionIndex === idx
                  ? "bg-primary text-primary-foreground scale-110 shadow-md"
                  : mcqAnswers[q.id] !== undefined || rqAnswers[q.id]
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
