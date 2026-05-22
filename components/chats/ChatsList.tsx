"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { NewChatSheet } from "./NewChatSheet";
import type { Conversation } from "@/lib/data/chats";
import type { Contact } from "@/lib/data/contacts";

/**
 * ChatsList — the Chats tab: search, the conversation list, and a
 * "New chat" button that opens the contact list.
 */
export function ChatsList({
  conversations,
  contacts,
}: {
  conversations: Conversation[];
  contacts: Contact[];
}) {
  const [query, setQuery] = useState("");
  const [newChatOpen, setNewChatOpen] = useState(false);

  const term = query.trim().toLowerCase();
  const filtered = term
    ? conversations.filter((c) =>
        `${c.name} ${c.lastMessage}`.toLowerCase().includes(term),
      )
    : conversations;

  return (
    <div className="flex min-h-full flex-col">
      {/* Search */}
      <div className="relative">
        <Icon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="w-full rounded-lg bg-surface py-2.5 pl-9 pr-3 text-sm text-ink shadow-card outline-none placeholder:text-ink-muted focus:ring-2 focus:ring-brand/30"
        />
      </div>

      {/* Conversations */}
      {filtered.length === 0 ? (
        <p className="mt-6 text-center text-sm text-ink-muted">
          No conversations found.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {filtered.map((conversation) => (
            <li key={conversation.id}>
              <Link
                href={`/chat/${conversation.id}`}
                className="flex items-center gap-3 rounded-card bg-surface p-3 shadow-card"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-300 text-slate-600">
                  <Icon name="user" className="h-7 w-7" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-bold text-ink">
                      {conversation.name}
                    </p>
                    <span className="shrink-0 text-xs text-ink-muted">
                      {conversation.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`truncate text-sm ${
                        conversation.unread
                          ? "font-semibold text-ink"
                          : "text-ink-muted"
                      }`}
                    >
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread && (
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* New chat — opens the contact list */}
      <div className="flex-1" />
      <div className="sticky bottom-2 flex justify-end">
        <button
          type="button"
          onClick={() => setNewChatOpen(true)}
          className="flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg"
        >
          <Icon name="plus" className="h-4 w-4" />
          New chat
        </button>
      </div>

      <NewChatSheet
        open={newChatOpen}
        onClose={() => setNewChatOpen(false)}
        contacts={contacts}
      />
    </div>
  );
}
