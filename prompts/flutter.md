---
title: Flutter mirror spec
type: prompt
agent: flutter
status: living-document
tags: [prompt, flutter, transition]
updated: 2026-05-22
---

# Flutter Mirror Spec — TrackSmart Mobile

> [!abstract] What this file is
> A **living build plan** for the Stage-2 Flutter native app. Every time a screen is implemented in Next.js, its Flutter equivalent is described here in the same change (the **dual-output rule** — [[shared-context]] §3). When Stage 2 begins, this file is already a complete, screen-by-screen Flutter spec.

> [!important] How to use this file
> - **Implementing in Next.js?** After the screen works, add/update its section below.
> - **Building Flutter?** Implement screens top-to-bottom from the Screen mirrors section.
> - **Obsidian copy:** `docs/agents/05-flutter-mirror.md` (same content, kept in sync)

---

## 1. Flutter Stack

| Concern | Choice | Mirrors (Next.js) |
|---------|--------|-------------------|
| Framework | Flutter 3.x / Dart 3.x | Next.js 15 |
| Routing | `go_router ^14` | App Router |
| State / data | `flutter_riverpod ^2.5` | Server Components + useState |
| Maps | `flutter_map ^7` + OSM | `react-leaflet` + OSM |
| Theming | `ThemeData` + `ColorScheme` | `tailwind.config.ts` |
| Icons | `Icons.*` (Material) | `components/ui/Icon.tsx` |
| Signatures | `signature ^5.4` | `SignaturePad` canvas |
| Date format | `intl ^0.19` | `lib/format.ts` |

---

## 2. Global Setup

### Routing — mirrors `app/` route groups

```dart
GoRouter(
  initialLocation: '/auth/sign-in',
  routes: [
    GoRoute(path: '/auth/sign-in', builder: (_,__) => const SignInScreen()),

    ShellRoute(  // mirrors (app)/ route group
      builder: (_, __, child) => AppShell(child: child),
      routes: [
        GoRoute(path: '/home',      builder: (_,__) => const HomeScreen()),
        GoRoute(path: '/trips',     builder: (_,__) => const TripsScreen()),
        GoRoute(path: '/bulletin',  builder: (_,__) => const BulletinScreen()),
        GoRoute(path: '/calendar',  builder: (_,__) => const ScheduleScreen()),
        GoRoute(path: '/chats',     builder: (_,__) => const ChatsScreen()),
        GoRoute(path: '/trips/:id',
          builder: (_,s) => TripDetailScreen(id: s.pathParameters['id']!)),
        GoRoute(path: '/compliance',           builder: (_,__) => const ComplianceScreen()),
        GoRoute(path: '/account/settings',     builder: (_,__) => const SettingsScreen()),
        GoRoute(path: '/account/trip-history', builder: (_,__) => const TripHistoryScreen()),
        GoRoute(path: '/account/about',        builder: (_,__) => const AboutScreen()),
      ],
    ),

    // Full-screen — no shell
    GoRoute(path: '/notifications',   builder: (_,__) => const NotificationsScreen()),
    GoRoute(path: '/expenses',        builder: (_,__) => const ExpenseStatusScreen()),
    GoRoute(path: '/expenses/new',    builder: (_,__) => const SubmitExpenseScreen()),
    GoRoute(path: '/trip-sheets',     builder: (_,__) => const TripSheetStatusScreen()),
    GoRoute(path: '/trip-sheets/new', builder: (_,__) => const SubmitTripSheetScreen()),
    GoRoute(path: '/chat/:id',
      builder: (_,s) => ChatThreadScreen(id: s.pathParameters['id']!)),
  ],
)
```

### Theme — mirrors `tailwind.config.ts` tokens

```dart
ThemeData(
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFF1D4ED8),     // brand
    primary:    const Color(0xFF1D4ED8),    // brand
    surface:    Colors.white,               // surface
    surfaceVariant: const Color(0xFFF8FAFC),// surface-muted
    error:      const Color(0xFFDC2626),    // danger
    onPrimary:  Colors.white,
    onSurface:  const Color(0xFF0F172A),    // ink
  ),
  cardTheme: CardTheme(
    elevation: 1, color: Colors.white,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
  ),
)
```

