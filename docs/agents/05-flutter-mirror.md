---
title: Flutter Mirror Spec
type: living-document
agent: flutter
status: living-document
tags: [flutter, mirror, spec, build-plan, mobile]
updated: 2026-05-22
---

# 🦋 Flutter Mirror Spec — TrackSmart Mobile

> [!abstract] What this file is
> A **living build plan** for the Stage-2 Flutter native app. Every time a screen is implemented in Next.js, its Flutter equivalent is described here in the same change (**dual-output rule** — see [[agents/01-shared-context]] §3). When Stage 2 begins, this file is already a complete, screen-by-screen Flutter spec.

> [!important] How to use this file
> - **Implementing in Next.js?** After the screen works, add/update its section below
> - **Starting Flutter Stage 2?** Read this file top-to-bottom — it is your build plan
> - **Source file:** this note mirrors `prompts/flutter.md` in the repo (they are kept in sync)

---

## Global Setup

### Dependencies (`pubspec.yaml`)
```yaml
dependencies:
  flutter: sdk: flutter
  go_router: ^14.0.0          # routing (mirrors Next.js App Router)
  riverpod: ^2.5.0            # state (mirrors React Server + useState)
  flutter_riverpod: ^2.5.0
  cached_network_image: ^3.3.0
  flutter_map: ^7.0.0         # Leaflet equivalent
  latlong2: ^0.9.0            # lat/lng types for flutter_map
  intl: ^0.19.0               # date formatting (mirrors lib/format.ts)
```

### Routing (`go_router`) — mirrors Next.js App Router

```dart
GoRouter(
  initialLocation: '/auth/sign-in',
  routes: [
    GoRoute(path: '/auth/sign-in', builder: (_,__) => const SignInScreen()),

    // Shell route = AppShell with BottomNavigationBar
    ShellRoute(
      builder: (_, __, child) => AppShell(child: child),
      routes: [
        GoRoute(path: '/home',     builder: (_,__) => const HomeScreen()),
        GoRoute(path: '/trips',    builder: (_,__) => const TripsScreen()),
        GoRoute(path: '/bulletin', builder: (_,__) => const BulletinScreen()),
        GoRoute(path: '/calendar', builder: (_,__) => const ScheduleScreen()),
        GoRoute(path: '/chats',    builder: (_,__) => const ChatsScreen()),
        // Detail routes inside shell:
        GoRoute(path: '/trips/:id',      builder: (_,s) => TripDetailScreen(id: s.pathParameters['id']!)),
        GoRoute(path: '/compliance',     builder: (_,__) => const ComplianceScreen()),
        GoRoute(path: '/account/settings',    builder: (_,__) => const SettingsScreen()),
        GoRoute(path: '/account/trip-history',builder: (_,__) => const TripHistoryScreen()),
        GoRoute(path: '/account/about',       builder: (_,__) => const AboutScreen()),
      ],
    ),

    // Full-screen routes (no shell):
    GoRoute(path: '/notifications',     builder: (_,__) => const NotificationsScreen()),
    GoRoute(path: '/expenses',          builder: (_,__) => const ExpenseStatusScreen()),
    GoRoute(path: '/expenses/new',      builder: (_,__) => const SubmitExpenseScreen()),
    GoRoute(path: '/trip-sheets',       builder: (_,__) => const TripSheetStatusScreen()),
    GoRoute(path: '/trip-sheets/new',   builder: (_,__) => const SubmitTripSheetScreen()),
    GoRoute(path: '/chat/:id',          builder: (_,s) => ChatThreadScreen(id: s.pathParameters['id']!)),
  ],
)
```

### Theme (`ThemeData`) — mirrors Tailwind tokens

```dart
ThemeData(
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFF1D4ED8),  // brand
    primary:   const Color(0xFF1D4ED8),  // brand
    surface:   const Color(0xFFFFFFFF),  // surface
    background:const Color(0xFFF8FAFC),  // surface-muted
    error:     const Color(0xFFDC2626),  // danger
  ),
  cardTheme: CardTheme(
    elevation: 1,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    color: Colors.white,
  ),
)
```

### AppShell (`components/shell/AppShell.tsx` → `AppShell` widget)

```dart
class AppShell extends StatelessWidget {
  final Widget child;

  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.route_outlined), label: 'Trips'),
          BottomNavigationBarItem(icon: Icon(Icons.campaign_outlined), label: 'Bulletin'),
          BottomNavigationBarItem(icon: Icon(Icons.calendar_today_outlined), label: 'Schedule'),
          BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_outline), label: 'Chats'),
        ],
        selectedItemColor: Theme.of(context).colorScheme.primary,
      ),
    );
  }
}
```

### Repository Layer — mirrors `lib/api/*`

