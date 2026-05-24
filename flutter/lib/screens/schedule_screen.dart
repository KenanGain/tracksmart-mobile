import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../app/scale.dart';
import '../app/theme.dart';
import '../data/repos.dart';
import '../models.dart';

/// Schedule (Calendar) — 1:1 mirror of `components/calendar/`:
/// CalendarScreen (toggle), CalendarView (month grid + selected day),
/// CalendarEventsList (date-grouped agenda).
class ScheduleScreen extends StatefulWidget {
  const ScheduleScreen({super.key});
  @override
  State<ScheduleScreen> createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends State<ScheduleScreen> {
  String _view = 'calendar'; // 'calendar' | 'list'

  List<Shift> _shifts = const [];
  List<ClockRecord> _clocks = const [];
  List<CalendarEvent> _events = const [];
  List<LoadTender> _loads = const [];

  @override
  void initState() {
    super.initState();
    Future.wait([
      ScheduleRepo.shifts(),
      ScheduleRepo.clockRecords(),
      ScheduleRepo.events(),
      BulletinRepo.all(),
    ]).then((r) {
      if (!mounted) return;
      setState(() {
        _shifts = r[0] as List<Shift>;
        _clocks = r[1] as List<ClockRecord>;
        _events = r[2] as List<CalendarEvent>;
        _loads = r[3] as List<LoadTender>;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return ListView(
      padding: const EdgeInsets.fromLTRB(
          S.s4, S.s4, S.s4, S.s4 + kShellBottomInset),
      children: [
        _ViewToggle(
          value: _view,
          onChanged: (v) => setState(() => _view = v),
        ),
        const SizedBox(height: S.s4),
        if (_view == 'calendar')
          _CalendarView(
            shifts: _shifts,
            clocks: _clocks,
            events: _events,
          )
        else
          _AgendaList(
            shifts: _shifts,
            events: _events,
            loads: _loads,
            t: t,
          ),
      ],
    );
  }
}

// ─── View toggle ───────────────────────────────────────────────────────
// `flex gap-1 rounded-lg bg-surface-muted p-1`
//   button `flex-1 rounded-md py-2 text-sm font-semibold`
//          active: bg-brand text-white | else text-ink-muted
class _ViewToggle extends StatelessWidget {
  const _ViewToggle({required this.value, required this.onChanged});
  final String value;
  final ValueChanged<String> onChanged;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    Widget pill(String key, String label) {
      final active = value == key;
      return Expanded(
        child: GestureDetector(
          onTap: () => onChanged(key),
          behavior: HitTestBehavior.opaque,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            decoration: BoxDecoration(
              color: active ? t.brand : Colors.transparent,
              borderRadius: BorderRadius.circular(R.r6),
            ),
            padding: const EdgeInsets.symmetric(vertical: S.s2),
            alignment: Alignment.center,
            child: Text(label,
                style: Tx.sm.copyWith(
                    fontWeight: fw600,
                    color: active ? Colors.white : t.inkMuted)),
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(S.s1),
      decoration: BoxDecoration(
        color: t.surfaceMuted,
        borderRadius: BorderRadius.circular(R.r8),
      ),
      child: Row(children: [
        pill('calendar', 'Calendar'),
        const SizedBox(width: S.s1),
        pill('list', 'List'),
      ]),
    );
  }
}

// ─── Per-event-kind styling (matches CalendarView KIND_STYLES) ─────────
class _KindStyle {
  final String label;
  final Color accent; // dot + accent strip
  final IconData icon;
  const _KindStyle(this.label, this.accent, this.icon);
}

_KindStyle _kindStyle(CalendarEventKind k, Tokens t) {
  switch (k) {
    case CalendarEventKind.delivery:
      return _KindStyle('Delivery', t.brand, Icons.local_shipping_outlined);
    case CalendarEventKind.pickup:
      return _KindStyle('Pickup', t.success, Icons.inventory_2_outlined);
    case CalendarEventKind.meeting:
      return _KindStyle('Meeting', t.warning, Icons.person_outline);
    case CalendarEventKind.maintenance:
      return _KindStyle('Maintenance', t.danger, Icons.build_outlined);
    case CalendarEventKind.reminder:
      return _KindStyle('Reminder', t.inkMuted, Icons.notifications_none);
  }
}

String _iso(DateTime d) => DateFormat('yyyy-MM-dd').format(d);

// ─── Month grid + selected-day detail ─────────────────────────────────
class _CalendarView extends StatefulWidget {
  const _CalendarView({
    required this.shifts,
    required this.clocks,
    required this.events,
  });
  final List<Shift> shifts;
  final List<ClockRecord> clocks;
  final List<CalendarEvent> events;
  @override
  State<_CalendarView> createState() => _CalendarViewState();
}

class _CalendarViewState extends State<_CalendarView> {
  late DateTime _view;
  late DateTime _selected;
  late final DateTime _today;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _today = DateTime(now.year, now.month, now.day);
    _view = DateTime(now.year, now.month);
    _selected = _today;
  }

  void _shiftMonth(int delta) =>
      setState(() => _view = DateTime(_view.year, _view.month + delta));

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final todayIso = _iso(_today);
    final selectedIso = _iso(_selected);

    final working = widget.shifts.map((s) => s.date).toSet();
    final clockedDates = widget.clocks.map((c) => c.date).toSet();

    final firstWeekday = DateTime(_view.year, _view.month, 1).weekday % 7;
    final cells = List.generate(
      42,
      (i) => DateTime(_view.year, _view.month, 1 - firstWeekday + i),
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // ── Month grid card: rounded-card p-3 shadow-card ──────────────
        Container(
          decoration: BoxDecoration(
            color: t.surface,
            borderRadius: BorderRadius.circular(R.r14),
            boxShadow: shadowCard,
          ),
          padding: const EdgeInsets.all(S.s3),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Month navigation: mb-2 flex justify-between
              Row(children: [
                _NavChip(
                  icon: Icons.chevron_left,
                  onTap: () => _shiftMonth(-1),
                ),
                Expanded(
                  child: Center(
                    child: Text(
                      DateFormat('MMMM yyyy').format(_view),
                      style: Tx.sm.copyWith(fontWeight: fw700, color: t.ink),
                    ),
                  ),
                ),
                _NavChip(
                  icon: Icons.chevron_right,
                  onTap: () => _shiftMonth(1),
                ),
              ]),
              const SizedBox(height: S.s2),

              // Weekday row + 6 cell rows; grid-cols-7 gap-1 throughout.
              Row(
                children: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                    .map((d) => Expanded(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: S.s1),
                            child: Center(
                              child: Text(
                                d,
                                style: Tx.xs.copyWith(
                                    fontWeight: fw500, color: t.inkMuted),
                              ),
                            ),
                          ),
                        ))
                    .toList(),
              ),
              for (var row = 0; row < 6; row++)
                Padding(
                  padding: const EdgeInsets.only(top: S.s1),
                  child: Row(
                    children: List.generate(7, (col) {
                      final date = cells[row * 7 + col];
                      final iso = _iso(date);
                      final inMonth = date.month == _view.month;
                      final isSelected = iso == selectedIso;
                      final isToday = iso == todayIso;
                      final isWorking = working.contains(iso);
                      final hasEvent =
                          widget.events.any((e) => e.date == iso);
                      final hasClock = clockedDates.contains(iso);
                      return Expanded(
                        child: Padding(
                          padding: EdgeInsets.only(left: col == 0 ? 0 : S.s1),
                          child: AspectRatio(
                            aspectRatio: 1,
                            child: GestureDetector(
                              behavior: HitTestBehavior.opaque,
                              onTap: () => setState(() => _selected = date),
                              child: Container(
                                decoration: BoxDecoration(
                                  color: t.surfaceMuted,
                                  borderRadius: BorderRadius.circular(R.r8),
                                  border: isSelected
                                      ? Border.all(color: t.ink, width: 2)
                                      : isToday
                                          ? Border.all(
                                              color: t.brand
                                                  .withValues(alpha: 0.5))
                                          : null,
                                ),
                                child: Stack(children: [
                                  Center(
                                    child: Text(
                                      '${date.day}',
                                      style: Tx.sm.copyWith(
                                          fontWeight: fw500,
                                          color: inMonth
                                              ? t.ink
                                              : t.inkMuted
                                                  .withValues(alpha: 0.4)),
                                    ),
                                  ),
                                  Positioned(
                                    bottom: S.s1,
                                    left: 0,
                                    right: 0,
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        if (isWorking) _dot(t.success),
                                        if (hasEvent) _dot(t.brand),
                                        if (hasClock) _dot(t.warning),
                                      ],
                                    ),
                                  ),
                                ]),
                              ),
                            ),
                          ),
                        ),
                      );
                    }),
                  ),
                ),

              // Legend: mt-3 flex justify-center gap-4 text-xs
              const SizedBox(height: S.s3),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _LegendItem(color: t.success, label: 'Working'),
                  const SizedBox(width: S.s4),
                  _LegendItem(color: t.brand, label: 'Event'),
                  const SizedBox(width: S.s4),
                  _LegendItem(color: t.warning, label: 'Clocked in'),
                ],
              ),
            ],
          ),
        ),

        const SizedBox(height: S.s4),

        // ── Selected day section ──────────────────────────────────────
        _SelectedDay(
          selected: _selected,
          events: widget.events.where((e) => e.date == selectedIso).toList(),
          shifts: widget.shifts.where((s) => s.date == selectedIso).toList(),
          clock: widget.clocks
              .where((c) => c.date == selectedIso)
              .cast<ClockRecord?>()
              .firstWhere((_) => true, orElse: () => null),
        ),
      ],
    );
  }
}