### AppShell — mirrors `AppShell.tsx` + `BottomNav.tsx`

```dart
class AppShell extends StatefulWidget { ... }
class _AppShellState extends State<AppShell> {
  int _index = 0;
  final _tabs = ['/home', '/trips', '/bulletin', '/calendar', '/chats'];
  Widget build(BuildContext context) => Scaffold(
    body: widget.child,
    bottomNavigationBar: NavigationBar(
      selectedIndex: _index,
      onDestinationSelected: (i) { setState(() => _index = i); context.go(_tabs[i]); },
      destinations: const [
        NavigationDestination(icon: Icon(Icons.home_outlined),          label: 'Home'),
        NavigationDestination(icon: Icon(Icons.route_outlined),         label: 'Trips'),
        NavigationDestination(icon: Icon(Icons.campaign_outlined),      label: 'Bulletin'),
        NavigationDestination(icon: Icon(Icons.calendar_today_outlined),label: 'Schedule'),
        NavigationDestination(icon: Icon(Icons.chat_bubble_outline),    label: 'Chats'),
      ],
    ),
  );
}
```

---

## 3. Shared Widgets

### PillTabs — mirrors `components/ui/PillTabs.tsx`

Used by `TripsScreen` (Current/Upcoming/Previous) and `ExpenseStatusScreen` (Payroll Addition/Company Paid).

```dart
class PillTabs extends StatelessWidget {
  final List<({String key, String label, IconData? icon})> tabs;
  final String active;
  final ValueChanged<String> onChanged;

  Widget build(BuildContext context) {
    final primary = Theme.of(context).colorScheme.primary;
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceVariant,
        borderRadius: BorderRadius.circular(999),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 2)],
      ),
      child: Row(children: tabs.map((tab) {
        final isActive = tab.key == active;
        return Expanded(child: GestureDetector(
          onTap: () => onChanged(tab.key),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            padding: const EdgeInsets.symmetric(vertical: 10),
            decoration: BoxDecoration(
              color: isActive ? primary : Colors.transparent,
              borderRadius: BorderRadius.circular(999),
            ),
            child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              if (tab.icon != null) Icon(tab.icon, size: 16,
                color: isActive ? Colors.white : Colors.grey),
              const SizedBox(width: 4),
              Text(tab.label, style: TextStyle(fontSize: 13,
                fontWeight: FontWeight.w600,
                color: isActive ? Colors.white : Colors.grey[600])),
            ]),
          ),
        ));
      }).toList()),
    );
  }
}
```

### StatusBadge — mirrors `components/ui/StatusBadge.tsx`

```dart
class StatusBadge extends StatelessWidget {
  final String status;
  Color get _bg => switch (status) {
    'in-progress' || 'active' => const Color(0xFF1D4ED8),
    'completed'               => Colors.grey.shade300,
    'approved'                => Colors.green.shade100,
    'rejected'                => Colors.red.shade100,
    _                         => Colors.amber.shade100,
  };
  Color get _fg => switch (status) {
    'in-progress' || 'active' => Colors.white,
    'approved'                => Colors.green.shade800,
    'rejected'                => Colors.red.shade800,
    _                         => Colors.grey.shade700,
  };
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
    decoration: BoxDecoration(color: _bg, borderRadius: BorderRadius.circular(999)),
    child: Text(status, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: _fg)),
  );
}
```

---

## 4. Screen Mirrors

---

### 🔐 Sign In `/auth/sign-in`

```
Scaffold (no AppBar)
  SafeArea > SingleChildScrollView > Column
    _BrandBlock (dark container, logo, "TrackSmart", tagline)
    Card > Column
      Text("Sign in to your account")
      DropdownButtonFormField<User>  (demo user picker)
      _OrDivider
      TextFormField (email)
      TextFormField (password, obscureText, suffixIcon: visibility toggle)
      ElevatedButton("Sign In")
    Text (prototype disclaimer)
```

