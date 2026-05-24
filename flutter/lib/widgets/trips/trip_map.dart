import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../../app/theme.dart';
import '../../models.dart';

/// TripMap — a real map (Leaflet equivalent) using `flutter_map` + OSM
/// tiles. Renders the route polyline through the stops with numbered
/// red markers. Tap the "Full map" button to open the full-screen view.
class TripMap extends StatelessWidget {
  const TripMap({super.key, required this.stops, this.height = 176});
  final List<TripStop> stops;
  final double height;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: SizedBox(
        height: height,
        child: Stack(
          children: [
            _MapBody(stops: stops, interactive: false),
            Positioned(
              right: 8,
              bottom: 8,
              child: FilledButton.tonal(
                style: FilledButton.styleFrom(
                  backgroundColor: Colors.white.withOpacity(0.9),
                  foregroundColor: Tokens.of(context).brand,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                ),
                onPressed: () => _openFullScreen(context),
                child: Row(mainAxisSize: MainAxisSize.min, children: const [
                  Icon(Icons.map_outlined, size: 16),
                  SizedBox(width: 4),
                  Text('Full map',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _openFullScreen(BuildContext context) {
    Navigator.of(context).push(MaterialPageRoute(
      builder: (_) => _FullMap(stops: stops),
    ));
  }
}

class _MapBody extends StatelessWidget {
  const _MapBody({required this.stops, required this.interactive});
  final List<TripStop> stops;
  final bool interactive;

  @override
  Widget build(BuildContext context) {
    final points =
        stops.map((s) => LatLng(s.lat, s.lng)).toList(growable: false);
    final bounds = LatLngBounds.fromPoints(points);

    return FlutterMap(
      options: MapOptions(
        initialCameraFit: CameraFit.bounds(
          bounds: bounds,
          padding: const EdgeInsets.all(28),
        ),
        interactionOptions: InteractionOptions(
          flags: interactive ? InteractiveFlag.all : InteractiveFlag.none,
        ),
      ),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.tracksmart.mobile',
        ),
        PolylineLayer(polylines: [
          Polyline(
            points: points,
            color: const Color(0xFF1D4ED8),
            strokeWidth: 4,
          ),
        ]),
        MarkerLayer(
          markers: [
            for (var i = 0; i < points.length; i++)
              Marker(
                point: points[i],
                width: 28,
                height: 28,
                child: _Pin(number: i + 1),
              ),
          ],
        ),
      ],
    );
  }
}

class _Pin extends StatelessWidget {
  const _Pin({required this.number});
  final int number;
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFB91C1C),
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 2),
        boxShadow: const [
          BoxShadow(color: Colors.black38, blurRadius: 4, offset: Offset(0, 1)),
        ],
      ),
      child: Center(
        child: Text(
          '$number',
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w700,
            fontSize: 12,
          ),
        ),
      ),
    );
  }
}

class _FullMap extends StatelessWidget {
  const _FullMap({required this.stops});
  final List<TripStop> stops;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final from = stops.isNotEmpty ? stops.first.location : '';
    final to = stops.isNotEmpty ? stops.last.location : '';
    return Scaffold(
      appBar: AppBar(
        title: Column(children: [
          const Text('Route Map', style: TextStyle(fontSize: 16)),
          if (from.isNotEmpty)
            Text('$from → $to',
                style: TextStyle(fontSize: 11, color: t.inkMuted)),
        ]),
        centerTitle: true,
      ),
      body: _MapBody(stops: stops, interactive: true),
    );
  }
}
