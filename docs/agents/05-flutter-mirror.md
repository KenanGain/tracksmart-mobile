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
> A **living build plan** for Stage-2 Flutter native app. Every screen implemented in Next.js must have its Flutter equivalent described here — the **dual-output rule** ([[agents/01-shared-context]] §3). When Stage 2 begins, this is already a complete, screen-by-screen Flutter spec.

> [!important] Source sync
> This note mirrors `prompts/flutter.md` in the repo root. Keep them in sync.

---

## Global Setup

### Dependencies (`pubspec.yaml`)

```yaml
dependencies:
  flutter: {sdk: flutter}
  go_router: ^14.0.0          # mirrors Next.js App Router
  flutter_riverpod: ^2.5.0    # mirrors React Server + useState
  riverpod_annotation: ^2.3.0
  cached_network_image: ^3.3.0
  flutter_map: ^7.0.0         # Leaflet equivalent
  latlong2: ^0.9.0
  intl: ^0.19.0               # mirrors lib/format.ts
  signature: ^5.4.0           # mirrors SignaturePad canvas
```

---

### Routing (`go_router`) — mirrors App Router

```dart
GoRouter(
  initialLocation: '/auth/sign-in',
  routes: [
    GoRoute(path: '/auth/sign-in', builder: (_,__) => const SignInScreen()),

    ShellRoute(  // mirrors (app)/ route group
      builder: (_, __, child) => AppShell(child: child),
      routes: [
        GoRoute(path: '/home',     builder: (_,__) => const HomeScreen()),
        GoRoute(path: '/trips',    builder: (_,__) => const TripsScreen()),
        GoRoute(path: '/bulletin', builder: (_,__) => const BulletinScreen()),
        GoRoute(path: '/calendar', builder: (_,__) => const ScheduleScreen()),
        GoRoute(path: '/chats',    builder: (_,__) => const ChatsScreen()),
        // Detail routes inside shell:
        GoRoute(path: '/trips/:id',
          builder: (_,s) => TripDetailScreen(id: s.pathParameters['id']!)),
        GoRoute(path: '/compliance',          builder: (_,__) => const ComplianceScreen()),
        GoRoute(path: '/account/settings',    builder: (_,__) => const SettingsScreen()),
        GoRoute(path: '/account/trip-history',builder: (_,__) => const TripHistoryScreen()),
        GoRoute(path: '/account/about',       builder: (_,__) => const AboutScreen()),
      ],
    ),

    // Full-screen routes — no shell
    GoRoute(path: '/notifications',    builder: (_,__) => const NotificationsScreen()),
    GoRoute(path: '/expenses',         builder: (_,__) => const ExpenseStatusScreen()),
    GoRoute(path: '/expenses/new',     builder: (_,__) => const SubmitExpenseScreen()),
    GoRoute(path: '/trip-sheets',      builder: (_,__) => const TripSheetStatusScreen()),
    GoRoute(path: '/trip-sheets/new',  builder: (_,__) => const SubmitTripSheetScreen()),
    GoRoute(path: '/chat/:id',
      builder: (_,s) => ChatThreadScreen(id: s.pathParameters['id']!)),
  ],
)
```

---

### Theme (`ThemeData`) — mirrors Tailwind tokens

```dart
ThemeData(
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFF1D4ED8),   // brand
    primary:    const Color(0xFF1D4ED8),  // brand
    surface:    Colors.white,             // surface
    surfaceVariant: const Color(0xFFF8FAFC), // surface-muted
    error:      const Color(0xFFDC2626),  // danger
    onPrimary:  Colors.white,
    onSurface:  const Color(0xFF0F172A),  // ink
  ),
  cardTheme: CardTheme(
    elevation: 1,
    color: Colors.white,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12)), // rounded-card
  ),
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: Colors.white,
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
  ),
)
```

---

### AppShell — mirrors `components/shell/AppShell.tsx`

