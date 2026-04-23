import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IconBook,
  IconUser,
  IconArrowRight,
  IconLayoutDashboard,
  IconCalendar,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useCourses from "@/querys/student/useCourses";

export const Route = createFileRoute("/student/dashboard/courses")({
  component: StudentCourses,
});

function StudentCourses() {
  const { data: courses, isLoading } = useCourses();
  console.log(courses);
  if (isLoading) {
    return (
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <div className="space-y-3">
          <div className="h-10 w-48 animate-pulse rounded-md bg-muted/60" />
          <div className="h-4 w-72 animate-pulse rounded-md bg-muted/60" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border/60 p-6 space-y-4"
            >
              <div className="h-4 w-20 animate-pulse rounded bg-muted/60" />
              <div className="h-6 w-full animate-pulse rounded bg-muted/60" />
              <div className="h-10 w-full animate-pulse rounded-md bg-muted/60 pt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <IconLayoutDashboard className="text-primary" size={20} />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Student Space
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Courses
          </h1>
        </div>
        <Badge
          variant="secondary"
          className="px-4 py-1.5 rounded-full border-border/50"
        >
          {courses?.length || 0} Enrolled Courses
        </Badge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Card
            key={course.id}
            className="group flex flex-col transition-all hover:border-primary/40 hover:shadow-lg bg-card/40 backdrop-blur-md border-border/60"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  Term {course.term}
                </Badge>
              </div>
              <CardTitle className="line-clamp-1 text-xl group-hover:text-primary transition-colors">
                {course.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 h-10">
                {course.description || "No description provided."}
              </CardDescription>
            </CardHeader>

            <CardContent className="mt-auto space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconUser size={16} className="shrink-0" />
                <span className="truncate">
                  Prof. {course.professorFirstname} {course.professorLastname}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <IconBook size={14} />
                  <span>{course.chapters.length} Chapters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IconCalendar size={14} />
                  <span>
                    {course.exams.length + course.tests.length} Assessments
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <Button asChild className="w-full group/btn shadow-md">
                <Link
                  to="/student/dashboard/$courseId"
                  params={{ courseId: course.id }}
                >
                  View Course
                  <IconArrowRight
                    size={16}
                    className="ml-2 transition-transform group-hover/btn:translate-x-1"
                  />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        {courses?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-2xl bg-muted/20">
            <IconBook
              size={48}
              className="text-muted-foreground mb-4 opacity-20"
            />
            <p className="text-muted-foreground font-medium">
              No courses found
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Join a class to see your courses here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
