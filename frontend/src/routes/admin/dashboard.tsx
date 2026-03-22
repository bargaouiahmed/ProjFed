import AdminDashboardSideBar from "@/components/admin/admin-dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AdminDashboardSideBar />
      <main>
        <SidebarTrigger />
      </main>
    </SidebarProvider>
  );
}