```dart
class AppShell extends StatefulWidget { ... }

class _AppShellState extends State<AppShell> {
  int _index = 0;
  final _tabs = ['/home', '/trips', '/bulletin', '/calendar', '/chats'];

  Widget build(BuildContext context) => Scaffold(
    body: widget.child,
    bottomNavigationBar: NavigationBar(
      selectedIndex: _index,
      onDestinationSelected: (i) {
        setState(() => _index = i);
        context.go(_tabs[i]);
      },
      destinations: const [
        NavigationDestination(icon: Icon(Icons.home_outlined),         label: 'Home'),
        NavigationDestination(icon: Icon(Icons.route_outlined),        label: 'Trips'),
        NavigationDestination(icon: Icon(Icons.campaign_outlined),     label: 'Bulletin'),
        NavigationDestination(icon: Icon(Icons.calendar_today_outlined),label: 'Schedule'),
        NavigationDestination(icon: Icon(Icons.chat_bubble_outline),   label: 'Chats'),
      ],
    ),
  );
}
```

---

### PillTabs — mirrors `components/ui/PillTabs.tsx`

```dart
/// Rounded bubble tab bar — mirrors PillTabs.tsx
/// Used by TripsScreen and ExpenseStatusScreen.
class PillTabs extends StatelessWidget {
  final List<PillTabItem> tabs;
  final String active;
  final ValueChanged<String> onChanged;

  Widget build(BuildContext context) {
    final primary = Theme.of(context).colorScheme.primary;
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceVariant,
        borderRadius: BorderRadius.circular(999),
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 2, offset: Offset(0,1))],
      ),
      child: Row(
        children: tabs.map((tab) {
          final isActive = tab.key == active;
          return Expanded(
            child: GestureDetector(
              onTap: () => onChanged(tab.key),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: isActive ? primary : Colors.transparent,
                  borderRadius: BorderRadius.circular(999),
                  boxShadow: isActive
                    ? [BoxShadow(color: primary.withOpacity(0.3), blurRadius: 6)]
                    : null,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (tab.icon != null) Icon(tab.icon,
                      size: 16,
                      color: isActive ? Colors.white : Colors.grey),
                    const SizedBox(width: 4),
                    Text(tab.label,
                      style: TextStyle(
                        fontSize: 13, fontWeight: FontWeight.w600,
                        color: isActive ? Colors.white : Colors.grey[600])),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
```

---

## Screen Mirrors

---

### 🔐 Sign In `/auth/sign-in`

```
Scaffold (no AppBar)
  SafeArea
    SingleChildScrollView
      Column
        _BrandBlock          (dark container, logo, AppName, tagline)
        Card
          Column
            Text("Sign in to your account")
            _DemoUserDropdown (DropdownButtonFormField<User>)
            _OrDivider
            TextFormField     (email)
            TextFormField     (password, obscureText + suffix toggle icon)
            ElevatedButton    ("Sign In") → AuthRepository.signIn()
        Text                  (prototype disclaimer)
```

**Repository:** `AuthRepository.signIn(email, password)` → on success `context.go('/home')`

---

### 🏠 Home `/home`

```
CustomScrollView
  SliverPadding
    SliverList
      _CompanyCard
      _ComplianceCard       → go('/compliance') on tap
      _ActionCard("Expenses",
        primary: "Submit New" → go('/expenses/new'),
        secondary: "Status"  → go('/expenses'))
      _ActionCard("Maintenance Requests")   [placeholder]
      _ActionCard("Trip Sheets",
        primary: "Submit New" → go('/trip-sheets/new'),
        secondary: "Status"  → go('/trip-sheets'))
      _PayrollCard
      _TimeTrackingCard     (Timer.periodic, clock in/out toggle)
      _RefreshHelpRow
      _LogoutButton         → showDialog(AlertDialog) → go('/auth/sign-in')
```

**Repository:** `HomeRepository.getHomeData()` → `FutureProvider<HomeData>`

**Time tracking:** `Timer.periodic(Duration(seconds:1), ...)` while `_clockedIn == true`.

---

### 🛣️ Trips `/trips`

