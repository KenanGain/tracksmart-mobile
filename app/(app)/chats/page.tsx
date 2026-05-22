import type { Metadata } from "next";
import { getConversations } from "@/lib/api/chats";
import { getContacts } from "@/lib/api/contacts";
import { ChatsList } from "@/components/chats/ChatsList";

export const metadata: Metadata = { title: "Chats" };

export default async function ChatsPage() {
  const [conversations, contacts] = await Promise.all([
    getConversations(),
    getContacts(),
  ]);
  return <ChatsList conversations={conversations} contacts={contacts} />;
}