```dart
// lib/repositories/trips_repository.dart
abstract class TripsRepository {
  Future<List<Trip>> getTrips();
  Future<Trip> getTrip(String id);
}

// lib/repositories/mock/mock_trips_repository.dart
// (mirrors lib/data/trips.ts — replaced by real HTTP client in Stage 2)
```

---

## Screen Mirrors

---

### 🔐 Sign In `/auth/sign-in`

**go_router route:** `/auth/sign-in`

**Widget tree:**
```
Scaffold (no AppBar)
  SafeArea
    SingleChildScrollView
      Column
        SizedBox(height)
        _BrandBlock (logo tile + AppName + tagline)
        Card
          Column
            Text("Sign in to your account")
            _DemoUserDropdown (DropdownButtonFormField)
            _OrDivider
            TextFormField (email)
            TextFormField (password, obscureText + visibility toggle)
            Text("Demo password: demo1234")
            ElevatedButton("Sign In")
        Text("Prototype build…")
```

**Repository:** `AuthRepository.signIn(email, password)` → navigates to `/home` on success

**Tokens:**
- Logo tile: `BoxDecoration(color: Color(0xFF0F172A), borderRadius: BorderRadius.circular(16))`
- Sign In button: `ElevatedButton` with `backgroundColor: primary`

---

### 🏠 Home `/home`

**go_router route:** `/home` (inside ShellRoute)

**Widget tree:**
```
CustomScrollView
  SliverPadding
    SliverList
      _CompanyCard         (carrier logo monogram + name)
      _ComplianceCard      (tap → /compliance)
      _ActionCard("Expenses", submit/status buttons)
      _ActionCard("Maintenance Requests")
      _ActionCard("Trip Sheets")
      _PayrollCard
      _TimeTrackingCard    (clock in/out toggle + elapsed timer)
      _RefreshHelpRow
      _LogoutButton
```

**Repository:** `HomeRepository.getHomeData()` → `FutureProvider<HomeData>`

**Tokens:**
- Card background: `Theme.of(context).cardColor` (white)
- Page background: `Theme.of(context).colorScheme.background`
- Submit button: `ElevatedButton` (brand blue)
- Logout button: `OutlinedButton` (danger red)

**Key behaviours:**
- Time tracking: `Timer.periodic(Duration(seconds: 1), ...)` while clocked in (mirrors `setInterval`)
- Logout shows `AlertDialog` confirmation

---

### 🛣️ Trips `/trips`

**go_router route:** `/trips` (inside ShellRoute)

**Widget tree:**
```
CustomScrollView
  SliverList
    _TripSection("Current Trip", [Trip])
    _TripSection("Upcoming Trips", [Trip])
    _TripSection("Previous Trips", [Trip])

// _TripSection:
ExpansionTile (collapsible, count badge)
  _TripCard for each trip

// _TripCard:
Card
  Column
    Row (trip ref + StatusBadge)
    Text (origin → destination)
    Text (date window)
    _MetaRow (stops · power unit · equipment)
    _TripMapPreview (FlutterMap, non-interactive thumbnail)
    TextButton("View trip →")  → go to /trips/:id
```

**Repository:** `TripsRepository.getTrips()` → `FutureProvider<TripsData>`

**Map:** `FlutterMap` with `TileLayer(urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png')` + `PolylineLayer` + `MarkerLayer`

**Tokens:**
- "In Progress" badge: `Chip(backgroundColor: primary, label: Text("In Progress", style: TextStyle(color: white)))`
- Countdown badge: amber `Chip`

---

### 📋 Trip Detail `/trips/:id`

**go_router route:** `/trips/:id`

**Widget tree:**
```
Scaffold
  AppBar (back button + "Trip <id>")
  CustomScrollView
    _TripSummaryCard (route map)
    _TripProgressStrip (LinearProgressIndicator + done/total)
    _DispatchNoteCard
    _TripDetailsCard (equipment, driver, dispatcher)
    _StopTimeline
      _StopRow for each stop (3 states: done/next/upcoming)
        // Expandable detail:
        ExpansionTile
          _StopDetail (address, times, refs, contacts)
          // Freight stops additionally:
          TextFormField (odometer)
          OutlinedButton("Upload Document")
          ElevatedButton("Mark as Completed")
```

**Repository:** `TripsRepository.getTrip(id)` → `FutureProvider.family<Trip, String>`

---

### 📢 Bulletin `/bulletin`

**go_router route:** `/bulletin`

**Widget tree:**
```
Column
  SearchBar
  Expanded
    ListView.builder
      _LoadTenderCard for each tender
        // Before action:
        Column (sender, route, pickup/delivery)
        Row (ElevatedButton("Accept"), OutlinedButton("Decline"))
        // After action:
        Chip(status badge)
        ExpansionTile (full detail)
```

**Repository:** `BulletinRepository.getLoadTenders()` → `StateNotifierProvider`

---

### 📅 Schedule `/calendar`