```
Column
  PillTabs(                    // mirrors PillTabs.tsx
    tabs: [current, upcoming, previous],
    active: _tab,
    onChanged: setState)
  Expanded
    // tab == 'current':
    TripCard(trip: trips.current, variant: current)
    // tab == 'upcoming':
    ListView(trips.upcoming.map(TripCard(variant: upcoming)))
    // tab == 'previous':
    ListView(trips.previous.map(TripCard(variant: previous)))
    // empty:
    _EmptyNote(text: "No current trip")
```

**Repository:** `TripsRepository.getTrips()` → `FutureProvider<TripsData>`

**Map (TripCard current variant):** `FlutterMap` + `TileLayer` (OSM) + `PolylineLayer` (brand) + `MarkerLayer` (numbered pins).

---

### 📋 Trip Detail `/trips/:id`

```
Scaffold
  AppBar(leading: BackButton, title: Text("Trip <id>"))
  CustomScrollView
    _TripSummaryCard (FlutterMap embedded)
    _TripProgressStrip (LinearProgressIndicator)
    _DispatchNoteCard
    _TripDetailsCard
    _StopTimeline
      _TripStopRow for each stop
        ExpansionTile
          _StopDetail (address, times, refs)
          _StopActions (state machine widget)
```

**`_StopActions` state machine (mirrors `StopActions.tsx`):**
```dart
class _StopActionsState extends State<StopActions> {
  List<HistoryEntry> history = [];
  String? dialog;   // 'trailer' | 'temp' | 'odometer' | 'signature' | 'document'
  String? pending;

  // Per-kind button config:
  // pickup  → [Arrived, Picked Up, Departed]
  // drop-off → [Arrived, Delivered]
  // acquire → [Completed]
  // hook    → [Completed]
  // others  → [Completed]

  // Dialog chain:
  // Arrived → odometer ValueDialog → finish
  // Picked Up → ConfirmTrailerDialog → temp ValueDialog → AddDocumentSheet
  // Delivered → SignatureBottomSheet → AddDocumentSheet
  // Acquire/Completed → odometer ValueDialog
  // Hook/Completed → ConfirmTrailerDialog
}
```

**SignatureBottomSheet:** Use `signature` package (`SignatureController`), Clear + Confirm + Skip.

---

### 📢 Bulletin `/bulletin`

```
Column
  _SearchBar
  Expanded
    ListView.builder
      _LoadTenderCard
        Column
          Row (sender avatar, name, time, unread dot)
          Text (route summary)
          Text (pickup / delivery dates)
          Row
            ElevatedButton("Accept")  → setState accepted
            OutlinedButton("Decline") → setState declined
        // after action:
        Chip(status) + ExpansionTile(full detail)
```

**Repository:** `BulletinRepository.getLoadTenders()` → `StateNotifierProvider`

---

### 📅 Schedule `/calendar`

```
Column
  ToggleButtons([Text("Calendar"), Text("List")])
  Expanded
    // Calendar view:
    Column
      _MonthHeader (prev/next IconButtons)
      GridView (7-col, day cells with dot indicators)
      _DayDetail (TabBar: Events | Shifts | Timesheet)
    // List view:
    ListView.builder
      _AgendaDateHeader (date + "Today" badge)
      _AgendaRow (icon, title, kind tag)
```

---

### 💬 Chats `/chats`

```
Column
  _SearchBar
  Expanded
    ListView.builder
      ListTile
        leading: CircleAvatar (initials)
        title: Text(name)
        subtitle: Text(lastMessage)
        trailing: Column(time, _UnreadDot)
        onTap: go('/chat/${conversation.id}')
  FloatingActionButton(label: "New chat")
    → showModalBottomSheet(_ContactPicker)
```

---

### 💬 Chat Thread `/chat/:id`

```
Scaffold
  AppBar(leading: BackButton, title: Text(contactName))
  Column
    Expanded
      ListView.builder(reverse: true)
        _MessageBubble
          // incoming: Align.left, grey container
          // outgoing: Align.right, primary container
        _DayDivider
    _MessageInputBar
      Row(TextField, IconButton(attach), IconButton(send))
```

