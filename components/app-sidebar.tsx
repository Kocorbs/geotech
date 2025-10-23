"use client";

import * as React from "react";
import {
  IconDashboard,
  IconFileWord,
  IconHelp,
  IconLocation,
  IconMap,
  IconMessages,
  IconMicrophone,
  IconReport,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MapIcon } from "lucide-react";
import { useSession } from "next-auth/react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Map",
      url: "/map",
      icon: IconMap,
    },
    {
      title: "Locations",
      url: "/locations",
      icon: IconLocation,
    },
    {
      title: "Discussions",
      url: "/discussions",
      icon: IconMessages,
    },
    {
      title: "Announcements",
      url: "/announcements",
      icon: IconMicrophone,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
  ],
  adminNav: [
    {
      title: "Admin Map",
      url: "/adminmap",
      icon: IconMap,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="border border-r-1 z-[2000]"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <MapIcon className="!size-5" />
                <span className="text-base font-semibold">GeoTech</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {session?.user?.role === "ADMIN" && (
          <NavMain items={data.adminNav} label="Admin" />
        )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
