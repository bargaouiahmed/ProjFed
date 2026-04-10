import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import UniAdminDashboardSideBar from "@/components/uni_admin/UniAdminDashboardSideBar";
import useAccount from "@/querys/useAccount";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/administration/dashboard")({
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
      <UniAdminDashboardSideBar />
      <div className="flex-1 ">
        <SidebarTrigger />
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
