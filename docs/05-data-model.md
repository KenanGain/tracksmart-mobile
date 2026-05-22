---
title: Data Model
type: doc
tags: [data-model, types, typescript, entities]
updated: 2026-05-22
---

# 🗄️ Data Model — TrackSmart Mobile

> [!abstract] Purpose
> The entities the mobile view renders. Field names and enum values are **shared** between the Next.js app and the Flutter mirror — never rename them in one without updating the other.

> [!warning] Verify against the real API
> These shapes are used by the mock data layer. Confirm field names and types against the real TrackSmart backend API before replacing `lib/data/` with real fetch calls.

---

## Enums

```typescript
// User role — drives role-aware UI
type Role = "business" | "driver" | "carrier";

// Trip lifecycle state
type TripStatus = "planned" | "active" | "delayed" | "completed" | "cancelled";

// Load lifecycle state
type LoadStatus =
  | "available"
  | "assigned"
  | "in_transit"
  | "delivered"
  | "declined";

// Trip stop kinds (implemented in lib/data/trips.ts)
type TripStopKind =
  | "acquire" | "hook" | "docking" | "loading" | "unloading"
  | "pickup"  | "deliver" | "drop-off" | "check-call";

// Calendar event category
type CalendarEventKind =
  | "delivery" | "pickup" | "meeting" | "maintenance" | "reminder";

// Maintenance request
type AssetType = "Truck" | "Trailer";
type WorkOrderPriority = "Low" | "Medium" | "High" | "Critical";

// Expense
type ExpenseStatus = "Pending" | "Approved" | "Rejected";
type ExpenseType = "Payroll Addition" | "Company Paid";
type ExpenseCategory = "Truck" | "Trailer" | "General";

// Certification
type CertificationResult = "pass" | "fail";
type CertificationCategory = "drug_test" | "road_test";
```

---

## Entities

### 👤 User / Driver

```typescript
interface User {
  id: string;
  name: string;
  role: Role;
  organisationId: string;
  phone?: string;
  email: string;
}
```

### 🚛 Vehicle

```typescript
interface Vehicle {
  id: string;
  label: string;       // e.g. "Truck 001"
  plate: string;
  capacityKg: number;
  carrierId: string;
}
```

### 🗺️ Trip

The core entity of the app.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | e.g. "TRIP-001" |
| `reference` | `string` | Human-facing code e.g. "12851" |
| `status` | `TripStatus` | Drives status badge colour |
| `origin` | `string` | City/place label |
| `destination` | `string` | City/place label |
| `scheduledStart` | `string` (ISO) | |
| `scheduledEnd` | `string` (ISO) | |
| `driverId` | `string?` | Assigned driver |
| `vehicleId` | `string?` | Power unit |
| `stops` | `TripStop[]` | Ordered stop timeline |
| `loadIds` | `string[]` | Attached load references |
| `dispatchNote` | `string?` | Note from dispatcher |

### 📍 TripStop

```typescript
interface TripStop {
  id: string;
  kind: TripStopKind;
  address: string;
  lat: number;
  lng: number;
  appointmentDate?: string;  // ISO date
  appointmentTime?: string;  // display time
  sequence: number;          // position in stop timeline
  status: "done" | "next" | "upcoming";
  // Freight stops only:
  pickupNumber?: string;
  dropOffNumber?: string;
  temperature?: string;
  phone?: string;
  email?: string;
  equipment?: string;
  trailer?: string;
  note?: string;
}
```

### 📦 Load

```typescript
interface Load {
  id: string;
  reference: string;
  status: LoadStatus;
  pickupStopId: string;
  dropoffStopId: string;
  weightKg: number;
  description: string;
  tripId?: string;
  documentUrl?: string;   // uploaded on pickup/delivery
}
```

### 📢 LoadTender (Bulletin)

```typescript
interface LoadTender {
  id: string;
  sender: string;
  time: string;          // display time
  unread: boolean;
  route: string;         // "City A → City B"
  pickupDate: string;
  deliveryDate: string;
  pickupAddress: string;
  deliveryAddress: string;
  status?: "accepted" | "declined";  // after action
}
```