Widget _dot(Color c) => Container(
      width: 6,
      height: 6,
      margin: const EdgeInsets.symmetric(horizontal: 1),
      decoration: BoxDecoration(color: c, shape: BoxShape.circle),
    );

/// `flex h-8 w-8 items-center justify-center rounded-full text-ink-muted`
class _NavChip extends StatelessWidget {
  const _NavChip({required this.icon, required this.onTap});
  final IconData icon;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Material(
      color: Colors.transparent,
      shape: const CircleBorder(),
      child: InkWell(
        onTap: onTap,
        customBorder: const CircleBorder(),
        child: SizedBox(
          width: 32,
          height: 32,
          child: Icon(icon, size: Sz.x5, color: t.inkMuted),
        ),
      ),
    );
  }
}

class _LegendItem extends StatelessWidget {
  const _LegendItem({required this.color, required this.label});
  final Color color;
  final String label;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Row(children: [
      Container(
        width: 8,
        height: 8,
        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
      ),
      const SizedBox(width: S.s1_5),
      Text(label, style: Tx.xs.copyWith(color: t.inkMuted)),
    ]);
  }
}

class _SelectedDay extends StatelessWidget {
  const _SelectedDay({
    required this.selected,
    required this.events,
    required this.shifts,
    required this.clock,
  });
  final DateTime selected;
  final List<CalendarEvent> events;
  final List<Shift> shifts;
  final ClockRecord? clock;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          DateFormat('EEE, MMMM d').format(selected),
          style: Tx.base.copyWith(fontWeight: fw700, color: t.ink),
        ),
        const SizedBox(height: S.s3),
        _Block(
          label: 'Events',
          empty: 'No events scheduled',
          isEmpty: events.isEmpty,
          children: [
            for (final e in events) _EventCard(event: e),
          ],
        ),
        const SizedBox(height: S.s3),
        _Block(
          label: 'Shifts',
          empty: 'No shifts scheduled',
          isEmpty: shifts.isEmpty,
          children: [
            for (final s in shifts) _ShiftCard(shift: s),
          ],
        ),
        const SizedBox(height: S.s3),
        _Block(
          label: 'Timesheet',
          empty: 'No clock records',
          isEmpty: clock == null,
          children: [if (clock != null) _Timesheet(clock: clock!)],
        ),
      ],
    );
  }
}

