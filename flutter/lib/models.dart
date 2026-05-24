/// Domain models — mirrors the TypeScript types in `lib/data/*.ts`.

enum TripStopKind { acquire, hook, pickup, dropOff }

class TripStop {
  final String id;
  final TripStopKind kind;
  final String name;
  final String location;
  final String address;
  final double lat;
  final double lng;
  final String appointment;
  final String? pickupNumber;
  final String? temperature;
  final String? phone;
  final String email;
  final String? powerUnit;
  final String? trailer;
  final String? note;
  final bool completed;

  const TripStop({
    required this.id,
    required this.kind,
    required this.name,
    required this.location,
    required this.address,
    required this.lat,
    required this.lng,
    required this.appointment,
    this.pickupNumber,
    this.temperature,
    this.phone,
    required this.email,
    this.powerUnit,
    this.trailer,
    this.note,
    required this.completed,
  });
}

class Trip {
  final String id;
  final String origin;
  final String destination;
  final String startDate;
  final String endDate;
  final String? countdown;
  final String leadDriver;
  final String teamDriver;
  final String dispatchedBy;
  final String issuedOn;
  final String equipment;
  final String powerUnit;
  final String trailer;
  final String? note;
  final List<TripStop> stops;

  const Trip({
    required this.id,
    required this.origin,
    required this.destination,
    required this.startDate,
    required this.endDate,
    this.countdown,
    required this.leadDriver,
    required this.teamDriver,
    required this.dispatchedBy,
    required this.issuedOn,
    required this.equipment,
    required this.powerUnit,
    required this.trailer,
    this.note,
    required this.stops,
  });
}

class ChatMessage {
  final String id;
  final bool fromMe;
  final String text;
  final String time;
  final String? senderLabel;
  final String? dayMarker;

  const ChatMessage({
    required this.id,
    required this.fromMe,
    required this.text,
    required this.time,
    this.senderLabel,
    this.dayMarker,
  });
}

class Conversation {
  final String id;
  final String name;
  final String lastMessage;
  final String time;
  final bool unread;
  final List<ChatMessage> messages;

  const Conversation({
    required this.id,
    required this.name,
    required this.lastMessage,
    required this.time,
    required this.unread,
    required this.messages,
  });
}

class Contact {
  final String id;
  final String name;
  final String role;
  final String initials;
  const Contact({
    required this.id,
    required this.name,
    required this.role,
    required this.initials,
  });
}

class LoadTender {
  final String id;
  final String sender;
  final String time;
  final bool unread;
  final String origin;
  final String destination;
  final String date;
  final String pickupTime;
  final String deliveryTime;

  const LoadTender({
    required this.id,
    required this.sender,
    required this.time,
    required this.unread,
    required this.origin,
    required this.destination,
    required this.date,
    required this.pickupTime,
    required this.deliveryTime,
  });
}

enum CalendarEventKind { delivery, pickup, meeting, maintenance, reminder }

class CalendarEvent {
  final String id;
  final String date;
  final String title;
  final String time;
  final CalendarEventKind kind;
  const CalendarEvent({
    required this.id,
    required this.date,
    required this.title,
    required this.time,
    required this.kind,
  });
}

class Shift {
  final String id;
  final String date;
  final String label;
  final String startTime;
  final String endTime;
  final String location;
  const Shift({
    required this.id,
    required this.date,
    required this.label,
    required this.startTime,
    required this.endTime,
    required this.location,
  });
}

class ClockRecord {
  final String date;
  final String clockIn;
  final String? clockOut;
  final double? hours;
  const ClockRecord({
    required this.date,
    required this.clockIn,
    this.clockOut,
    this.hours,
  });
}

class DriverProfile {
  final String name;
  final String role;
  final String organization;
  final String email;
  final String phone;
  final String employeeId;
  final String vehicle;
  final String initials;
  const DriverProfile({
    required this.name,
    required this.role,
    required this.organization,
    required this.email,
    required this.phone,
    required this.employeeId,
    required this.vehicle,
    required this.initials,
  });
}

enum ExpenseStatus { pending, approved, rejected }
enum ExpenseType { payroll, company }

class ExpenseRecord {
  final String id;
  final String description;
  final String amount;
  final String currency;
  final ExpenseStatus status;
  final ExpenseType expenseType;
  final String tripId;
  final String submittedAt;
  const ExpenseRecord({
    required this.id,
    required this.description,
    required this.amount,
    required this.currency,
    required this.status,
    required this.expenseType,
    required this.tripId,
    required this.submittedAt,
  });
}

class NotificationItem {
  final String id;
  final String title;
  final String message;
  final String time;
  final bool unread;
  final String icon;
  const NotificationItem({
    required this.id,
    required this.title,
    required this.message,
    required this.time,
    required this.unread,
    required this.icon,
  });
}

class DemoUser {
  final String id;
  final String name;
  final String email;
  final String jobTitle;
  const DemoUser({
    required this.id,
    required this.name,
    required this.email,
    required this.jobTitle,
  });
}

class Company {
  final String name;
  final String monogram;
  const Company({required this.name, required this.monogram});
}
