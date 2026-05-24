import 'package:flutter/material.dart';

import '../app/scale.dart';
import '../app/theme.dart';
import '../data/repos.dart';
import '../models.dart';
import '../widgets/trips/trip_card.dart';

class TripHistoryScreen extends StatefulWidget {
  const TripHistoryScreen({super.key});
  @override
  State<TripHistoryScreen> createState() => _TripHistoryScreenState();
}

class _TripHistoryScreenState extends State<TripHistoryScreen> {
  List<Trip>? _trips;
  @override
  void initState() {
    super.initState();
    TripsRepo.all().then((d) {
      if (mounted) setState(() => _trips = d.previous);
    });
  }

  @override
  Widget build(BuildContext context) {
    final trips = _trips;
    if (trips == null) return const Center(child: CircularProgressIndicator());
    final t = Tokens.of(context);
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 16 + kShellBottomInset),
      children: [
        Text(
          '${trips.length} completed ${trips.length == 1 ? "trip" : "trips"}',
          style: TextStyle(color: t.inkMuted, fontSize: 13),
        ),
        const SizedBox(height: 12),
        if (trips.isEmpty)
          Card(
            margin: EdgeInsets.zero,
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Center(
                child: Text('No completed trips yet.',
                    style: TextStyle(color: t.inkMuted)),
              ),
            ),
          )
        else
          for (final trip in trips) ...[
            TripCard(trip: trip, variant: TripVariant.previous),
            const SizedBox(height: 12),
          ],
      ],
    );
  }
}
