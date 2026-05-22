/**
 * Chats service — conversations for the Chats screen.
 *
 * Frontend ⇄ this file ⇄ lib/data/chats.ts (mock backend).
 */
import { conversations, type Conversation } from "@/lib/data/chats";
import { contacts } from "@/lib/data/contacts";

/** All conversations, newest activity first. */
export async function getConversations(): Promise<Conversation[]> {
  return conversations;
}

/** Number of conversations with unread messages — for the nav badge. */
export async function getUnreadChatCount(): Promise<number> {
  return conversations.filter((conversation) => conversation.unread).length;
}

/**
 * One conversation by id. When there is no existing thread but the id
 * matches a contact, a fresh empty conversation is returned — this is how
 * a chat started from the contact list (New Chat) opens.
 */
export async function getConversation(
  id: string,
): Promise<Conversation | undefined> {
  const existing = conversations.find(
    (conversation) => conversation.id === id,
  );
  if (existing) return existing;

  const contact = contacts.find((person) => person.id === id);
  if (contact) {
    return {
      id: contact.id,
      name: contact.name,
      lastMessage: "",
      time: "",
      unread: false,
      messages: [],
    };
  }

  return undefined;
}
