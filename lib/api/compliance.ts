/**
 * Compliance service — data for the Home compliance card and the
 * /compliance detail screen.
 *
 * Frontend ⇄ this file ⇄ lib/data/compliance.ts (mock backend).
 */
import { compliance, type Compliance } from "@/lib/data/compliance";

/** Compact compliance info for the Home-screen card. */
export type ComplianceSummary = {
  holderName: string;
  initials: string;
  licenseNo: string;
  /** Count of basic items that have data (licence, passport, contact). */
  itemCount: number;
  /** Licence expiry — ISO date, or null when not on file. */
  expiryDate: string | null;
  allValid: boolean;
};

/** Full compliance profile — for the /compliance detail screen. */
export async function getCompliance(): Promise<Compliance> {
  return compliance;
}

/** Derived summary — for the Home screen's compliance card. */
export async function getComplianceSummary(): Promise<ComplianceSummary> {
  const c = compliance;
  const basicItemsSet = [
    c.license.number,
    c.passport.number,
    c.emergencyContact.name,
  ].filter(Boolean).length;

  return {
    holderName: c.holderName,
    initials: c.initials,
    licenseNo: c.license.number ?? "N/A",
    itemCount: basicItemsSet,
    expiryDate: c.license.expiryDate,
    allValid: true, // mock — refine with real expiry checks later
  };
}
