import ProfDashboardSidebar from "@/components/proffesor/ProfDashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import useAccount from "@/querys/useAccount";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/prof/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { data: account, isPending } = useAccount();
  if (!isPending && !account) {
    navigate({ to: "/auth" });
  }
  if (account?.role == "student") {
    navigate({ to: "/" });
  }
  return (
    <SidebarProvider>
      <ProfDashboardSidebar />
      <div className="flex-1 ">
        <SidebarTrigger />
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
