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
  IconSchool,
  IconPlus,
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
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { useState } from "react";
import useNotifications from "@/querys/useNotifications";
import { ScrollArea } from "../ui/scroll-area";
import NotificationCard from "../NotificationCard";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormikInput } from "../form/formikInput";
import useAddStudentToClass from "@/querys/student/useAddStudentToClass";
import { getApiUrl } from "@/querys/axios";

export default function StudentDashboardSidebar() {
  const navigate = useNavigate();
  const { data: account } = useAccount();
  const { open } = useSidebar();
  const { mutate: joinClass, isPending: isJoining } = useAddStudentToClass();

  const matchRoute = useMatchRoute();

  const isActive = (to: string) => matchRoute({ to });

  const getActiveClass = (to: string) =>
    isActive(to) ? "text-primary" : "";

  const { data: notifications, isLoading: isLoadingNotifications } =
    useNotifications();

  const [notifOpen, setNotifOpen] = useState(false);
  const [joinClassOpen, setJoinClassOpen] = useState(false);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <ThemeToggler />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={getActiveClass("/student/dashboard/courses")}
              onClick={() => {
                navigate({ to: "/student/dashboard/courses" });
              }}
            >
              <IconSchool />
              {open && "My Courses"}
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Dialog open={joinClassOpen} onOpenChange={setJoinClassOpen}>
              <DialogTrigger asChild>
                <SidebarMenuButton>
                  <IconPlus />
                  {open && "Join Class"}
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join a Class</DialogTitle>
                  <DialogDescription>
                    Enter the class code provided by your administrator or professor.
                  </DialogDescription>
                </DialogHeader>
                <Formik
                  initialValues={{ classCode: "" }}
                  validationSchema={Yup.object({
                    classCode: Yup.string().required("Class code is required"),
                  })}
                  onSubmit={(values) => {
                    joinClass(values.classCode, {
                      onSuccess: () => setJoinClassOpen(false),
                    });
                  }}
                >
                  <Form className="space-y-4">
                    <FormikInput
                      name="classCode"
                      label="Class Code"
                      placeholder="e.g. CLS-123456"
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={isJoining}>
                        {isJoining ? "Joining..." : "Join Class"}
                      </Button>
                    </DialogFooter>
                  </Form>
                </Formik>
              </DialogContent>
            </Dialog>
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
            <Button variant="outline" className="py-6 w-full">
              <div className="flex items-center gap-2 overflow-clip">
                {account?.pfpUrl ? (
                  <img
                    src={getApiUrl(account.pfpUrl)}
                    className="w-8 h-8 rounded-full object-cover border shadow-sm"
                  />
                ) : (
                  <IconUserCircle />
                )}
                {open && <p className="truncate text-xs">{account?.email}</p>}
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setNotifOpen(true);
              }}
            >
              <div className="flex items-center gap-2">
                <IconBell size={18} />
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
              <IconLogout size={18} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={notifOpen} onOpenChange={setNotifOpen}>
          <DialogContent className="max-w-md p-0 overflow-hidden">
            <div className="p-6 pb-2">
              <DialogHeader>
                <DialogTitle className="text-primary">
                  Notifications
                </DialogTitle>
                <DialogDescription>
                  Stay updated with your latest academic activities.
                </DialogDescription>
              </DialogHeader>
            </div>
            <ScrollArea className="h-[400px] w-full px-6 pb-6">
              <div className="flex flex-col gap-3">
                {isLoadingNotifications ? (
                  <div className="flex justify-center py-8 text-muted-foreground animate-pulse">
                    Loading notifications...
                  </div>
                ) : notifications && notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <NotificationCard key={notif.id} notif={notif} />
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
