import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../shell/app_shell.dart';
import '../screens/sign_in_screen.dart';
import '../screens/home_screen.dart';
import '../screens/trips_screen.dart';
import '../screens/trip_detail_screen.dart';
import '../screens/bulletin_screen.dart';
import '../screens/schedule_screen.dart';
import '../screens/chats_screen.dart';
import '../screens/chat_thread_screen.dart';
import '../screens/compliance_screen.dart';
import '../screens/settings_screen.dart';
import '../screens/trip_history_screen.dart';
import '../screens/about_screen.dart';
import '../screens/notifications_screen.dart';
import '../screens/expenses_screen.dart';
import '../screens/submit_expense_screen.dart';
import '../screens/trip_sheets_screen.dart';
import '../screens/submit_trip_sheet_screen.dart';
import '../screens/maintenance_screen.dart';

/// Mirrors the Next.js App Router. `ShellRoute` wraps screens with the
/// `AppShell` (TopBar + BottomNav); other routes render full-screen with
/// their own header.
final router = GoRouter(
  initialLocation: '/auth/sign-in',
  routes: [
    GoRoute(
      path: '/auth/sign-in',
      builder: (_, __) => const SignInScreen(),
    ),

    // (app)/ group — wrapped in AppShell
    ShellRoute(
      builder: (_, __, child) => AppShell(child: child),
      routes: [
        GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
        GoRoute(path: '/trips', builder: (_, __) => const TripsScreen()),
        GoRoute(
          path: '/trips/:id',
          builder: (_, s) =>
              TripDetailScreen(tripId: s.pathParameters['id']!),
        ),
        GoRoute(
          path: '/bulletin',
          builder: (_, __) => const BulletinScreen(),
        ),
        GoRoute(
          path: '/calendar',
          builder: (_, __) => const ScheduleScreen(),
        ),
        GoRoute(path: '/chats', builder: (_, __) => const ChatsScreen()),
        GoRoute(
          path: '/compliance',
          builder: (_, __) => const ComplianceScreen(),
        ),
        GoRoute(
          path: '/account/settings',
          builder: (_, __) => const SettingsScreen(),
        ),
        GoRoute(
          path: '/account/trip-history',
          builder: (_, __) => const TripHistoryScreen(),
        ),
        GoRoute(
          path: '/account/about',
          builder: (_, __) => const AboutScreen(),
        ),
      ],
    ),

    // Full-screen routes — no shell
    GoRoute(
      path: '/notifications',
      builder: (_, __) => const NotificationsScreen(),
    ),
    GoRoute(path: '/expenses', builder: (_, __) => const ExpensesScreen()),
    GoRoute(
      path: '/expenses/new',
      builder: (_, __) => const SubmitExpenseScreen(),
    ),
    GoRoute(
      path: '/trip-sheets',
      builder: (_, __) => const TripSheetsScreen(),
    ),
    GoRoute(
      path: '/trip-sheets/new',
      builder: (_, __) => const SubmitTripSheetScreen(),
    ),
    GoRoute(
      path: '/maintenance/new',
      builder: (_, __) => const MaintenanceScreen(),
    ),
    GoRoute(
      path: '/chat/:id',
      builder: (_, s) => ChatThreadScreen(id: s.pathParameters['id']!),
    ),
  ],
  errorBuilder: (_, __) => const Scaffold(
    body: Center(child: Text('Screen not found')),
  ),
);
