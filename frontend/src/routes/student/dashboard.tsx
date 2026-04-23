import StudentDashboardSidebar from "@/components/student/StudentDashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import useAccount from "@/querys/useAccount";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/student/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { data: account, isPending } = useAccount();

  useEffect(() => {
    if (!isPending && !account) {
      navigate({ to: "/auth" });
    }
    if (account && account.role !== "student") {
      navigate({ to: "/" });
    }
  }, [account, isPending, navigate]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <StudentDashboardSidebar />
      <div className="flex-1 overflow-auto">
        <SidebarTrigger className="m-4" />
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
