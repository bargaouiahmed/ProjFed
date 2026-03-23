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
import { IconSchool } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

export default function AdminDashboardSideBar() {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <ThemeToggler />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Link to="/admin/dashboard/request/$page" params={{ page: "1" }}>
            <Button variant={"ghost"}>
              {open && "university admins requests"}
              <IconSchool />
            </Button>
          </Link>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
