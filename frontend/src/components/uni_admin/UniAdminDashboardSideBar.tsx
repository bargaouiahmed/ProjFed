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
import {
  IconUserCircle,
  IconSchool,
  IconUsers,
  IconInbox,
  IconMail,
  IconBell,
  IconLogout,
} from "@tabler/icons-react";
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
import useNotifications from "@/querys/useNotifications";

export default function AdminDashboardSideBar() {
  const navigate = useNavigate();
  const { data: account } = useAccount();
  const { open } = useSidebar();
  const matchRoute = useMatchRoute();

  const isActive = (to: string) => matchRoute({ to, fuzzy: true });
  const getActiveClass = (to: string) => (isActive(to) ? "text-primary" : "");

  const { data: notifications, isLoading: isLoadingNotifications } =
    useNotifications();

  // ✅ dialog state
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <ThemeToggler />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {/* Invitations */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() =>
                  navigate({
                    to: "/administration/dashboard/invitations",
                  })
                }
                className={getActiveClass(
                  "/administration/dashboard/invitations",
                )}
              >
                <IconInbox />
                {open && <span>My Invitations</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Classes */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() =>
                  navigate({
                    to: "/administration/dashboard/classes",
                    search: { pageSize: 10, pageNumber: 1 },
                  })
                }
                className={getActiveClass("/administration/dashboard/classes")}
              >
                <IconSchool />
                {open && <span>Classes</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Staff */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() =>
                  navigate({
                    to: "/administration/dashboard/staff",
                  })
                }
                className={getActiveClass("/administration/dashboard/staff")}
              >
                <IconUsers />
                {open && <span>Staff</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Professors Invitations */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() =>
                  navigate({
                    to: "/administration/dashboard/professorsInvitations",
                  })
                }
                className={getActiveClass(
                  "/administration/dashboard/professorsInvitations",
                )}
              >
                <IconMail />
                {open && <span>Professors Invitations</span>}
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

            {/* ✅ NOTIFICATIONS AS DIALOG */}
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
              <IconLogout />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ✅ DIALOG OUTSIDE DROPDOWN */}
        <Dialog open={notifOpen} onOpenChange={setNotifOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notifications</DialogTitle>
              <DialogDescription>Description text here.</DialogDescription>
            </DialogHeader>

            {isLoadingNotifications ? (
              <div>loading...</div>
            ) : notifications && notifications.length > 0 ? (
              JSON.stringify(notifications)
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  No new notifications
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}
