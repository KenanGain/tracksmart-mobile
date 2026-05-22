"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import type { ChatMessage, Conversation } from "@/lib/data/chats";

/** One message bubble (+ an optional day divider before it). */
function MessageBubble({ message }: { message: ChatMessage }) {
  const mine = message.from === "me";
  return (
    <div>
      {message.dayMarker && (
        <div className="my-3 flex items-center gap-3">
          <span className="h-px flex-1 bg-ink/10" />
          <span className="text-xs font-medium text-ink-muted">
            {message.dayMarker}
          </span>
          <span className="h-px flex-1 bg-ink/10" />
        </div>
      )}
      <div className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
        <span className="px-1 text-[11px] text-ink-muted">
          {message.senderLabel
            ? `${message.senderLabel}, ${message.time}`
            : message.time}
        </span>
        <div
          className={`mt-0.5 max-w-[80%] px-3.5 py-2 text-sm ${
            mine
              ? "rounded-2xl rounded-br-md bg-brand text-white"
              : "rounded-2xl rounded-bl-md bg-surface-muted text-ink"
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}

/**
 * ChatThread — a conversation: header, messages and a message input.
 * Sending is a mock — it just clears the field.
 */
export function ChatThread({
  conversation,
}: {
  conversation: Conversation;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState("");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center border-b border-ink/5 bg-surface px-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink"
        >
          <Icon name="chevron-left" className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-center text-base font-bold text-ink">
          {conversation.name}
        </h1>
        <span className="w-9 shrink-0" aria-hidden="true" />
      </header>

      {/* Messages */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
        {conversation.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-light text-brand">
              <Icon name="message-circle" className="h-7 w-7" />
            </span>
            <p className="mt-3 text-sm font-semibold text-ink">
              Start the conversation
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">
              Say hello to {conversation.name}.
            </p>
          </div>
        ) : (
          conversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
      </div>

      {/* Input bar */}
      <div className="flex shrink-0 items-center gap-2 border-t border-ink/5 bg-surface px-3 py-3 pb-nav-bottom">
        <button
          type="button"
          aria-label="Attach"
          className="flex h-9 w-9 shrink-0 items-center justify-center text-ink-muted"
        >
          <Icon name="paperclip" className="h-5 w-5" />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message"
          className="min-w-0 flex-1 rounded-full bg-surface-muted px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted focus:ring-2 focus:ring-brand/30"
        />
        <button
          type="button"
          onClick={() => setDraft("")}
          disabled={draft.trim() === ""}
          aria-label="Send"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white disabled:opacity-50"
        >
          <Icon name="send" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
