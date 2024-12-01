import { SidebarFooter, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { UserMenu } from "./user-menu";

export const SideBarFooter = () => {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <UserMenu />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
