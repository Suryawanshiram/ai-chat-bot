"use client";

import { Home, MessageSquare, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
import { getUserChats } from "@/app/auth/callback/action";
// import { getUserChats } from "@/actions/chat";

type Chat = {
  id: string;
  title: string;
};

export function AppSidebar() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, [supabase]);

  useEffect(() => {
    getUserChats().then(setChats);
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        {/* MAIN MENU */}
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* CHAT LIST */}
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <Link href={`/dashboard/chat/${chat.id}`}>
                      <MessageSquare className="w-4 h-4" />
                      <span className="truncate">{chat.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {chats.length === 0 && (
                <p className="px-3 py-2 text-xs text-muted-foreground">
                  No chats yet
                </p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* USER FOOTER */}
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
