"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, Loader2 } from "lucide-react";

/* Utility to format AI messages */
export function formatMessage(content: string) {
  return content
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/(^|\n)([A-Za-z ].+?[:?])(\n|$)/g, "\n$2\n\n")
    .replace(/(\d+\.)\s*/g, "\n$1 ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

type Message = {
  role: "user" | "assistant";
  content: string;
  id?: string;
  chatId?: string;
  user_id?: string;
};

export default function DashboardClient() {
  const [messages, setMessages] = useState<Message[]>([]); // start empty for SSR
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage **after mount**
  useEffect(() => {
    const saved = localStorage.getItem("chat_messages");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const sendMessage = async (text: string) => {
    setIsLoading(true);

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!res.ok) throw new Error("API error");

      const result = await res.json();

      const botMessage: Message = {
        role: "assistant",
        content: result.content,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // const sendMessage = async (text: string) => {
  //   setIsLoading(true);

  //   try {
  //     const supabase = await createClient();
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();
  //     if (!user) throw new Error("User not authenticated");

  //     // 1️⃣ Create a new chat if it doesn't exist
  //     let chatId = currentChatId;
  //     if (!chatId) {
  //       chatId = await createChat(user.id, "New Chat");
  //       setCurrentChatId(chatId);
  //     }

  //     const newMessage: Message = { role: "user", content: text };
  //     setMessages((prev) => [...prev, newMessage]);

  //     // 2️⃣ Save user message
  //     await addChatMessage(chatId, user.id, "user", text);

  //     // 3️⃣ Send to AI API
  //     const res = await fetch("/api/chat", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ messages: [...messages, newMessage] }),
  //     });

  //     if (!res.ok) throw new Error(`API error: ${res.status}`);
  //     const data: Message = await res.json();

  //     setMessages((prev) => [...prev, data]);

  //     // 4️⃣ Save AI response
  //     await addChatMessage(chatId, user.id, "assistant", data.content);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <Card className="w-full h-150 flex flex-col overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          AI Chat Assistant
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="space-y-4 py-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className="text-sm whitespace-pre-wrap leading-relaxed"
              >
                <strong className="inline-flex items-center gap-1">
                  {msg.role === "assistant" && <Bot className="w-4 h-4" />}
                  {msg.role === "assistant" ? "Bot " : "You "}:
                </strong>

                {msg.role === "assistant"
                  ? formatMessage(msg.content)
                  : msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