/// One labelled section: tiny uppercase label + either an empty-state card
/// or a vertical stack of cards.
class _Block extends StatelessWidget {
  const _Block({
    required this.label,
    required this.empty,
    required this.isEmpty,
    required this.children,
  });
  final String label;
  final String empty;
  final bool isEmpty;
  final List<Widget> children;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // `text-[11px] font-semibold uppercase tracking-wide text-ink-muted`
        Text(label.toUpperCase(),
            style: Tx.t11.copyWith(
                fontWeight: fw600,
                letterSpacing: 0.5,
                color: t.inkMuted)),
        const SizedBox(height: S.s2),
        if (isEmpty)
          _ShadowCard(
            padding: const EdgeInsets.all(S.s4),
            child: Center(
              child: Text(empty,
                  style: Tx.sm.copyWith(color: t.inkMuted)),
            ),
          )
        else
          for (var i = 0; i < children.length; i++)
            Padding(
              padding: EdgeInsets.only(top: i == 0 ? 0 : S.s2),
              child: children[i],
            ),
      ],
    );
  }
}

/// Local card primitive — same shape as AppCard but we keep it private
/// here so we can pass custom padding without dragging it through every
/// call site.
class _ShadowCard extends StatelessWidget {
  const _ShadowCard({required this.child, required this.padding});
  final Widget child;
  final EdgeInsetsGeometry padding;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Container(
      decoration: BoxDecoration(
        color: t.surface,
        borderRadius: BorderRadius.circular(R.r14),
        boxShadow: shadowCard,
      ),
      padding: padding,
      child: child,
    );
  }
}

