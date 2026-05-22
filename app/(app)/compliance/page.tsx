import type { Metadata } from "next";
import { getCompliance } from "@/lib/api/compliance";
import { formatDate, daysUntil } from "@/lib/format";
import {
  ComplianceItemCard,
  type ItemStatus,
} from "@/components/compliance/ComplianceItemCard";
import type { SheetFieldConfig } from "@/components/compliance/UpdateItemSheet";
import { DocumentsSection } from "@/components/compliance/DocumentsSection";
import { CertificationsSection } from "@/components/compliance/CertificationsSection";

export const metadata: Metadata = { title: "My Compliance" };

/** Province / territory options for the licence form. */
const PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
];

/** "N/A" fallback for empty backend values. */
function na(value: string | null): string {
  return value ?? "N/A";
}

/** Status line for an item with an (optional) expiry date. */
function expiryStatus(expiryDate: string | null): ItemStatus {
  if (!expiryDate) return { text: "No expiry", ok: true };
  const days = daysUntil(expiryDate);
  if (days < 0) return { text: "Expired", ok: false };
  return { text: `${days} days until expiry`, ok: true };
}

const NOTE_FIELD: SheetFieldConfig = {
  kind: "textarea",
  name: "note",
  label: "Note (Optional)",
  placeholder: "Add a note...",
};

export default async function CompliancePage() {
  const c = await getCompliance();

  const licenseFields: SheetFieldConfig[] = [
    {
      kind: "text",
      name: "number",
      label: "New License Number",
      defaultValue: c.license.number ?? "",
      placeholder: "License number",
    },
    {
      kind: "select",
      name: "provinceState",
      label: "New Province/State",
      defaultValue: c.license.provinceState ?? "",
      placeholder: "Select province/state",
      options: PROVINCES,
    },
    {
      kind: "date",
      name: "expiryDate",
      label: "New Expiry Date",
      defaultValue: c.license.expiryDate ?? "",
    },
    NOTE_FIELD,
  ];

  const passportFields: SheetFieldConfig[] = [
    {
      kind: "text",
      name: "number",
      label: "New Passport Number",
      defaultValue: c.passport.number ?? "",
      placeholder: "Passport number",
    },
    {
      kind: "text",
      name: "country",
      label: "New Country",
      defaultValue: c.passport.country ?? "",
      placeholder: "Country",
    },
    {
      kind: "date",
      name: "expiryDate",
      label: "New Expiry Date",
      defaultValue: c.passport.expiryDate ?? "",
    },
    NOTE_FIELD,
  ];

  const emergencyFields: SheetFieldConfig[] = [
    {
      kind: "text",
      name: "name",
      label: "New Contact Name",
      defaultValue: c.emergencyContact.name ?? "",
      placeholder: "Full name",
    },
    {
      kind: "text",
      name: "relationship",
      label: "New Relationship",
      defaultValue: c.emergencyContact.relationship ?? "",
      placeholder: "e.g. Spouse",
    },
    {
      kind: "text",
      name: "phone",
      label: "New Phone",
      defaultValue: c.emergencyContact.phone ?? "",
      placeholder: "Phone number",
    },
    NOTE_FIELD,
  ];

  return (
    <div className="space-y-6">
      {/* Basic */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink">Basic</h2>
        <div className="space-y-4">
          <ComplianceItemCard
            title="Driver's License"
            rows={[
              { label: "Number", value: na(c.license.number) },
              {
                label: "Expires",
                value: c.license.expiryDate
                  ? formatDate(c.license.expiryDate)
                  : "N/A",
              },
              { label: "Province/State", value: na(c.license.provinceState) },
            ]}
            status={expiryStatus(c.license.expiryDate)}
            fields={licenseFields}
          />

          <ComplianceItemCard
            title="Passport"
            rows={[
              { label: "Number", value: na(c.passport.number) },
              { label: "Country", value: na(c.passport.country) },
              {
                label: "Expires",
                value: c.passport.expiryDate
                  ? formatDate(c.passport.expiryDate)
                  : "N/A",
              },
            ]}
            status={expiryStatus(c.passport.expiryDate)}
            fields={passportFields}
          />

          <ComplianceItemCard
            title="Emergency Contact"
            rows={[
              { label: "Name", value: c.emergencyContact.name ?? "Not set" },
              {
                label: "Relationship",
                value: na(c.emergencyContact.relationship),
              },
              { label: "Phone", value: na(c.emergencyContact.phone) },
            ]}
            fields={emergencyFields}
          />
        </div>
      </section>

      <DocumentsSection documents={c.documents} />
      <CertificationsSection certifications={c.certifications} />
    </div>
  );
}
