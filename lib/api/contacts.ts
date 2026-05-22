/**
 * Contacts service — the people the driver can message.
 *
 * Frontend ⇄ this file ⇄ lib/data/contacts.ts (mock backend).
 */
import { contacts, type Contact } from "@/lib/data/contacts";

/** Everyone the driver can start a conversation with. */
export async function getContacts(): Promise<Contact[]> {
  return contacts;
}
