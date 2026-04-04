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
import Profile from "@/components/profile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import ThemeToggler from "@/components/ThemeToggler";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: account, isPending } = useAccount();
  const { theme } = useTheme();

  const navigate = Route.useNavigate();
  if (isPending) return <div>Loading...</div>;
  if (!account) return navigate({ to: "/auth" });
  return (
    <main className="min-h-screen flex items-center ">
      <div className="absolute top-4 left-4">
        <ThemeToggler />
      </div>
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
            <div
              className={cn(
                "bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center border border-border hover:border-primary",
                theme === "dark" && "bg-dark-card",
                theme === "light" && "bg-light-card",
              )}
            >
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
            <div
              className={cn(
                "bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center border border-border hover:border-primary",
                theme === "dark" && "bg-dark-card",
                theme === "light" && "bg-light-card",
              )}
            >
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
            <div
              className={cn(
                "bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center border border-border hover:border-primary",
                theme === "dark" && "bg-dark-card",
                theme === "light" && "bg-light-card",
              )}
            >
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
        <div className="absolute bottom-4 left-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>settings</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Profile />
              <DropdownMenuItem
                variant={"destructive"}
                onClick={() => {
                  logout();
                  navigate({ to: "/auth" });
                }}
              >
                <IconLogout className="mr-2" size={20} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </main>
  );
}
