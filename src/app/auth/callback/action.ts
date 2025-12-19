"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ChatMessage = {
  id: string;
  chat_id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type Chat = {
  id: string;
  title: string;
  created_at: string;
};

export async function getUserChats(): Promise<Chat[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("chat")
    .select("id, title, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Get chats error:", error);
    return [];
  }

  return data ?? [];
}

// export async function getChatHistory(chatId: string): Promise<ChatMessage[]> {
//   if (!chatId) return [];

//   try {
//     const supabase = await createClient();

//     const { data, error } = await supabase
//       .from("chat_history")
//       .select("id, chat_id, user_id, role, content, created_at")
//       .eq("chat_id", chatId)
//       .order("created_at", { ascending: true }); // ✅ correct for chat UI

//     if (error) {
//       console.error("Get chat history error:", error);
//       throw error;
//     }

//     return data ?? [];
//   } catch (err) {
//     console.error("Get chat history failed:", err);
//     return [];
//   }
// }

export async function createChat(userId: string, title: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chat")
    .insert({ user_id: userId, title })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create chat:", error);
    throw error;
  }

  return data.id;
}

export async function addChatMessage(
  chatId: string,
  userId: string,
  role: "user" | "assistant",
  content: string
) {
  if (!chatId || !userId) throw new Error("Chat ID and User ID are required");

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chat_history")
    .insert({ chat_id: chatId, user_id: userId, role, content })
    .select("*");

  if (error) {
    console.error("Failed to insert chat message:", error);
    throw error;
  }

  return data[0];
}

// export async function addChatMessage(userId: string, message: string) {
//   if (!userId) throw new Error("User ID is required");

//   const supabase = await createClient();

//   const { data, error } = await supabase
//     .from("chat_history")
//     .insert({ message, user_id: userId })
//     .select("*"); // returns inserted row(s)

//   if (error) {
//     console.error("Failed to insert chat message:", error);
//     throw error;
//   }

//   return data || [];
// }

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}
