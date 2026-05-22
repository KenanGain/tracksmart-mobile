/**
 * Mock backend — driver trips and their itinerary stops.
 *
 * Backend side of the mockup; the frontend reaches these through
 * `lib/api/trips.ts`.
 */
export type TripStopKind =
  | "acquire"
  | "hook"
  | "pickup"
  | "deliver"
  | "check-call";

export type TripStop = {
  id: string;
  kind: TripStopKind;
  /** "Guelph, On" */
  location: string;
  completed: boolean;
  address: string;
  email: string;
  directions: string;
  /** Power unit number, when relevant. */
  powerUnit: string | null;
  /** Probill number, when relevant. */
  probill: string | null;
};

export type Trip = {
  id: string;
  startDate: string;
  leadDriver: string;
  teamDriver: string;
  dispatchedBy: string;
  issuedOn: string;
  stops: TripStop[];
};

const TRANSPLUS_ADDRESS =
  "Transplus Systems Corp., 44 Corporate Crt., Guelph, On, N1G 5G5, Canada";

export const currentTrip: Trip = {
  id: "T000508",
  startDate: "Oct 05, 2023 11:32 AM",
  leadDriver: "Jessica Vee",
  teamDriver: "",
  dispatchedBy: "Terry",
  issuedOn: "Oct 05, 2023 11:32 AM",
  stops: [
    {
      id: "stop-1",
      kind: "acquire",
      location: "Guelph, On",
      completed: true,
      address: TRANSPLUS_ADDRESS,
      email: "support7@transpluscorp.com",
      directions: "Directions go here!",
      powerUnit: "1116",
      probill: null,
    },
    {
      id: "stop-2",
      kind: "hook",
      location: "Guelph, On",
      completed: true,
      address: TRANSPLUS_ADDRESS,
      email: "support7@transpluscorp.com",
      directions: "Directions go here!",
      powerUnit: "1116",
      probill: null,
    },
    {
      id: "stop-3",
      kind: "pickup",
      location: "Guelph, On",
      completed: true,
      address: TRANSPLUS_ADDRESS,
      email: "support7@transpluscorp.com",
      directions: "Directions go here!",
      powerUnit: null,
      probill: "P001333",
    },
    {
      id: "stop-4",
      kind: "deliver",
      location: "Varennes, Qc",
      completed: true,
      address: "1500 Rue Marie-Victorin, Varennes, Qc, J3X 1P7, Canada",
      email: "dock@varennes-depot.com",
      directions: "Dock 4 — ring on arrival.",
      powerUnit: null,
      probill: "P001333",
    },
    {
      id: "stop-5",
      kind: "pickup",
      location: "Varennes, Qc",
      completed: false,
      address: "1500 Rue Marie-Victorin, Varennes, Qc, J3X 1P7, Canada",
      email: "dock@varennes-depot.com",
      directions: "Directions go here!",
      powerUnit: null,
      probill: "P001334",
    },
    {
      id: "stop-6",
      kind: "check-call",
      location: "Mississauga, On",
      completed: false,
      address: "Mississauga, On, Canada",
      email: "dispatch@tracksmart.demo",
      directions: "Call dispatch on arrival.",
      powerUnit: null,
      probill: null,
    },
  ],
};

export const upcomingTrips: Trip[] = [];

export const previousTrips: Trip[] = [
  {
    id: "T000493",
    startDate: "Oct 02, 2023 12:09 PM",
    leadDriver: "Jessica Vee",
    teamDriver: "",
    dispatchedBy: "Terry",
    issuedOn: "Oct 02, 2023 12:09 PM",
    stops: [],
  },
];
