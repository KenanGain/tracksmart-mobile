/// Repository functions — the service layer screens call. Wraps the
/// mock data today; swap in HTTP calls when a real backend is wired.
library;

import '../models.dart';
import 'mock_data.dart' as mock;

class TripsData {
  final Trip? current;
  final List<Trip> upcoming;
  final List<Trip> previous;
  const TripsData({this.current, required this.upcoming, required this.previous});
}

class TripsRepo {
  static Future<TripsData> all() async => TripsData(
        current: mock.currentTrip,
        upcoming: mock.upcomingTrips,
        previous: mock.previousTrips,
      );

  static Future<Trip?> byId(String id) async {
    if (mock.currentTrip.id == id) return mock.currentTrip;
    for (final t in mock.upcomingTrips) {
      if (t.id == id) return t;
    }
    for (final t in mock.previousTrips) {
      if (t.id == id) return t;
    }
    return null;
  }
}

class ChatsRepo {
  static Future<List<Conversation>> all() async => mock.conversations;
  static Future<Conversation?> byId(String id) async {
    for (final c in mock.conversations) {
      if (c.id == id) return c;
    }
    for (final contact in mock.contacts) {
      if (contact.id == id) {
        return Conversation(
          id: contact.id,
          name: contact.name,
          lastMessage: '',
          time: '',
          unread: false,
          messages: const [],
        );
      }
    }
    return null;
  }

  static Future<int> unreadCount() async =>
      mock.conversations.where((c) => c.unread).length;
}

class ContactsRepo {
  static Future<List<Contact>> all() async => mock.contacts;
}

class BulletinRepo {
  static Future<List<LoadTender>> all() async => mock.loadTenders;
  static Future<int> unreadCount() async =>
      mock.loadTenders.where((t) => t.unread).length;
}

class ScheduleRepo {
  static Future<List<Shift>> shifts() async => mock.shifts;
  static Future<List<ClockRecord>> clockRecords() async => mock.clockRecords;
  static Future<List<CalendarEvent>> events() async => mock.calendarEvents;
  static List<String> workingDates() =>
      mock.shifts.map((s) => s.date).toList();
}

class ExpensesRepo {
  static Future<List<ExpenseRecord>> all() async => mock.expenses;
}

class NotificationsRepo {
  static Future<List<NotificationItem>> all() async => mock.notifications;
}

class ProfileRepo {
  static Future<DriverProfile> me() async => mock.driverProfile;
}

class AuthRepo {
  static List<DemoUser> demoUsers() => mock.demoUsers;
  static const demoPassword = mock.demoPassword;
  static Future<({bool ok, String? error})> signIn(
    String email,
    String password,
  ) async {
    final user = mock.demoUsers.where((u) => u.email == email).firstOrNull;
    if (user == null) return (ok: false, error: 'Unknown email.');
    if (password != mock.demoPassword) {
      return (ok: false, error: 'Wrong password.');
    }
    return (ok: true, error: null);
  }
}

