import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import ThemeToggler from "../ThemeToggler";
import { Button } from "../ui/button";
import { IconUserCircle, IconBell, IconLogout } from "@tabler/icons-react";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";
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

export default function ProfDashboardSidebar() {
  const navigate = useNavigate();
  const { data: account } = useAccount();
  const { open } = useSidebar();

  const matchRoute = useMatchRoute();

  const isActive = (to: string) => matchRoute({ to });

  const getActiveClass = (to: string) =>
    isActive(to) ? "text-indigo-400" : "";

  const { data: notifications, isLoading: isLoadingNotifications } =
    useNotifications();

  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <ThemeToggler />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={getActiveClass("")}
              onClick={() => {
                navigate({ to: "/prof/dashboard/invitations" });
              }}
            >
              my invitations
            </SidebarMenuButton>
          </SidebarMenuItem>
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

            {/*  NOTIFICATIONS AS DIALOG */}
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

        {/*  DIALOG OUTSIDE DROPDOWN */}
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