### 📄 Compliance

```typescript
interface ComplianceData {
  holderName: string;
  initials: string;
  license: {
    number: string;
    expiryDate: string;   // ISO
    provinceState: string;
  };
  passport: {
    number: string;
    country: string;
    expiryDate: string;   // ISO
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  documents: ComplianceDocument[];
  certifications: Certification[];
}

interface Certification {
  name: string;
  category: CertificationCategory;
  result: CertificationResult;
  expiryDate?: string;   // ISO, nullable
  note?: string;
}
```

### 👤 DriverProfile (Account Drawer)

```typescript
interface DriverProfile {
  name: string;
  role: string;           // Display role
  organization: string;   // Carrier name
  email: string;
  phone: string;
  employeeId: string;
  vehicle: string;        // Power unit label
  initials: string;       // Avatar monogram
}
```

### 📅 Shift

```typescript
interface Shift {
  id: string;
  date: string;      // YYYY-MM-DD
  label: string;     // e.g. "Day Shift"
  startTime: string; // display time
  endTime: string;
  location: string;
}
```

### ⏱️ ClockRecord

```typescript
interface ClockRecord {
  date: string;       // YYYY-MM-DD
  clockIn: string;    // display time
  clockOut?: string;  // null while still on the clock
  hours?: number;     // null while shift is open
}
```

### 📆 CalendarEvent

```typescript
interface CalendarEvent {
  id: string;
  date: string;   // YYYY-MM-DD
  title: string;
  time: string;   // display time
  kind: CalendarEventKind;
}
```

### 💬 Conversation & Message

```typescript
interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  initials: string;
}

interface Message {
  id: string;
  conversationId: string;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;   // true = outgoing (blue bubble)
}
```

### 👥 Contact

```typescript
interface Contact {
  id: string;      // Reused as conversation id
  name: string;
  role: string;    // Job title
  initials: string;
}
```

### 💸 Expense

```typescript
interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: "USD" | "CAD";
  type: ExpenseType;
  category: ExpenseCategory;
  status: ExpenseStatus;
  submittedDate: string;   // ISO
}
```

### 🔔 Notification

```typescript
interface Notification {
  id: string;
  kind: "trip_changed" | "itinerary_changed";
  title: string;
  message: string;
  time: string;
  unread: boolean;
}
```

---

## Entity Relationships

```
Organisation 1──┬──* User
                └──* Vehicle
Trip    *──1 Driver (User)
Trip    *──1 Vehicle
Trip    1──* TripStop
Trip    1──* Load
Load    *──1 TripStop (pickup)
Load    *──1 TripStop (dropoff)
Conversation 1──* Message
Conversation *──1 Contact
```

---

## Where Types Live

| Entity | TypeScript types in | Mock data in |
|--------|---------------------|-------------|
| Trip, TripStop | `lib/data/trips.ts` | `lib/data/trips.ts` |
| LoadTender | `lib/data/bulletin.ts` | `lib/data/bulletin.ts` |
| Conversation, Message | `lib/data/chats.ts` | `lib/data/chats.ts` |
| Contact | `lib/data/contacts.ts` | `lib/data/contacts.ts` |
| Shift, ClockRecord | `lib/data/schedule.ts` | `lib/data/schedule.ts` |
| CalendarEvent | `lib/data/calendar-events.ts` | `lib/data/calendar-events.ts` |
| DriverProfile | `lib/data/profile.ts` | `lib/data/profile.ts` |
| ComplianceData | `lib/data/compliance.ts` | `lib/data/compliance.ts` |
| Expense | `lib/data/expenses.ts` | `lib/data/expenses.ts` |
| Notification | `lib/data/notifications.ts` | `lib/data/notifications.ts` |
| User (auth) | `lib/data/users.ts` | `lib/data/users.ts` |

> [!tip] Flutter mirror
> The Flutter app defines the same shapes as Dart classes in `lib/models/`. See [[agents/05-flutter-mirror]] for the mapping.

---

## 🔗 Related

[[00-home]] · [[04-architecture]] · [[02-screens]] · [[agents/05-flutter-mirror]]
