import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import UniAdminDashboardSideBar from "@/components/uni_admin/UniAdminDashboardSideBar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/administration/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <main className="flex-1 min-h-screen ">
        <UniAdminDashboardSideBar />
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
