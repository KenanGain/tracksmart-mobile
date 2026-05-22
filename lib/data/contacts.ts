/**
 * Mock backend — people the driver can start a conversation with.
 *
 * Backend side of the mockup; the frontend reaches these through
 * `lib/api/contacts.ts`. A contact `id` is reused as the conversation id,
 * so picking a contact opens (or starts) the chat at `/chat/<id>`.
 */
export type Contact = {
  id: string;
  name: string;
  /** Job title — shown under the name. */
  role: string;
  /** Two-letter monogram used in the avatar. */
  initials: string;
};

/** The driver's contact list (dispatch, coordinators, teammates). */
export const contacts: Contact[] = [
  { id: "terry", name: "Terry", role: "Dispatcher", initials: "TE" },
  { id: "clair", name: "Clair", role: "Fleet Coordinator", initials: "CL" },
  { id: "chris", name: "Chris", role: "Driver", initials: "CH" },
  { id: "dana", name: "Dana Brooks", role: "Safety Officer", initials: "DB" },
  { id: "marcus", name: "Marcus Lee", role: "Dispatcher", initials: "ML" },
  { id: "priya", name: "Priya Shah", role: "Driver", initials: "PS" },
  { id: "sam", name: "Sam Rivera", role: "Maintenance Lead", initials: "SR" },
];