**go_router route:** `/calendar`

**Widget tree:**
```
Column
  ToggleButtons (Calendar | List)
  Expanded
    // Calendar view:
    Column
      _MonthHeader (prev/next buttons)
      TableCalendar or custom GridView
      _DayDetail (Events + Shifts + Timesheet for selected day)
    // List view:
    ListView.builder (date-grouped agenda)
      _AgendaDateHeader
      _AgendaRow (icon chip, title, kind tag)
```

**Repository:** `ScheduleRepository.getScheduleData()` → `FutureProvider`

---

### 💬 Chats `/chats`

**go_router route:** `/chats`

**Widget tree:**
```
Column
  SearchBar
  Expanded
    ListView.builder
      _ConversationTile (avatar, name, last message, time, unread dot)
  FloatingActionButton("New chat")
    → showModalBottomSheet: _ContactPicker (searchable list)
```

**Repository:** `ChatsRepository.getConversations()` + `getContacts()`

---

### 💬 Chat Thread `/chat/:id`

**go_router route:** `/chat/:id` (full-screen, no shell)

**Widget tree:**
```
Scaffold
  AppBar (back + contact name)
  Column
    Expanded
      ListView.builder (reversed)
        _MessageBubble (incoming: grey, outgoing: brand blue)
        _DayDivider
    _MessageInputBar (TextField + attach + send)
```

---

### 🔔 Notifications `/notifications`

**go_router route:** `/notifications` (full-screen, no shell)

**Widget tree:**
```
Scaffold
  AppBar (back + "Notifications")
  Column
    SearchBar
    Expanded
      ListView.builder
        _NotificationRow (icon chip, title+time, message, unread dot)
```

---

### 📄 Compliance `/compliance`

**go_router route:** `/compliance` (inside shell, detail route)

**Widget tree:**
```
CustomScrollView
  _ComplianceSectionHeader("Basic")
    _DocumentCard("Driver's License", fields, "Update" button)
    _DocumentCard("Passport", fields, "Update" button)
    _DocumentCard("Emergency Contact", fields, "Update" button)
  _ComplianceSectionHeader("Documents")
    ElevatedButton("Add") → showModalBottomSheet(_AddDocumentSheet)
  _ComplianceSectionHeader("Certifications")
    ElevatedButton("Add") → showModalBottomSheet(_AddCertificationForm)
```

---

### 💸 Submit Expense `/expenses/new`

**go_router route:** `/expenses/new` (full-screen, no shell)

**Widget tree:**
```
Scaffold
  AppBar (back + "Submit Expense" + "Step N/5")
  Stepper (linear, 5 steps)
    Step 1: _ExpenseTypeStep (Radio buttons)
    Step 2: _AddReceiptStep (grid of capture options)
    Step 3: _ExpenseDetailsStep (amount, currency, description, vendor)
    Step 4: _ExpenseCategoryStep (Radio + truck search)
    Step 5: _ReviewSubmitStep (summary + ElevatedButton)
```

---

### 💸 Expense Status `/expenses`

**go_router route:** `/expenses` (full-screen, no shell)

**Widget tree:**
```
Scaffold
  AppBar (back + "Expense Status")
  ListView.builder
    _ExpenseRow (description, amount, date, StatusBadge)
```

---

### ⚙️ Settings `/account/settings`

**go_router route:** `/account/settings`

**Widget tree:**
```
Scaffold
  AppBar (back + "Settings")
  ListView
    _SectionHeader("Notifications")
    SwitchListTile("Trip")
    SwitchListTile("Message")
    SwitchListTile("Bulletin")
    SwitchListTile("Calendar")
    _SectionHeader("Appearance")
    ListTile("Font Size", trailing: Text(currentValue))   → cycles on tap
    ListTile("Theme", trailing: Text(currentValue))       → cycles on tap
```

---

## Component Mapping Reference

| Next.js Component | Flutter Widget |
|-------------------|----------------|
| `AppShell` | `ShellRoute` + custom `AppShell` + `BottomNavigationBar` |
| `TopBar` | `AppBar` (customised) |
| `BottomNav` | `BottomNavigationBar` |
| `BottomSheet` | `showModalBottomSheet` |
| `StatusBadge` | Custom `Chip` widget |
| `Icon` | `Icon` (Material) or custom SVG via `flutter_svg` |
| `TripMap` / `TripMapLeaflet` | `FlutterMap` + `TileLayer` + `PolylineLayer` + `MarkerLayer` |
| `ScreenPlaceholder` | `Center(child: Column([Text, Text, ...]))` |
| Form fields | `TextFormField` inside `Form` |
| `AccountDrawer` | `Drawer` opened from `AppBar` action |

---

## 🔗 Related

[[agents/00-agents-home]] · [[agents/01-shared-context]] · [[06-roadmap]] · [[02-screens]]
