import ThemeToggler from "@/components/ThemeToggler";
import { Button } from "@/components/ui/button";
import useAccount from "@/querys/useAccount";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

import imagesrclight from "@/assets/lightmodedashboard.png";
import imagersecDark from "@/assets/darkmodedashboard.png";
import { useTheme } from "@/components/theme-provider";

// Updated RouteComponent — full landing page
function RouteComponent() {
  const { data: account, isLoading: isLoadingAccount } = useAccount();

  const navigate = Route.useNavigate();
  const { theme } = useTheme();
  if (isLoadingAccount) return <div>loading...</div>;

  if (account && (account.role === "admin" || account.role === "super_admin")) {
    navigate({ to: "/admin/dashboard/requests" });
  }
  if (
    account &&
    (account.role === "uni_admin" || account.role === "staff_admin")
  ) {
    navigate({ to: "/administration/dashboard" });
  }
  if (account && account.role === "professor") {
    navigate({ to: "/prof/dashboard/invitations" });
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6 pt-16 pb-24 relative overflow-hidden">
      {/* Theme toggle — top right */}
      <div className="absolute top-6 right-6">
        <ThemeToggler />
      </div>

      {/* Hero text */}
      <section className="max-w-3xl w-full text-center flex flex-col items-center gap-6 mt-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Academic platform for universities
        </div>

        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight leading-[1.05]">
          Learning, <span className="text-primary">structured</span> for
          everyone.
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
          Professors build courses. Students learn. Administrators oversee. One
          platform — every role, every workflow, in one place.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <Link to="/auth">
            <Button size="lg" className="px-8 text-base font-semibold">
              Sign in
            </Button>
          </Link>
          <Link to="/uni/admin/register">
            <Button
              size="lg"
              variant="outline"
              className="px-8 text-base font-semibold"
            >
              Register your university
            </Button>
          </Link>
        </div>
      </section>

      {/* Dashboard placeholder image */}
      <div className="mt-16 w-full max-w-5xl rounded-2xl border bg-muted/40 overflow-hidden shadow-sm">
        <div className="w-full aspect-video flex items-center justify-center bg-muted/60 relative">
          {/* Fake browser chrome */}
          <div className="absolute top-0 left-0 right-0 h-9 bg-muted border-b flex items-center px-4 gap-2">
            <span className="w-3 h-3 rounded-full bg-destructive/60" />
            <span className="w-3 h-3 rounded-full bg-amber-400/60" />
            <span className="w-3 h-3 rounded-full bg-emerald-400/60" />
            <div className="mx-auto w-48 h-5 rounded bg-background/60 border text-xs flex items-center justify-center text-muted-foreground">
              app.university.edu
            </div>
          </div>
          <img src={theme == "dark" ? imagersecDark : imagesrclight} />
        </div>
      </div>

      {/* Actor explanation cards */}
      <section className="mt-24 max-w-5xl w-full">
        <h2 className="text-center text-3xl font-extrabold mb-10">
          Built for every role
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Professor */}
          <div className="rounded-2xl border p-6 flex flex-col gap-3 hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              P
            </div>
            <h3 className="font-bold text-lg">Professors</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create and manage courses, build exams and tests with MCQ and
              redaction questions, upload materials, and grade student responses
              — all in one place.
            </p>
          </div>

          {/* Student */}
          <div className="rounded-2xl border p-6 flex flex-col gap-3 hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-lg">
              S
            </div>
            <h3 className="font-bold text-lg">Students</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Join classes with a code, access your current term's courses, take
              exams and tests, view your grades, and track your academic
              progress over time.
            </p>
          </div>

          {/* Administration */}
          <div className="rounded-2xl border p-6 flex flex-col gap-3 hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-lg">
              A
            </div>
            <h3 className="font-bold text-lg">Administrators</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Register your university, manage professors and student classes,
              oversee the academic structure, and keep the platform running
              smoothly for your institution.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
