import AdminDashboardSideBar from "@/components/admin/admin-dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AdminDashboardSideBar />
      <main className="flex-1 min-h-screen ">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
