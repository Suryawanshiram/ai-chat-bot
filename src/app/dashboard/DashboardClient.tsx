"use client";

import { useRef, useState } from "react";
// import { useChat } from "ai/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardClient() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //   const { messages, sendMessage, isLoading } = useChat();
  const messages = [
    { id: 1, role: "user", content: "Hello, how are you?" },
    { id: 2, role: "assistant", content: "I'm doing well, thank you!" },
  ];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold p-4">Dashboard</h1>
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
              {messages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  {msg.role === "user" ? "You: " : "AI: "}
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4">
          <form onSubmit={onSubmit} className="flex gap-2 w-full">
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
    </div>
  );
}
