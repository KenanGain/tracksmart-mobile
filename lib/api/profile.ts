/**
 * Profile service — the signed-in driver's profile.
 *
 * Frontend ⇄ this file ⇄ lib/data/profile.ts (mock backend).
 */
import { driverProfile, type DriverProfile } from "@/lib/data/profile";

/** The signed-in driver's profile. */
export async function getProfile(): Promise<DriverProfile> {
  return driverProfile;
}
