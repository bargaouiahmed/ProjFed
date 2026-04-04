import { Button } from "@/components/ui/button";
import logout from "@/querys/logout";
import useAccount from "@/querys/useAccount";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IconBuilding,
  IconClipboardList,
  IconLogout,
  IconUserCheck,
} from "@tabler/icons-react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: account } = useAccount();
  const navigate = Route.useNavigate();
  return (
    <main className="min-h-screen flex items-center ">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {account?.firstname}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Access your university management dashboard
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Staff/Admin Dashboard */}
          <Link
            to="/administration/dashboard/classes"
            search={{ pageNumber: 1, pageSize: 10 }}
            className="block"
          >
            <div className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center border border-border hover:border-primary">
              <IconBuilding className="mx-auto mb-4 text-primary" size={48} />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Staff/Admin Dashboard
              </h3>
              <p className="text-muted-foreground">
                Manage classes, staff, and institute settings
              </p>
            </div>
          </Link>

          {/* University Admin Requests */}
          <Link to="/admin/dashboard/requests" className="block">
            <div className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center border border-border hover:border-primary">
              <IconClipboardList
                className="mx-auto mb-4 text-primary"
                size={48}
              />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Admin Requests
              </h3>
              <p className="text-muted-foreground">
                Review and approve university admin applications
              </p>
            </div>
          </Link>

          {/* Register as University Admin */}
          <Link to="/uni/admin/register" className="block">
            <div className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center border border-border hover:border-primary">
              <IconUserCheck className="mx-auto mb-4 text-primary" size={48} />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Register as Admin
              </h3>
              <p className="text-muted-foreground">
                Apply for university administrator privileges
              </p>
            </div>
          </Link>
        </div>

        {/* Logout Section */}
        <div className="text-center">
          <Button
            variant="destructive"
            size="lg"
            onClick={() => {
              logout();
              navigate({ to: "/auth" });
            }}
            className="px-8 py-3"
          >
            <IconLogout className="mr-2" size={20} />
            Logout
          </Button>
        </div>
      </div>
    </main>
  );
}
