/**
 * Mock backend — chat conversations and messages.
 *
 * Backend side of the mockup; the frontend reaches these through
 * `lib/api/chats.ts`.
 */
export type ChatMessage = {
  id: string;
  /** "me" = the signed-in driver, "them" = the other person. */
  from: "me" | "them";
  text: string;
  /** Display time, e.g. "06:33 PM". */
  time: string;
  /** Sender label for an incoming message, e.g. "Terry (Dispatcher)". */
  senderLabel?: string;
  /** A day divider rendered before this message, e.g. "Today". */
  dayMarker?: string;
};

export type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: ChatMessage[];
};

/** Newest activity first. */
export const conversations: Conversation[] = [
  {
    id: "terry",
    name: "Terry",
    lastMessage: "pizza again?",
    time: "06:47 PM",
    unread: true,
    messages: [
      {
        id: "t1",
        from: "them",
        text: "you taking a break for lunch after?",
        time: "06:30 PM",
        senderLabel: "Terry (Dispatcher)",
      },
      { id: "t2", from: "me", text: "Yep. Gotta get a coffee!!", time: "06:31 PM" },
      {
        id: "t3",
        from: "them",
        text: "how's life on the road treating you today?",
        time: "06:33 PM",
        senderLabel: "Terry (Dispatcher)",
        dayMarker: "Today",
      },
      { id: "t4", from: "them", text: "gonna stop for food soon?", time: "06:36 PM" },
      { id: "t5", from: "me", text: "yep!", time: "06:38 PM" },
      {
        id: "t6",
        from: "them",
        text: "what's your top pick?",
        time: "06:42 PM",
        senderLabel: "Terry (Dispatcher)",
      },
      { id: "t7", from: "them", text: "pizza again?", time: "06:47 PM" },
      { id: "t8", from: "me", text: "yep!! love it!", time: "06:48 PM" },
    ],
  },
  {
    id: "clair",
    name: "Clair",
    lastMessage: "hey!",
    time: "06:39 PM",
    unread: false,
    messages: [
      { id: "c1", from: "me", text: "Heading out now.", time: "06:35 PM" },
      {
        id: "c2",
        from: "them",
        text: "hey!",
        time: "06:39 PM",
        senderLabel: "Clair",
      },
    ],
  },
  {
    id: "chris",
    name: "Chris",
    lastMessage: "Just took these the other day",
    time: "3 days ago",
    unread: false,
    messages: [
      {
        id: "h1",
        from: "them",
        text: "Just took these the other day",
        time: "Mon 2:14 PM",
        senderLabel: "Chris",
      },
      { id: "h2", from: "me", text: "Nice shots!", time: "Mon 2:20 PM" },
    ],
  },
];
