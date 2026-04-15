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
import {
  IconUserCircle,
  IconBell,
  IconLogout,
  IconMailOpened,
} from "@tabler/icons-react";
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
import { ScrollArea } from "../ui/scroll-area";
import NotificationCard from "../NotificationCard";

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
              <IconMailOpened />
              {open && "my invitations"}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div>
          {open && notifications && notifications[0] && (
            <NotificationCard notif={notifications[0]} />
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="py-6">
              <div className="flex items-center gap-2 overflow-clip">
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
          <DialogContent className="max-w-md p-0 overflow-hidden">
            {" "}
            {/* p-0 and overflow-hidden to keep ScrollArea flush */}
            <div className="p-6 pb-2">
              <DialogHeader>
                <DialogTitle className="text-primary">
                  Notifications
                </DialogTitle>
                <DialogDescription>
                  Stay updated with your latest teaching activities.
                </DialogDescription>
              </DialogHeader>
            </div>
            <ScrollArea className="h-100 w-full px-6 pb-6">
              <div className="flex flex-col gap-3">
                {isLoadingNotifications ? (
                  <div className="flex justify-center py-8 text-muted-foreground animate-pulse">
                    Loading notifications...
                  </div>
                ) : notifications && notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <NotificationCard notif={notif} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-60">
                    <IconBell className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Inbox is empty
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}
