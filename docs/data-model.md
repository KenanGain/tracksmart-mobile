---
title: Data model
type: doc
tags: [data-model, types]
---

# Data model

> The entities the mobile view renders. Field names and enum values are
> **shared** between the Next.js app and the Flutter mirror — do not rename
> them in one without the other.

> [!note] Scaffold stage
> These are *intended* shapes for planning. Confirm them against the existing
> web application's real API before implementing the data layer.

## Enums

```ts
type Role = "business" | "driver" | "carrier";

type TripStatus = "planned" | "active" | "delayed" | "completed" | "cancelled";

type LoadStatus =
  | "available"
  | "assigned"
  | "in_transit"
  | "delivered"
  | "declined";

type StopType = "pickup" | "dropoff" | "waypoint";

// Implemented kinds for a TripStop (lib/data/trips.ts).
type TripStopKind = "acquire" | "hook" | "pickup" | "drop-off";

type CalendarEventKind =
  | "delivery"
  | "pickup"
  | "meeting"
  | "maintenance"
  | "reminder";
```

## Entities

### User
| Field | Type | Notes |
|-------|------|-------|
| `id` | string | |
| `name` | string | |
| `role` | `Role` | Drives role-aware UI |
| `organisationId` | string | |
| `phone` | string? | |

### Vehicle
| Field | Type | Notes |
|-------|------|-------|
| `id` | string | |
| `label` | string | e.g. "Truck 12" |
| `plate` | string | |
| `capacityKg` | number | |
| `carrierId` | string | Owning carrier |

### Trip
| Field | Type | Notes |
|-------|------|-------|
| `id` | string | |
| `reference` | string | Human-facing code |
| `status` | `TripStatus` | |
| `origin` | string | Place label |
| `destination` | string | Place label |
| `scheduledStart` | ISO datetime | |
| `scheduledEnd` | ISO datetime | |
| `driverId` | string? | Assigned driver |
| `vehicleId` | string? | |
| `stops` | `Stop[]` | Ordered |
| `loadIds` | string[] | Attached loads |

### Stop
| Field | Type | Notes |
|-------|------|-------|
| `id` | string | |
| `type` | `StopType` | |
| `address` | string | |
| `lat` / `lng` | number | For the map view |
| `windowStart` | ISO datetime? | Time window |
| `windowEnd` | ISO datetime? | |
| `sequence` | number | Order in the trip |

### Load
| Field | Type | Notes |
|-------|------|-------|
| `id` | string | |
| `reference` | string | |
| `status` | `LoadStatus` | |
| `pickupStopId` | string | |
| `dropoffStopId` | string | |
| `weightKg` | number | |
| `description` | string | |
| `tripId` | string? | Trip it belongs to |
| `documentUrl` | string? | Uploaded on pickup / delivery |

### Compliance
The signed-in user's documents profile (rendered by `/compliance`). A
`null` field means "not on file yet".

| Field | Type | Notes |
|-------|------|-------|
| `holderName` | string | Licence holder |
| `initials` | string | Avatar initials |
| `license` | `LicenseInfo` | `number`, `expiryDate` (ISO), `provinceState` |
| `passport` | `PassportInfo` | `number`, `country`, `expiryDate` (ISO) |
| `emergencyContact` | `EmergencyContact` | `name`, `relationship`, `phone` |
| `documents` | `ComplianceDocument[]` | Uploaded supporting files |
| `certifications` | `Certification[]` | Training / test certifications |

`Certification`: `name`, `category` (`drug_test` \| `road_test`), `result`
(`pass` \| `fail`), `expiryDate` (ISO, nullable), `note` (nullable).

### DriverProfile
The signed-in driver, rendered by the "My Account" drawer and its
sub-screens. Mock: `lib/data/profile.ts`.

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | |
| `role` | string | Display role |
| `organization` | string | Carrier / company |
| `email` | string | |
| `phone` | string | |
| `employeeId` | string | Driver number |
| `vehicle` | string | Assigned power unit |
| `initials` | string | Avatar monogram |

### Shift
A scheduled working shift, shown on the Calendar. Mock:
`lib/data/schedule.ts`.

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | |
| `date` | ISO date | `YYYY-MM-DD` |
| `label` | string | e.g. "Day Shift" |
| `startTime` | string | Display time |
| `endTime` | string | Display time |
| `location` | string | Report-from location |

### ClockRecord
A clock in/out record — the Calendar timesheet source. Mock:
`lib/data/schedule.ts`.

| Field | Type | Notes |
|-------|------|-------|
| `date` | ISO date | `YYYY-MM-DD` |
| `clockIn` | string | Display time |
| `clockOut` | string? | `null` while still on the clock |
| `hours` | number? | `null` while the shift is open |

### CalendarEvent
An event on the driver's calendar. Mock: `lib/data/calendar-events.ts`.

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | |
| `date` | ISO date | `YYYY-MM-DD` |
| `title` | string | |
| `time` | string | Display time |
| `kind` | `CalendarEventKind` | Drives the colour accent |

### Contact
A person the driver can message — backs the New Chat contact list. Mock:
`lib/data/contacts.ts`.

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Reused as the conversation id |
| `name` | string | |
| `role` | string | Job title |
| `initials` | string | Avatar monogram |

## Relationships

```
Organisation 1─┬─* User
               └─* Carrier ──* Vehicle
Trip *──1 Driver(User)
Trip *──1 Vehicle
Trip 1──* Stop
Trip 1──* Load
Load *──1 Stop (pickup)
Load *──1 Stop (dropoff)
```

## Where types live

Each entity's TypeScript type is exported from its `lib/data/*.ts` module
(the mock backend) — e.g. `Trip` / `TripStop` from `lib/data/trips.ts`,
`Contact` from `lib/data/contacts.ts`. The matching `lib/api/*.ts` service
module re-uses those types. The Flutter mirror defines the same shapes as
Dart classes in `lib/models/` — see [[prompts/flutter]].

## Related

[[design]] · [[architecture]] · [[screens]]
