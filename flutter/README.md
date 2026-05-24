# TrackSmart Mobile — Flutter

Flutter port of the Next.js mobile app. Mirrors the screen catalogue in
`../docs/02-screens.md` and follows the Flutter spec in
`../docs/agents/05-flutter-mirror.md`.

## Run

```
cd flutter
flutter pub get
flutter run
```

## Layout

```
lib/
  main.dart              MaterialApp.router + theme controller
  app/
    theme.dart           Tokens + ThemeData (light + dark)
    theme_controller.dart  ValueNotifier<ThemeMode> + SharedPreferences
    router.dart          go_router config
  shell/
    app_shell.dart       Scaffold + bottom nav
    top_bar.dart         AppBar (tab + detail modes)
    bottom_nav.dart      NavigationBar with unread badges
    theme_toggle.dart    Sun / moon button
    account_drawer.dart  End drawer with menu rows
  widgets/
    pill_tabs.dart       Shared bubble tab bar
    status_badge.dart    Pending/Approved/Rejected pill
    add_document_sheet.dart  Capture sheet
    trips/               TripCard, TripMap, TripOverviewCard,
                         TripStopRow, StopActions
  screens/               One file per screen — mirrors app/(app)/*
  models.dart            All domain models
  data/mock_data.dart    Mock backend
  data/repos.dart        Repository functions (the "service layer")
```

## Mock data

Same shape as the Next.js mock backend in `../lib/data/*.ts`. No real API
yet — `data/repos.dart` is the seam to swap in HTTP calls later.

## Maps

`flutter_map` + OpenStreetMap tiles — no API key needed. The route
polyline is drawn through each stop's lat/lng; pins are numbered red
markers matching the timeline.
