"use client";

import { Calendar, Home, Inbox, Search, Settings, LogOut } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const items = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Inbox", url: "/dashboard/inbox", icon: Inbox },
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "Search", url: "/dashboard/search", icon: Search },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const supabase = createClient();
  const [user, setUser] = useState<any>();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, [supabase]);

  return (
    <Sidebar>
      <SidebarContent>
        {/* MAIN MENU */}
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* USER SECTION AT BOTTOM */}
      <SidebarFooter className="border-t p-3">
        {user && (
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col text-sm">
              <span className="font-medium">{user.email}</span>
              <span className="text-muted-foreground">Signed in</span>
            </div>

            <button
              onClick={() => supabase.auth.signOut()}
              className="p-2 rounded-md hover:bg-muted"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
