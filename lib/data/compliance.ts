/**
 * Mock backend — the signed-in user's full compliance profile.
 *
 * Backend side of the mockup. The frontend reaches this through
 * `lib/api/compliance.ts`, never directly. `null` means "not on file yet".
 */
export type LicenseInfo = {
  number: string | null;
  /** ISO date (YYYY-MM-DD). */
  expiryDate: string | null;
  provinceState: string | null;
};

export type PassportInfo = {
  number: string | null;
  country: string | null;
  /** ISO date (YYYY-MM-DD). */
  expiryDate: string | null;
};

export type EmergencyContact = {
  name: string | null;
  relationship: string | null;
  phone: string | null;
};

export type ComplianceDocument = {
  id: string;
  name: string;
};

export type CertificationCategory = "drug_test" | "road_test";
export type CertificationResult = "pass" | "fail";

export type Certification = {
  id: string;
  name: string;
  category: CertificationCategory;
  result: CertificationResult;
  /** ISO date (YYYY-MM-DD). */
  expiryDate: string | null;
  note: string | null;
};

export type Compliance = {
  holderName: string;
  /** Avatar initials. */
  initials: string;
  license: LicenseInfo;
  passport: PassportInfo;
  emergencyContact: EmergencyContact;
  /** Uploaded supporting documents. */
  documents: ComplianceDocument[];
  /** Training / test certifications. */
  certifications: Certification[];
};

export const compliance: Compliance = {
  holderName: "Jagdeep Singh Shipra",
  initials: "JS",
  license: {
    number: "123456789",
    expiryDate: "2026-11-17",
    provinceState: null,
  },
  passport: { number: null, country: null, expiryDate: null },
  emergencyContact: { name: null, relationship: null, phone: null },
  documents: [],
  certifications: [],
};
