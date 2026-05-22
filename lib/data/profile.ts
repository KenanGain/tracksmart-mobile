/**
 * Mock backend — the signed-in driver's profile.
 *
 * Backend side of the mockup; the frontend reaches this through
 * `lib/api/profile.ts`.
 */
export type DriverProfile = {
  name: string;
  /** Display role — business / driver / carrier. */
  role: string;
  /** Carrier / company the driver works for. */
  organization: string;
  email: string;
  phone: string;
  /** Employee / driver number. */
  employeeId: string;
  /** Assigned power unit. */
  vehicle: string;
  /** Two-letter monogram used where there is no avatar image. */
  initials: string;
};

export const driverProfile: DriverProfile = {
  name: "Jessica Vee",
  role: "Driver",
  organization: "Transplus Systems Corp.",
  email: "jessica.vee@transpluscorp.com",
  phone: "(519) 555-0142",
  employeeId: "DRV-1116",
  vehicle: "Power Unit 1116",
  initials: "JV",
};
