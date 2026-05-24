import 'package:flutter/material.dart';

import '../app/scale.dart';
import '../app/theme.dart';
import '../data/repos.dart';
import '../models.dart';
import '../widgets/pill_tabs.dart';
import '../widgets/trips/trip_card.dart';

class TripsScreen extends StatefulWidget {
  const TripsScreen({super.key});
  @override
  State<TripsScreen> createState() => _TripsScreenState();
}

class _TripsScreenState extends State<TripsScreen> {
  String _tab = 'current';
  TripsData? _data;

  @override
  void initState() {
    super.initState();
    TripsRepo.all().then((d) {
      if (mounted) setState(() => _data = d);
    });
  }

  static const _tabs = [
    PillTab(key: 'current', label: 'Current', icon: Icons.local_shipping_outlined),
    PillTab(key: 'upcoming', label: 'Upcoming', icon: Icons.calendar_today_outlined),
    PillTab(key: 'previous', label: 'Previous', icon: Icons.history),
  ];

  @override
  Widget build(BuildContext context) {
    final data = _data;
    if (data == null) {
      return const Center(child: CircularProgressIndicator());
    }
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 16 + kShellBottomInset),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          PillTabs(
            tabs: _tabs,
            active: _tab,
            onChanged: (k) => setState(() => _tab = k),
          ),
          const SizedBox(height: 16),
          if (_tab == 'current') _section(data.current),
          if (_tab == 'upcoming') _list(data.upcoming, TripVariant.upcoming),
          if (_tab == 'previous') _list(data.previous, TripVariant.previous),
        ],
      ),
    );
  }

  Widget _section(Trip? trip) {
    if (trip == null) return _empty('No current trip');
    return TripCard(trip: trip, variant: TripVariant.current);
  }

  Widget _list(List<Trip> trips, TripVariant variant) {
    if (trips.isEmpty) {
      return _empty(
          'No ${variant == TripVariant.upcoming ? "upcoming" : "previous"} trips');
    }
    return Column(
      children: [
        for (final trip in trips) ...[
          TripCard(trip: trip, variant: variant),
          const SizedBox(height: 12),
        ],
      ],
    );
  }

  Widget _empty(String text) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 40),
        child: Center(
          child: Text(text,
              style: TextStyle(
                  color: Tokens.of(context).inkMuted,
                  fontStyle: FontStyle.italic)),
        ),
      );
}
