/**
 * Mock backend — demo user "database".
 *
 * This file is the BACKEND side of the mockup. The frontend never imports
 * it directly; it goes through the service layer in `lib/api/*`. Replace
 * this file with real API calls when the TrackSmart backend is connected
 * (see docs/architecture.md).
 */
import type { Role } from "@/lib/constants";

export type DemoUser = {
  id: string;
  name: string;
  /** Job title, shown in the demo-user picker. */
  jobTitle: string;
  email: string;
  role: Role;
};

/** Shared password for every demo account. Prototype only. */
export const DEMO_PASSWORD = "demo1234";

/** Seed data — one account per role. */
export const demoUsers: DemoUser[] = [
  {
    id: "u-business-1",
    name: "Olivia Chen",
    jobTitle: "Dispatch Manager",
    email: "olivia@tracksmart.demo",
    role: "business",
  },
  {
    id: "u-driver-1",
    name: "Marcus Reed",
    jobTitle: "Long-haul Driver",
    email: "marcus@tracksmart.demo",
    role: "driver",
  },
  {
    id: "u-carrier-1",
    name: "Priya Nair",
    jobTitle: "Carrier Operations",
    email: "priya@tracksmart.demo",
    role: "carrier",
  },
];
