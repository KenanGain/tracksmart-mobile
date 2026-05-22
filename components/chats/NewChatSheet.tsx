"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Icon } from "@/components/ui/Icon";
import type { Contact } from "@/lib/data/contacts";

/**
 * NewChatSheet — the contact list shown by the Chats "New chat" button.
 * Picking a contact opens (or starts) a conversation at `/chat/<id>`.
 */
export function NewChatSheet({
  open,
  onClose,
  contacts,
}: {
  open: boolean;
  onClose: () => void;
  contacts: Contact[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const term = query.trim().toLowerCase();
  const filtered = term
    ? contacts.filter((c) =>
        `${c.name} ${c.role}`.toLowerCase().includes(term),
      )
    : contacts;

  const start = (id: string) => {
    onClose();
    router.push(`/chat/${id}`);
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="New Chat">
      <p className="-mt-1 text-sm text-ink-muted">
        Pick a contact to start a conversation.
      </p>

      {/* Search */}
      <div className="relative mt-3">
        <Icon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search contacts"
          className="w-full rounded-lg bg-surface-muted py-2.5 pl-9 pr-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:ring-2 focus:ring-brand/30"
        />
      </div>

      {/* Contact list */}
      {filtered.length === 0 ? (
        <p className="mt-6 text-center text-sm text-ink-muted">
          No contacts found.
        </p>
      ) : (
        <ul className="mt-3 space-y-1">
          {filtered.map((contact) => (
            <li key={contact.id}>
              <button
                type="button"
                onClick={() => start(contact.id)}
                className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-surface-muted"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {contact.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">
                    {contact.name}
                  </p>
                  <p className="truncate text-xs text-ink-muted">
                    {contact.role}
                  </p>
                </div>
                <Icon
                  name="chevron-right"
                  className="h-4 w-4 shrink-0 text-ink-muted"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </BottomSheet>
  );
}
