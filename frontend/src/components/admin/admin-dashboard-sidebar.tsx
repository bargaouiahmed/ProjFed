import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import ThemeToggler from "../ThemeToggler";
import { Button } from "../ui/button";
import { IconSchool, IconUserCircle } from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
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

export default function AdminDashboardSideBar() {
  const naviagate = useNavigate();
  const { data: account } = useAccount();
  console.log(account);
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <ThemeToggler />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Link to="/admin/dashboard/requests">
            <Button variant={"ghost"}>
              {open && "university admins requests"}
              <IconSchool />
            </Button>
          </Link>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>
              <div className="flex items-center gap-2">
                {account?.pfpUrl ? (
                  <img
                    src={"http://localhost:5173/api/v0" + account.pfpUrl}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
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

            <Profile />

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => {
                logout();
                naviagate({ to: "/auth" });
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