---

### 🏠 Home `/home`

```
CustomScrollView > SliverList
  _CompanyCard
  _ComplianceCard          onTap: go('/compliance')
  _ActionCard("Expenses",  primary → go('/expenses/new'), secondary → go('/expenses'))
  _ActionCard("Maintenance Requests")
  _ActionCard("Trip Sheets", primary → go('/trip-sheets/new'), secondary → go('/trip-sheets'))
  _PayrollCard
  _TimeTrackingCard        Timer.periodic(1s) while clocked in
  Row(_RefreshButton, _HelpButton)
  _LogoutButton            → AlertDialog → go('/auth/sign-in')
```

---

### 🛣️ Trips `/trips`

```
Column
  PillTabs(tabs: [current🚛, upcoming📅, previous🕐], active: _tab)
  Expanded
    // _tab == 'current':  TripCard(variant: current) OR _EmptyNote
    // _tab == 'upcoming': ListView(trips.upcoming, TripCard(variant: upcoming)) OR _EmptyNote
    // _tab == 'previous': ListView(trips.previous, TripCard(variant: previous)) OR _EmptyNote
```

**TripCard:** trip ref + StatusBadge · origin→destination · date window · meta row · FlutterMap (current only) · TextButton("View trip →")

---

### 📋 Trip Detail `/trips/:id`

```
Scaffold > AppBar("Trip <id>", leading: BackButton)
CustomScrollView
  _TripSummaryCard      (FlutterMap)
  _TripProgressStrip    (LinearProgressIndicator + "X/Y stops")
  _DispatchNoteCard
  _TripDetailsCard
  ListView(_StopRow for each stop)
    ExpansionTile
      _StopDetail
      _StopActions      (state machine — see below)
```

**`_StopActions` state machine:**
```dart
// dialog: null | 'trailer' | 'temp' | 'odometer' | 'signature' | 'document'
// history: List<{label, time, detail}>
// Pickup:  Arrived→odometer, PickedUp→trailer→temp→doc, Departed→direct
// Dropoff: Arrived→odometer, Delivered→signature→doc
// Acquire: Completed→odometer
// Hook:    Completed→trailer
// Others:  Completed→direct
// After each dialog completes → append to history list
// Navigate button (pickup/dropoff): launches Google Maps URL
```

**Signature:** `Signature` widget (signature package), `SignatureController`, Clear + Confirm + Skip.

---

### 📢 Bulletin `/bulletin`

```
Column
  _SearchBar
  Expanded > ListView.builder
    _LoadTenderCard
      Row(avatar, name, time, unread dot)
      Text(route)
      Text(pickup + delivery)
      // before action:
      Row(ElevatedButton("Accept"), OutlinedButton("Decline"))
      // after action:
      StatusBadge + ExpansionTile(detail)
```

---

### 📅 Schedule `/calendar`

```
Column
  ToggleButtons(["Calendar", "List"])
  Expanded
    // Calendar:
    Column
      _MonthHeader
      GridView(7-col, day cells + dots)
      _DayDetail (TabBar: Events | Shifts | Timesheet)
    // List:
    ListView.builder
      _AgendaDateHeader (date, "Today" badge)
      _AgendaRow(icon, title, kind tag)
```

---

### 💬 Chats `/chats`

```
Column
  _SearchBar
  Expanded > ListView.builder
    ListTile(leading: CircleAvatar(initials), title, subtitle: lastMessage,
      trailing: Column(time, UnreadDot), onTap: go('/chat/$id'))
  FAB("+ New chat") → showModalBottomSheet(_ContactPicker)
```

---

### 💬 Chat Thread `/chat/:id`

```
Scaffold
  AppBar(BackButton, Text(contactName))
  Column
    Expanded > ListView.builder(reverse: true)
      _MessageBubble(incoming: grey-left / outgoing: primary-right)
      _DayDivider
    _MessageInputBar(TextField + attach + send)
```

---

### 🔔 Notifications `/notifications`

