import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../app/theme.dart';
import '../../models.dart';
import 'trip_map.dart';

enum TripVariant { current, upcoming, previous }

/// TripCard — list summary card: id + status pill, route, dates, meta,
/// and (for the **current** trip only) the route map.
class TripCard extends StatelessWidget {
  const TripCard({super.key, required this.trip, required this.variant});
  final Trip trip;
  final TripVariant variant;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Card(
      clipBehavior: Clip.antiAlias,
      margin: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          InkWell(
            onTap: () => context.push('/trips/${trip.id}'),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: TripSummary(trip: trip, variant: variant),
            ),
          ),
          if (variant == TripVariant.current) ...[
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: TripMap(stops: trip.stops),
            ),
          ],
          InkWell(
            onTap: () => context.push('/trips/${trip.id}'),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 10),
              decoration: BoxDecoration(
                border: Border(
                  top: BorderSide(color: t.ink.withOpacity(0.05)),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('View trip',
                      style: TextStyle(
                          color: t.brand,
                          fontSize: 12,
                          fontWeight: FontWeight.w600)),
                  Icon(Icons.chevron_right, size: 14, color: t.brand),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// The text summary shared by TripCard (list) and TripOverviewCard (detail).
class TripSummary extends StatelessWidget {
  const TripSummary({super.key, required this.trip, required this.variant});
  final Trip trip;
  final TripVariant variant;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final stops = trip.stops.length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Header
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('DRIVER TRIP',
                      style: TextStyle(
                        fontSize: 11,
                        color: t.inkMuted,
                        fontWeight: FontWeight.w500,
                        letterSpacing: 0.5,
                      )),
                  Text(trip.id,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: t.ink,
                      )),
                ],
              ),
            ),
            _StatusPill(trip: trip, variant: variant),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          '${trip.origin}  →  ${trip.destination}',
          style: TextStyle(
              fontSize: 14, fontWeight: FontWeight.w700, color: t.ink),
        ),
        const SizedBox(height: 4),
        Row(children: [
          Icon(Icons.calendar_today_outlined, size: 14, color: t.inkMuted),
          const SizedBox(width: 6),
          Expanded(
            child: Text('${trip.startDate}  →  ${trip.endDate}',
                style: TextStyle(fontSize: 12, color: t.inkMuted)),
          ),
        ]),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.only(top: 12),
          decoration: BoxDecoration(
            border: Border(
              top: BorderSide(color: t.ink.withOpacity(0.05)),
            ),
          ),
          child: Wrap(
            spacing: 16,
            runSpacing: 4,
            children: [
              _meta(Icons.alt_route, '$stops ${stops == 1 ? "stop" : "stops"}', t),
              _meta(Icons.local_shipping_outlined, trip.powerUnit, t),
              _meta(Icons.inventory_2_outlined,
                  '${trip.equipment}, ${trip.trailer}', t),
            ],
          ),
        ),
      ],
    );
  }

  Widget _meta(IconData icon, String text, Tokens t) {
    return Row(mainAxisSize: MainAxisSize.min, children: [
      Icon(icon, size: 14, color: t.inkMuted),
      const SizedBox(width: 4),
      Text(text, style: TextStyle(fontSize: 12, color: t.inkMuted)),
    ]);
  }
}

class _StatusPill extends StatelessWidget {
  const _StatusPill({required this.trip, required this.variant});
  final Trip trip;
  final TripVariant variant;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final (Color bg, Color fg, String label) = switch (variant) {
      TripVariant.current => (t.brand, Colors.white, 'In Progress'),
      TripVariant.upcoming => (
          t.warning.withOpacity(0.15),
          t.warning,
          trip.countdown ?? 'Scheduled'
        ),
      TripVariant.previous => (
          t.success.withOpacity(0.1),
          t.success,
          'Completed'
        ),
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration:
          BoxDecoration(color: bg, borderRadius: BorderRadius.circular(999)),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Container(
          width: 6,
          height: 6,
          decoration: BoxDecoration(
            color: variant == TripVariant.current ? Colors.white : fg,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 6),
        Text(label,
            style: TextStyle(
                color: fg, fontSize: 11, fontWeight: FontWeight.w700)),
      ]),
    );
  }
}
