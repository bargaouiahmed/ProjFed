import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import UniAdminDashboardSideBar from "@/components/uni_admin/UniAdminDashboardSideBar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/administration/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
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
