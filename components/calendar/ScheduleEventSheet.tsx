"use client";

import { BottomSheet } from "@/components/ui/BottomSheet";
import {
  TextField,
  DateField,
  SelectField,
  SubmitButton,
} from "@/components/ui/form";
import type {
  CalendarEvent,
  CalendarEventKind,
} from "@/lib/data/calendar-events";

const KIND_OPTIONS: { value: CalendarEventKind; label: string }[] = [
  { value: "delivery", label: "Delivery" },
  { value: "pickup", label: "Pickup" },
  { value: "meeting", label: "Meeting" },
  { value: "maintenance", label: "Maintenance" },
  { value: "reminder", label: "Reminder" },
];

/**
 * ScheduleEventSheet — the "Schedule Event" bottom-sheet form. Submitting
 * hands a new event back to the calendar (prototype: kept in state).
 */
export function ScheduleEventSheet({
  open,
  onClose,
  defaultDate,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  /** ISO date to prefill the date field with. */
  defaultDate: string;
  onAdd: (event: CalendarEvent) => void;
}) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onAdd({
      id: `ev-${Date.now()}`,
      title: String(data.get("title") ?? "").trim() || "Untitled event",
      date: String(data.get("date") ?? defaultDate),
      time: String(data.get("time") ?? "").trim() || "All day",
      kind: (data.get("kind") as CalendarEventKind) || "reminder",
    });
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Schedule Event">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Event Title"
          name="title"
          placeholder="e.g. Load pickup — Guelph terminal"
        />
        <DateField label="Date" name="date" defaultValue={defaultDate} />
        <TextField label="Time" name="time" placeholder="e.g. 10:00 AM" />
        <SelectField
          label="Type"
          name="kind"
          defaultValue="delivery"
          options={KIND_OPTIONS}
        />
        <SubmitButton label="Add to Calendar" />
      </form>
    </BottomSheet>
  );
}
