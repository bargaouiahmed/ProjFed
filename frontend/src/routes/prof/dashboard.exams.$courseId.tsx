import useAddExamMcq from "@/querys/professor/useAddExamMcq";
import useAddExamRq from "@/querys/professor/useAddExamRq";
import useDeleteExam from "@/querys/professor/useDeleteExam";
import useDeleteExamMcq from "@/querys/professor/useDeleteExamMcq";
import useDeleteExamRq from "@/querys/professor/useDeleteExamRq";
import useExams from "@/querys/professor/useExams";
import useInitExam from "@/querys/professor/useInitExam";
import useUpdateExam from "@/querys/professor/useUpdateExam";
import useUpdateExamMcq from "@/querys/professor/useUpdateExamMcq";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/prof/dashboard/exams/$courseId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseId } = Route.useParams();
  const { data: exams, isLoading: isLoadingExams } = useExams(courseId);
  const { mutate: initExam, isPending: isInitExam } = useInitExam();
  const { mutate: deleteExam } = useDeleteExam();
  const { mutate: addMcq } = useAddExamMcq();
  const { mutate: updateMcq } = useUpdateExamMcq();
  const { mutate: deleteMcq } = useDeleteExamMcq();
  const { mutate: addRq } = useAddExamRq();
  const { mutate: deleteRq } = useDeleteExamRq();
  const { mutate: updateExam } = useUpdateExam();
  return <div>Hello "/prof/dashboard/exams/$courseId"!</div>;
}
