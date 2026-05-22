import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getConversation } from "@/lib/api/chats";
import { ChatThread } from "@/components/chats/ChatThread";

export const metadata: Metadata = { title: "Chat" };

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversation = await getConversation(id);
  if (!conversation) notFound();
  return <ChatThread conversation={conversation} />;
}
