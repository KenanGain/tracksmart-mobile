import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../app/theme.dart';
import '../data/repos.dart';
import '../models.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});
  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  List<NotificationItem>? _items;
  @override
  void initState() {
    super.initState();
    NotificationsRepo.all().then((d) {
      if (mounted) setState(() => _items = d);
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final items = _items;
    if (items == null) return const Scaffold(body: Center(child: CircularProgressIndicator()));
    return Scaffold(
      backgroundColor: t.surfaceMuted,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.chevron_left),
          onPressed: () => context.pop(),
        ),
        title: const Text('Notifications',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('TODAY',
              style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                  color: t.inkMuted)),
          const SizedBox(height: 8),
          for (final n in items) ...[
            Card(
              margin: EdgeInsets.zero,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Row(children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                        color: t.brandLight,
                        borderRadius: BorderRadius.circular(8)),
                    child: Icon(_iconFor(n.icon), color: t.brand, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(children: [
                          Expanded(
                            child: Text(n.title,
                                style: TextStyle(
                                    fontWeight: FontWeight.w700,
                                    color: t.ink)),
                          ),
                          Text(n.time,
                              style: TextStyle(
                                  fontSize: 11, color: t.inkMuted)),
                        ]),
                        Text(n.message,
                            style: TextStyle(
                                color: t.inkMuted, fontSize: 13)),
                      ],
                    ),
                  ),
                  if (n.unread) ...[
                    const SizedBox(width: 8),
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                          color: t.brand, shape: BoxShape.circle),
                    ),
                  ],
                ]),
              ),
            ),
            const SizedBox(height: 8),
          ],
        ],
      ),
    );
  }

  IconData _iconFor(String name) => switch (name) {
        'route' => Icons.alt_route,
        'calendar' => Icons.calendar_today_outlined,
        'megaphone' => Icons.campaign_outlined,
        _ => Icons.info_outline,
      };
}
