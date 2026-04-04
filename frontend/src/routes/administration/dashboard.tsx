import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import UniAdminDashboardSideBar from "@/components/uni_admin/UniAdminDashboardSideBar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/administration/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <UniAdminDashboardSideBar />
        <div>
          <SidebarTrigger />
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