// ─── Event card ───────────────────────────────────────────────────────
// `flex gap-3 rounded-card bg-surface p-3 shadow-card`
//  accent strip `mt-0.5 h-full w-1 rounded-full ${accent}`
//  title `text-sm font-semibold text-ink`
//  time  `mt-0.5 text-xs text-ink-muted`
//  tag   `text-[11px] font-semibold ${tagText}`
class _EventCard extends StatelessWidget {
  const _EventCard({required this.event});
  final CalendarEvent event;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final style = _kindStyle(event.kind, t);
    return _ShadowCard(
      padding: const EdgeInsets.all(S.s3),
      child: IntrinsicHeight(
        child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Container(
            width: 4,
            margin: const EdgeInsets.only(top: S.s0_5),
            decoration: BoxDecoration(
              color: style.accent,
              borderRadius: BorderRadius.circular(R.rFull),
            ),
          ),
          const SizedBox(width: S.s3),
          Expanded(
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(event.title,
                      style:
                          Tx.sm.copyWith(fontWeight: fw600, color: t.ink)),
                  const SizedBox(height: 2),
                  Text(event.time,
                      style: Tx.xs.copyWith(color: t.inkMuted)),
                ]),
          ),
          const SizedBox(width: S.s3),
          Text(style.label,
              style: Tx.t11.copyWith(
                  fontWeight: fw600, color: style.accent)),
        ]),
      ),
    );
  }
}

// ─── Shift card ───────────────────────────────────────────────────────
// `rounded-card bg-surface p-3 shadow-card`
//  row: label (text-sm semibold ink) | time (text-xs semibold brand)
//  row 2: map-pin h-3.5 + location (text-xs ink-muted)
class _ShiftCard extends StatelessWidget {
  const _ShiftCard({required this.shift});
  final Shift shift;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return _ShadowCard(
      padding: const EdgeInsets.all(S.s3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Expanded(
              child: Text(shift.label,
                  style: Tx.sm.copyWith(fontWeight: fw600, color: t.ink)),
            ),
            const SizedBox(width: S.s3),
            Text('${shift.startTime} – ${shift.endTime}',
                style: Tx.xs
                    .copyWith(fontWeight: fw600, color: t.brand)),
          ]),
          const SizedBox(height: 2),
          Row(children: [
            Icon(Icons.location_on_outlined,
                size: 14, color: t.inkMuted),
            const SizedBox(width: S.s1),
            Expanded(
              child: Text(shift.location,
                  style: Tx.xs.copyWith(color: t.inkMuted)),
            ),
          ]),
        ],
      ),
    );
  }
}

// ─── Timesheet card ───────────────────────────────────────────────────
// `rounded-card bg-surface p-4 shadow-card`
//  3 rows, last with border-t border-ink/5 pt-2
class _Timesheet extends StatelessWidget {
  const _Timesheet({required this.clock});
  final ClockRecord clock;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    Widget row(String label, String value, {bool bold = false, Color? color}) {
      return Row(children: [
        Expanded(child: Text(label, style: Tx.sm.copyWith(color: t.inkMuted))),
        Text(value,
            style: Tx.sm.copyWith(
                fontWeight: bold ? fw700 : fw600,
                color: color ?? t.ink)),
      ]);
    }

    final hours = clock.hours;
    return _ShadowCard(
      padding: const EdgeInsets.all(S.s4),
      child: Column(children: [
        row('Clock in', clock.clockIn),
        const SizedBox(height: S.s2),
        row('Clock out', clock.clockOut ?? 'On the clock'),
        const SizedBox(height: S.s2),
        Container(height: 1, color: t.ink.withValues(alpha: 0.05)),
        const SizedBox(height: S.s2),
        row(
          'Hours worked',
          hours == null ? 'In progress' : '${hours.toStringAsFixed(1)} h',
          bold: true,
          color: hours == null ? t.warning : t.ink,
        ),
      ]),
    );
  }
}

// ─── Agenda / List view ───────────────────────────────────────────────
class _AgendaItem {
  final String id;
  final String date;
  final IconData icon;
  final Color dot;
  final String title;
  final String subtitle;
  final String tag;
  final Color tagColor;
  const _AgendaItem({
    required this.id,
    required this.date,
    required this.icon,
    required this.dot,
    required this.title,
    required this.subtitle,
    required this.tag,
    required this.tagColor,
  });
}

