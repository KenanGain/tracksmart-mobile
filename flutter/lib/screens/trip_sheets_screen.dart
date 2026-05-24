import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../app/theme.dart';

/// Trip Sheet Status — simplified list (no records yet in mock data).
class TripSheetsScreen extends StatelessWidget {
  const TripSheetsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Scaffold(
      backgroundColor: t.surfaceMuted,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.chevron_left),
          onPressed: () => context.pop(),
        ),
        title: const Text('Trip Sheet Status',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
        centerTitle: true,
      ),
      body: Center(
        child: Card(
          margin: const EdgeInsets.all(24),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Text('No trip sheets submitted yet.',
                style: TextStyle(color: t.inkMuted)),
          ),
        ),
      ),
    );
  }
}
