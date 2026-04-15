import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IconBook,
  IconUsers,
  IconArrowRight,
  IconLayoutDashboard,
} from "@tabler/icons-react";

// Shadcn Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Hooks
import useProfCourses from "@/querys/professor/useProfCourses";

export const Route = createFileRoute("/prof/dashboard/courses")({
  component: CoursesDashboard,
});

function CoursesDashboard() {
  const { data, isLoading } = useProfCourses();

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
              Professor Space
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
          {data?.totalCount || 0} Assigned Courses
        </Badge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.courses.map((course) => (
          <Card
            key={course.id}
            className="group flex flex-col transition-all hover:border-primary/40 hover:shadow-lg bg-card/40 backdrop-blur-md border-border/60 relative"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  {course.term}
                </Badge>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {course.uniClassId}
                </span>
              </div>
              <CardTitle className="line-clamp-1 text-xl group-hover:text-primary transition-colors">
                {course.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 h-10 italic">
                {course.description ||
                  "No description provided for this module."}
              </CardDescription>
            </CardHeader>

            <CardContent className="mt-auto space-y-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground border-t border-border/40 pt-4">
                <div className="flex items-center gap-1.5">
                  <IconBook size={16} />
                  <span>Curriculum</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IconUsers size={16} />
                  <span>Students</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-dashed hover:border-primary hover:bg-primary/5"
                >
                  tests and exams
                </Button>

                {/* NAVIGATION TO COURSE DETAIL */}

                <Button asChild size="sm" className="group/btn shadow-md">
                  <Link
                    to={`/prof/dashboard/$courseId`}
                    params={{
                      courseId: course.id,
                    }}
                  >
                    Chapters
                    <IconArrowRight
                      size={16}
                      className="ml-2 transition-transform group-hover/btn:translate-x-1"
                    />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
