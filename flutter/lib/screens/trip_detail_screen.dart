import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../app/scale.dart';
import '../app/theme.dart';
import '../data/repos.dart';
import '../models.dart';
import '../widgets/trips/trip_card.dart';
import '../widgets/trips/trip_map.dart';
import '../widgets/trips/trip_stop_row.dart';

class TripDetailScreen extends StatefulWidget {
  const TripDetailScreen({super.key, required this.tripId});
  final String tripId;
  @override
  State<TripDetailScreen> createState() => _TripDetailScreenState();
}

class _TripDetailScreenState extends State<TripDetailScreen> {
  Trip? _trip;
  TripVariant _variant = TripVariant.current;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final trip = await TripsRepo.byId(widget.tripId);
    final all = await TripsRepo.all();
    if (!mounted) return;
    TripVariant v = TripVariant.current;
    if (all.current?.id == widget.tripId) {
      v = TripVariant.current;
    } else if (all.upcoming.any((t) => t.id == widget.tripId)) {
      v = TripVariant.upcoming;
    } else if (all.previous.any((t) => t.id == widget.tripId)) {
      v = TripVariant.previous;
    }
    setState(() {
      _trip = trip;
      _variant = v;
    });
  }

  @override
  Widget build(BuildContext context) {
    final trip = _trip;
    if (trip == null) {
      return const Center(child: CircularProgressIndicator());
    }
    final t = Tokens.of(context);
    final total = trip.stops.length;
    final done = trip.stops.where((s) => s.completed).length;
    final nextIndex = trip.stops.indexWhere((s) => !s.completed);
    final pct = total == 0 ? 0.0 : done / total;

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 16 + kShellBottomInset),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _overview(trip, t),
          const SizedBox(height: 16),
          _progress(t, done, total, pct),
          const SizedBox(height: 16),
          _row(
            t,
            icon: Icons.upload_outlined,
            iconBg: t.brandLight,
            iconColor: t.brand,
            title: 'Submit',
            subtitle: 'Submit documents, notes & photos',
            onTap: () {},
          ),
          const SizedBox(height: 12),
          _row(
            t,
            icon: Icons.attach_money,
            iconBg: t.brandLight,
            iconColor: t.brand,
            title: 'Expense',
            subtitle: 'Submit an expense for this trip',
            onTap: () => context.push('/expenses/new'),
          ),
          const SizedBox(height: 16),
          Text('STOPS',
              style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                  color: t.inkMuted)),
          const SizedBox(height: 8),
          for (var i = 0; i < trip.stops.length; i++)
            TripStopRow(
              stop: trip.stops[i],
              index: i + 1,
              isLast: i == trip.stops.length - 1,
              isNext: i == nextIndex,
            ),
          const SizedBox(height: 12),
          _row(
            t,
            icon: Icons.build_outlined,
            iconBg: t.danger.withOpacity(0.1),
            iconColor: t.danger,
            title: 'Report an Issue',
            subtitle: 'Send a maintenance request to the office',
            onTap: () => context.push('/maintenance/new'),
          ),
        ],
      ),
    );
  }

  Widget _overview(Trip trip, Tokens t) {
    return _OverviewCard(trip: trip, variant: _variant);
  }

  Widget _progress(Tokens t, int done, int total, double pct) {
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(children: [
                Text('Trip Progress',
                    style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: t.ink,
                        fontSize: 14)),
                const Spacer(),
                Text('$done of $total stops',
                    style: TextStyle(
                        color: t.inkMuted, fontWeight: FontWeight.w600)),
              ]),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(999),
                child: LinearProgressIndicator(
                  value: pct,
                  minHeight: 8,
                  backgroundColor: t.surfaceMuted,
                  valueColor: AlwaysStoppedAnimation(t.success),
                ),
              ),
            ]),
      ),
    );
  }

  Widget _row(
    Tokens t, {
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Card(
      margin: EdgeInsets.zero,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(kCardRadius),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(children: [
            Container(
              width: 40,
              height: 40,
              decoration:
                  BoxDecoration(color: iconBg, borderRadius: BorderRadius.circular(8)),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: t.ink)),
                  Text(subtitle,
                      style: TextStyle(fontSize: 11, color: t.inkMuted)),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: t.inkMuted),
          ]),
        ),
      ),
    );
  }
}

/// Overview card — summary + map + expandable trip details + dispatch note.
class _OverviewCard extends StatefulWidget {
  const _OverviewCard({required this.trip, required this.variant});
  final Trip trip;
  final TripVariant variant;
  @override
  State<_OverviewCard> createState() => _OverviewCardState();
}

class _OverviewCardState extends State<_OverviewCard> {
  bool _open = false;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final trip = widget.trip;
    return Card(
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TripSummary(trip: trip, variant: widget.variant),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: TripMap(stops: trip.stops),
          ),
          InkWell(
            onTap: () => setState(() => _open = !_open),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                border: Border(top: BorderSide(color: t.ink.withOpacity(0.05))),
              ),
              child: Row(children: [
                Text('Trip Details',
                    style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: t.ink,
                        fontSize: 14)),
                const Spacer(),
                Icon(_open ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                    color: t.inkMuted),
              ]),
            ),
          ),
          if (_open)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                border: Border(top: BorderSide(color: t.ink.withOpacity(0.05))),
              ),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    if (trip.note != null) ...[
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: t.warning.withOpacity(0.1),
                          border: Border.all(color: t.warning.withOpacity(0.3)),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(children: [
                                Icon(Icons.info_outline,
                                    size: 14, color: t.warning),
                                const SizedBox(width: 6),
                                Text('Dispatch Note',
                                    style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w700,
                                        color: t.warning)),
                              ]),
                              const SizedBox(height: 4),
                              Text(trip.note!,
                                  style:
                                      TextStyle(fontSize: 13, color: t.ink)),
                            ]),
                      ),
                      const SizedBox(height: 12),
                    ],
                    _details(t, trip),
                  ]),
            ),
        ],
      ),
    );
  }

  Widget _details(Tokens t, Trip trip) {
    final rows = [
      ('Equipment', trip.equipment, Icons.inventory_2_outlined),
      ('Power unit', trip.powerUnit, Icons.local_shipping_outlined),
      ('Trailer', trip.trailer, Icons.inventory_2_outlined),
      ('Lead driver', trip.leadDriver, Icons.person_outline),
      ('Team driver', trip.teamDriver.isEmpty ? '—' : trip.teamDriver,
          Icons.person_outline),
      ('Dispatched by', trip.dispatchedBy, Icons.person_outline),
      ('Issued on', trip.issuedOn, Icons.schedule),
    ];
    return Column(
      children: [
        for (final (label, value, icon) in rows)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 4),
            child: Row(children: [
              Icon(icon, size: 16, color: t.inkMuted),
              const SizedBox(width: 8),
              Text(label, style: TextStyle(color: t.inkMuted, fontSize: 13)),
              const Spacer(),
              Text(value,
                  style: TextStyle(
                      color: t.ink,
                      fontWeight: FontWeight.w600,
                      fontSize: 13)),
            ]),
          ),
      ],
    );
  }
}
