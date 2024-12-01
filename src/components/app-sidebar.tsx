import { GraduationCap } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { SideBarHeader, SideBarMenu } from "./sidebar";
import { menuItems } from "@/registry/menu-items";
import { SideBarFooter } from "./sidebar/sidebar-footer";

export default function AppSideBar({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar variant="inset" collapsible="icon">
        <SideBarHeader
          title="Nuevo Amanecer"
          description="Sistema de Administración"
          Icon={GraduationCap}
        />

        <SidebarContent>
          <SideBarMenu data={menuItems} />
        </SidebarContent>
        <SideBarFooter />
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>...</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </>
  );
}
