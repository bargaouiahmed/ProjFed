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

export default function AdminDashboardSideBar() {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <ThemeToggler />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Button variant={"ghost"} className="text-accent-foreground">
            {open && "university admins requests"}
            <IconSchool />
          </Button>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
