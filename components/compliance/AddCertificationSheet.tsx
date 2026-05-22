"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { AddDocumentSheet } from "./AddDocumentSheet";
import {
  TextField,
  DateField,
  TextAreaField,
  ToggleGroup,
  UploadField,
  SubmitButton,
} from "@/components/ui/form";

/**
 * AddCertificationSheet — the "Add New Certification" bottom-sheet form.
 */
export function AddCertificationSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [category, setCategory] = useState("drug_test");
  const [result, setResult] = useState("pass");
  const [docOpen, setDocOpen] = useState(false);
  const [docAttached, setDocAttached] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Mock — in the real app this is sent for review. Just close for now.
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Add New Certification">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Certification Name"
          name="name"
          placeholder="e.g., Hazmat Training"
        />
        <ToggleGroup
          label="Category"
          value={category}
          onChange={setCategory}
          options={[
            { value: "drug_test", label: "Drug Test" },
            { value: "road_test", label: "Road Test" },
          ]}
        />
        <ToggleGroup
          label="Result"
          value={result}
          onChange={setResult}
          options={[
            { value: "pass", label: "Pass" },
            { value: "fail", label: "Fail" },
          ]}
        />
        <DateField label="Expiry Date" name="expiryDate" />
        {/* Document upload is wired with the capture flow in a later task. */}
        <UploadField label="Document File" />
        <TextAreaField
          label="Note (Optional)"
          name="note"
          placeholder="Add a note..."
        />
        <SubmitButton label="Submit for Review" />
      </form>
    </BottomSheet>
  );
}