class _AgendaList extends StatelessWidget {
  const _AgendaList({
    required this.shifts,
    required this.events,
    required this.loads,
    required this.t,
  });
  final List<Shift> shifts;
  final List<CalendarEvent> events;
  final List<LoadTender> loads;
  final Tokens t;

  @override
  Widget build(BuildContext context) {
    final items = <_AgendaItem>[
      for (final s in shifts)
        _AgendaItem(
          id: 'shift-${s.id}',
          date: s.date,
          icon: Icons.schedule,
          dot: t.brand,
          title: s.label,
          subtitle: '${s.startTime} – ${s.endTime} · ${s.location}',
          tag: 'Shift',
          tagColor: t.brand,
        ),
      for (final e in events)
        () {
          final k = _kindStyle(e.kind, t);
          return _AgendaItem(
            id: 'event-${e.id}',
            date: e.date,
            icon: k.icon,
            dot: k.accent,
            title: e.title,
            subtitle: e.time,
            tag: k.label,
            tagColor: k.accent,
          );
        }(),
      for (final l in loads)
        _AgendaItem(
          id: 'load-${l.id}',
          date: l.date,
          icon: Icons.local_shipping_outlined,
          dot: t.inkMuted,
          title: '${l.origin} → ${l.destination}',
          subtitle:
              'Pickup ${l.pickupTime} · Delivery ${l.deliveryTime}',
          tag: 'Load Tender',
          tagColor: t.inkMuted,
        ),
    ];

    if (items.isEmpty) {
      return _ShadowCard(
        padding: const EdgeInsets.all(S.s6),
        child: Center(
          child: Text('Nothing scheduled.',
              style: Tx.sm.copyWith(color: t.inkMuted)),
        ),
      );
    }

    final dates = items.map((i) => i.date).toSet().toList()..sort();
    final today = _iso(DateTime.now());

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        for (var i = 0; i < dates.length; i++) ...[
          if (i > 0) const SizedBox(height: S.s5),
          _AgendaSection(
            date: dates[i],
            isToday: dates[i] == today,
            items: items.where((it) => it.date == dates[i]).toList(),
          ),
        ],
      ],
    );
  }
}

class _AgendaSection extends StatelessWidget {
  const _AgendaSection({
    required this.date,
    required this.isToday,
    required this.items,
  });
  final String date;
  final bool isToday;
  final List<_AgendaItem> items;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final heading =
        DateFormat('EEEE, MMMM d').format(DateTime.parse('${date}T12:00:00'));
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(children: [
          Text(heading,
              style: Tx.sm.copyWith(fontWeight: fw700, color: t.ink)),
          if (isToday) ...[
            const SizedBox(width: S.s2),
            // Today badge: `rounded-full bg-brand px-2 py-0.5 text-[10px]
            //              font-bold uppercase tracking-wide text-white`
            Container(
              padding: const EdgeInsets.symmetric(
                  horizontal: S.s2, vertical: 2),
              decoration: BoxDecoration(
                color: t.brand,
                borderRadius: BorderRadius.circular(R.rFull),
              ),
              child: Text('TODAY',
                  style: Tx.t10.copyWith(
                      fontWeight: fw700,
                      letterSpacing: 0.5,
                      color: Colors.white)),
            ),
          ],
        ]),
        const SizedBox(height: S.s2),
        for (var i = 0; i < items.length; i++)
          Padding(
            padding: EdgeInsets.only(top: i == 0 ? 0 : S.s2),
            child: _AgendaRow(item: items[i]),
          ),
      ],
    );
  }
}

class _AgendaRow extends StatelessWidget {
  const _AgendaRow({required this.item});
  final _AgendaItem item;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return _ShadowCard(
      padding: const EdgeInsets.all(S.s3),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // `flex h-10 w-10 rounded-lg ${dot} text-white`
          Container(
            width: Sz.x10,
            height: Sz.x10,
            decoration: BoxDecoration(
              color: item.dot,
              borderRadius: BorderRadius.circular(R.r8),
            ),
            alignment: Alignment.center,
            child: Icon(item.icon, size: Sz.x5, color: Colors.white),
          ),
          const SizedBox(width: S.s3),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style:
                        Tx.sm.copyWith(fontWeight: fw700, color: t.ink)),
                Text(item.subtitle,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: Tx.xs.copyWith(color: t.inkMuted)),
              ],
            ),
          ),
          const SizedBox(width: S.s3),
          Text(item.tag,
              style: Tx.t11.copyWith(
                  fontWeight: fw600, color: item.tagColor)),
        ],
      ),
    );
  }
}