---

### 🔔 Notifications `/notifications`

```
Scaffold
  AppBar(leading: BackButton, title: Text("Notifications"))
  Column
    _SearchBar
    Expanded
      ListView.builder
        _NotificationRow
          Row(icon chip, Column(title+time, message), _UnreadDot)
```

---

### 📄 Compliance `/compliance`

```
CustomScrollView
  _SectionHeader("Basic")
  _DocumentCard("Driver's License") + ElevatedButton("Update")
  _DocumentCard("Passport")         + ElevatedButton("Update")
  _DocumentCard("Emergency Contact")
  _SectionHeader("Documents")
  ElevatedButton("Add") → showModalBottomSheet(_AddDocumentSheet)
  _SectionHeader("Certifications")
  ElevatedButton("Add") → showModalBottomSheet(_AddCertificationForm)
```

---

### 💸 Expense Status `/expenses`

```
Column
  AppBar(leading: BackButton, title: "Expense Status")
  PillTabs(tabs: [payroll, company], ...)   // mirrors PillTabs.tsx
  _SearchBar
  Expanded
    ListView.builder (filtered by tab + query)
      Card
        Row(Text(description), StatusChip)
        _TripIdChip (brand-light bg)
        Text(amount + currency + date)
  // empty: Card("No expenses found")
```

**Repository:** `ExpensesRepository.getExpenses()` → `StateNotifierProvider`  
**Filter:** by `expenseType == tab && description.contains(query)`

---

### 💸 Submit Expense `/expenses/new`

```
Scaffold
  AppBar(leading: BackButton, title: "Submit Expense · Step N/5")
  Stepper(type: StepperType.horizontal, steps: [
    Step(title: "Type",     content: _ExpenseTypeStep),
    Step(title: "Receipt",  content: _AddReceiptStep),
    Step(title: "Details",  content: _ExpenseDetailsStep),
    Step(title: "Category", content: _ExpenseCategoryStep),
    Step(title: "Review",   content: _ReviewSubmitStep),
  ])
```

---

### 📋 Trip Sheet Status `/trip-sheets`

```
Scaffold
  AppBar(leading: BackButton, title: "Trip Sheet Status")
  ListView.builder
    Card: period range + StatusChip + submitted date
```

---

### ⚙️ Settings `/account/settings`

```
Scaffold
  AppBar(leading: BackButton, title: "Settings")
  ListView
    _SectionHeader("Notifications")
    SwitchListTile("Trip", value, onChanged)
    SwitchListTile("Message", ...)
    SwitchListTile("Bulletin", ...)
    SwitchListTile("Calendar", ...)
    _SectionHeader("Appearance")
    ListTile("Font Size", trailing: Text(size)) → cycle on tap
    ListTile("Theme",     trailing: Text(theme)) → cycle on tap
```

---

## Component Mapping Reference

| Next.js | Flutter |
|---------|---------|
| `AppShell` | `ShellRoute` + custom `AppShell` + `NavigationBar` |
| `TopBar` | `AppBar` |
| `BottomNav` | `NavigationBar` (M3) |
| **`PillTabs`** | Custom `PillTabs` widget (see above) |
| `BottomSheet` | `showModalBottomSheet` |
| `StatusBadge` | Custom `Chip` / `Container` |
| `Icon` | `Icon` (Material) |
| `TripMap` / `TripMapLeaflet` | `FlutterMap` + `TileLayer` + layers |
| `ScreenPlaceholder` | `Center(Column([Icon, Text, ...]))` |
| Form fields | `TextFormField` in `Form` |
| `AccountDrawer` | `Drawer` from `AppBar` action |
| **`SignaturePad`** | `signature` package `Signature` widget |
| **`StopActions`** | `_StopActionsState` state machine widget |

---

## 🔗 Related

[[agents/00-agents-home]] · [[agents/01-shared-context]] · [[06-roadmap]] · [[02-screens]] · [[03-design-system]]
