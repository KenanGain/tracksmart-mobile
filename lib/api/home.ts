/**
 * Home service — the data the Home screen renders.
 *
 * Frontend ⇄ this file ⇄ lib/data/* (mock backend).
 *
 * Compliance data lives in `lib/api/compliance.ts`; the Home screen pulls
 * its compliance summary from there directly.
 */
import { company, type Company } from "@/lib/data/company";
import { payrolls, shifts, type Payroll, type Shift } from "@/lib/data/home";

/** The carrier / business the signed-in user belongs to. */
export async function getCompany(): Promise<Company> {
  return company;
}

/** Payroll records available to the signed-in user. */
export async function getPayrolls(): Promise<Payroll[]> {
  return payrolls;
}

/** Upcoming scheduled shifts. */
export async function getShifts(): Promise<Shift[]> {
  return shifts;
}
