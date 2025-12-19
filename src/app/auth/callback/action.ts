"use server";

import { createClient } from "@/utils/supabase/server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getChatHistory(chatId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("chat_history")
      .select("*")
      .eq("chat_id", chatId) // filter messages by chat
      .order("created_at", { ascending: false }); // most recent first

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get chat history error:", error);
    return [];
  }
}

export async function addChatMessage(userId: string, message: string) {
  if (!userId) throw new Error("User ID is required");

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chat_history")
    .insert({ message, user_id: userId })
    .select("*"); // returns inserted row(s)

  if (error) {
    console.error("Failed to insert chat message:", error);
    throw error;
  }

  return data || [];
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}
