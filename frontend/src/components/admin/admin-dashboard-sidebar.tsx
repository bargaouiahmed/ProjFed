import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import ThemeToggler from "../ThemeToggler";
import { Button } from "../ui/button";
import { IconUserCircle, IconSchool, IconBell } from "@tabler/icons-react";
import { useNavigate, useMatchRoute } from "@tanstack/react-router";
import useAccount from "@/querys/useAccount";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import logout from "@/querys/logout";
import Profile from "../profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { useState } from "react";

export default function AdminDashboardSideBar() {
  const navigate = useNavigate();
  const { data: account } = useAccount();
  const { open } = useSidebar();
  const matchRoute = useMatchRoute();

  const isActive = (to: string) => matchRoute({ to, fuzzy: true });
  const getActiveClass = (to: string) => (isActive(to) ? "text-primary" : "");

  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <ThemeToggler />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {/* University Admin Requests */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigate({ to: "/admin/dashboard/requests" })}
                className={getActiveClass("/admin/dashboard/requests")}
              >
                <IconSchool />
                {open && <span>University Admins Requests</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="py-6">
              <div className="flex items-center gap-2">
                {account?.pfpUrl ? (
                  <img
                    src={"http://localhost:5173/api/v0" + account.pfpUrl}
                    className="w-8 h-8 rounded-full object-cover border shadow-sm"
                  />
                ) : (
                  <IconUserCircle />
                )}
                {open && <p>{account?.email}</p>}
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Notifications */}
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setNotifOpen(true);
              }}
            >
              <div className="flex items-center gap-2">
                <IconBell />
                Notifications
              </div>
            </DropdownMenuItem>

            <Profile />

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-500"
              onClick={() => {
                logout();
                navigate({ to: "/auth" });
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications Dialog outside dropdown */}
        <Dialog open={notifOpen} onOpenChange={setNotifOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notifications</DialogTitle>
              <DialogDescription>Your latest notifications.</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                No new notifications
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}
