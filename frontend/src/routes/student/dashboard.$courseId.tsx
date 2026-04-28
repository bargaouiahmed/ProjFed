import { createFileRoute } from "@tanstack/react-router";
import {
  IconBook,
  IconFileText,
  IconClipboardList,
  IconArrowLeft,
  IconDownload,
  IconLoader2,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetStudentCourse from "@/querys/student/useGetStudentCourse";
import useDownloadChapters from "@/querys/useDownloadChapters";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/student/dashboard/$courseId")({
  component: CourseDetails,
});

function CourseDetails() {
  const { courseId } = Route.useParams();
  const { data: course, isLoading } = useGetStudentCourse(courseId);
  const { mutate: downloadAttachments, isPending: isDownloading } = useDownloadChapters();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <IconLoader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Course not found</h2>
        <Button asChild variant="ghost" className="mt-4">
          <Link to="/student/dashboard/courses">
            <IconArrowLeft size={16} className="mr-2" />
            Back to courses
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/student/dashboard/courses">
            <IconArrowLeft size={16} className="mr-2" />
            Back to courses
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-full">
                Term {course.term}
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                {course.id}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {course.name}
            </h1>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              {course.description || "No description provided for this course."}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-xl border border-border/50">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              {course.professorFirstname[0]}
              {course.professorLastname[0]}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Professor
              </p>
              <p className="font-bold">
                {course.professorFirstname} {course.professorLastname}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="chapters" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="chapters" className="gap-2">
            <IconBook size={18} />
            Chapters
          </TabsTrigger>
          <TabsTrigger value="exams" className="gap-2">
            <IconFileText size={18} />
            Exams
          </TabsTrigger>
          <TabsTrigger value="tests" className="gap-2">
            <IconClipboardList size={18} />
            Tests
          </TabsTrigger>
        </TabsList>

        {/* Chapters Content */}
        <TabsContent value="chapters" className="space-y-4">
          {course.chapters.length === 0 ? (
            <EmptyState icon={<IconBook size={40} />} message="No chapters available yet." />
          ) : (
            <div className="grid gap-4">
              {course.chapters.map((chapter, index) => (
                <Card key={chapter.id} className="border-border/60 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center p-5 gap-4">
                    <div className="bg-muted w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-bold">{chapter.title || "Untitled Chapter"}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {chapter.description}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 shrink-0"
                      onClick={() => downloadAttachments(chapter.id)}
                      disabled={isDownloading}
                    >
                      <IconDownload size={16} />
                      Download Materials
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Exams Content */}
        <TabsContent value="exams" className="space-y-4">
          {course.exams.length === 0 ? (
            <EmptyState icon={<IconFileText size={40} />} message="No exams scheduled." />
          ) : (
            <div className="grid gap-4">
              {course.exams.map((exam) => (
                <AssessmentCard key={exam.id} assessment={exam} type="exam" courseId={course.id} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tests Content */}
        <TabsContent value="tests" className="space-y-4">
          {course.tests.length === 0 ? (
            <EmptyState icon={<IconClipboardList size={40} />} message="No tests available." />
          ) : (
            <div className="grid gap-4">
              {course.tests.map((test) => (
                <AssessmentCard key={test.id} assessment={test} type="test" courseId={course.id} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AssessmentCard({ assessment, type, courseId }: { assessment: any; type: 'exam' | 'test', courseId: string }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="p-5 flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold">{assessment.title}</CardTitle>
          <CardDescription className="line-clamp-1">{assessment.description}</CardDescription>
        </div>
        <div className="text-right shrink-0">
          <Badge className="bg-amber-600/10 text-amber-600 hover:bg-amber-600/20 border-amber-600/20">
            {assessment.totalMarks} Marks
          </Badge>
          <p className="text-[10px] text-muted-foreground mt-1 font-mono uppercase">
            {assessment.mcqs?.length || 0} MCQ • {assessment.redactionQuestions?.length || 0} RQ
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        <Button asChild className="w-full">
          <Link 
            to={`/student/dashboard/assessment/$type/$assessmentId`} 
            params={{ type, assessmentId: assessment.id }}
            search={{ courseId }}
          >
            Take {type}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-muted/10">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 opacity-40">
        {icon}
      </div>
      <p className="text-muted-foreground font-medium">{message}</p>
    </div>
  );
}