```
Scaffold
  AppBar(BackButton, "Notifications")
  Column > _SearchBar + Expanded > ListView.builder
    _NotificationRow(icon chip, Column(title+time, message), UnreadDot)
```

---

### 📄 Compliance `/compliance`

```
Scaffold > AppBar("My Compliance") > CustomScrollView
  _SectionHeader("Basic")
  _DocumentCard("Driver's License") + ElevatedButton("Update")
  _DocumentCard("Passport")
  _DocumentCard("Emergency Contact")
  _SectionHeader("Documents")
  ElevatedButton("Add") → showModalBottomSheet(_AddDocumentSheet)
  _SectionHeader("Certifications")
  ElevatedButton("Add") → showModalBottomSheet(_AddCertificationForm)
```

---

### 💸 Expense Status `/expenses`

```
Scaffold
  AppBar(BackButton, "Expense Status")
  Column
    PillTabs([payroll💵, company🏢])   // mirrors PillTabs.tsx
    _SearchBar
    Expanded > ListView.builder (filtered by tab + query)
      Card
        Row(Text(description), StatusBadge)
        _TripIdChip (brand-light bg)
        Text(amount + currency + date)
    // empty: Card("No expenses found")
```

---

### 💸 Submit Expense `/expenses/new`

```
Scaffold
  AppBar(BackButton, "Submit Expense · Step N/5")
  Stepper(horizontal, steps: [
    Step("Type",     _ExpenseTypeStep)      // RadioListTile
    Step("Receipt",  _AddReceiptStep)       // grid of capture options
    Step("Details",  _ExpenseDetailsStep)   // amount, desc, notes, vendor
    Step("Category", _ExpenseCategoryStep)  // RadioListTile + truck search
    Step("Review",   _ReviewSubmitStep)     // summary + ElevatedButton
  ])
```

---

### ⚙️ Settings `/account/settings`

```
Scaffold > AppBar("Settings") > ListView
  _SectionHeader("Notifications")
  SwitchListTile("Trip")
  SwitchListTile("Message")
  SwitchListTile("Bulletin")
  SwitchListTile("Calendar")
  _SectionHeader("Appearance")
  ListTile("Font Size", trailing: Text(size)) → cycle on tap
  ListTile("Theme",     trailing: Text(theme)) → cycle on tap
```

---

## 5. Component Mapping

| Next.js | Flutter |
|---------|---------|
| `AppShell` | Custom `AppShell` + `ShellRoute` + `NavigationBar` |
| `TopBar` | `AppBar` |
| `BottomNav` | `NavigationBar` (Material 3) |
| **`PillTabs`** | Custom `PillTabs` widget (§3) |
| `BottomSheet` | `showModalBottomSheet` |
| `StatusBadge` | Custom `StatusBadge` widget (§3) |
| `Icon` | `Icon` (Material) |
| `TripMap` / `TripMapLeaflet` | `FlutterMap` + `TileLayer` + `PolylineLayer` + `MarkerLayer` |
| **`SignaturePad`** | `Signature` widget (`signature` package) |
| **`StopActions`** | `_StopActionsState` state machine |
| `AccountDrawer` | `Drawer` from `AppBar` action |
| Form fields | `TextFormField` in `Form` |
| `ScreenPlaceholder` | `Center(Column([Icon, Text, ...]))` |

---

## 6. Repository Layer

Mirrors `lib/api/*` — one abstract class per resource, replaced by HTTP client in Stage 2.

```dart
// Example:
abstract class TripsRepository {
  Future<TripsData> getTrips();
  Future<Trip> getTrip(String id);
}
// MockTripsRepository: reads from static Dart fixtures (mirrors lib/data/trips.ts)
// HttpTripsRepository: calls real TrackSmart API (Stage 2)
```

Provide via Riverpod:
```dart
final tripsRepositoryProvider = Provider<TripsRepository>((ref) => MockTripsRepository());
final tripsProvider = FutureProvider<TripsData>((ref) =>
  ref.watch(tripsRepositoryProvider).getTrips());
```
