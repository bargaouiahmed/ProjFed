import AdminDashboardSideBar from "@/components/admin/admin-dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import useAccount from "@/querys/useAccount";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { data: account } = useAccount();
  if (account?.role != "super_admin") {
    return navigate({ to: "/" });
  }
  return (
    <SidebarProvider>
      <AdminDashboardSideBar />
      <main className="flex-1 min-h-screen">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
