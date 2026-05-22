"use client";

import { BottomSheet } from "@/components/ui/BottomSheet";
import {
  TextField,
  SelectField,
  DateField,
  TextAreaField,
  SubmitButton,
} from "@/components/ui/form";

/** A single field in an Update sheet. Built by the compliance page. */
export type SheetFieldConfig = {
  kind: "text" | "select" | "date" | "textarea";
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  /** Only for `select`. */
  options?: { value: string; label: string }[];
};

/**
 * UpdateItemSheet — the "Update <item>" bottom-sheet form for a Basic
 * compliance item (Driver's License, Passport, Emergency Contact).
 */
export function UpdateItemSheet({
  open,
  onClose,
  title,
  fields,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: SheetFieldConfig[];
}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Mock — in the real app this is sent for review. Just close for now.
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={`Update ${title}`}>
      <p className="text-sm font-semibold text-brand">{title}</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {fields.map((field) => {
          switch (field.kind) {
            case "select":
              return (
                <SelectField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  defaultValue={field.defaultValue}
                  placeholder={field.placeholder}
                  options={field.options ?? []}
                />
              );
            case "date":
              return (
                <DateField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  defaultValue={field.defaultValue}
                />
              );
            case "textarea":
              return (
                <TextAreaField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  defaultValue={field.defaultValue}
                  placeholder={field.placeholder}
                />
              );
            default:
              return (
                <TextField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  defaultValue={field.defaultValue}
                  placeholder={field.placeholder}
                />
              );
          }
        })}

        <SubmitButton label="Submit for Review" />
      </form>
    </BottomSheet>
  );
}
