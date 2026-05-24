import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../app/theme.dart';
import 'theme_toggle.dart';

/// Top bar — two modes derived from the route:
///   - Tab route   → section title + bell + theme toggle + account icon.
///   - Detail route → back button + centred title.
class TopBar extends StatelessWidget {
  const TopBar({super.key});

  static const _tabs = {
    '/home': 'Home',
    '/trips': 'Trips',
    '/bulletin': 'Bulletin',
    '/calendar': 'Schedule',
    '/chats': 'Chats',
  };

  static const _detailTitles = {
    '/compliance': 'My Compliance',
    '/account/settings': 'Settings',
    '/account/trip-history': 'Trip History',
    '/account/about': 'About',
  };

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final loc = GoRouterState.of(context).matchedLocation;
    final tabLabel = _tabs[loc];

    final content = tabLabel != null
        ? _tabHeader(context, t, tabLabel)
        : _detailHeader(context, t, _titleFor(loc));

    return SafeArea(
      bottom: false,
      child: ClipRect(
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
          child: Container(
            height: 56,
            decoration: BoxDecoration(
              color: t.surface.withOpacity(0.85),
              border: Border(
                bottom: BorderSide(color: t.ink.withOpacity(0.06)),
              ),
            ),
            child: content,
          ),
        ),
      ),
    );
  }

  String _titleFor(String loc) {
    if (_detailTitles.containsKey(loc)) return _detailTitles[loc]!;
    if (loc.startsWith('/trips/')) return 'Trip ${loc.split('/')[2]}';
    return 'TrackSmart';
  }

  Widget _tabHeader(BuildContext context, Tokens t, String label) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Expanded(
            child: Text(label,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: t.ink,
                )),
          ),
          IconButton(
            icon: Icon(Icons.notifications_outlined, color: t.ink),
            tooltip: 'Notifications',
            onPressed: () => context.push('/notifications'),
          ),
          const ThemeToggle(),
          Builder(
            builder: (ctx) => IconButton(
              icon: Icon(Icons.person_outline, color: t.ink),
              tooltip: 'Account',
              onPressed: () => Scaffold.of(ctx).openEndDrawer(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _detailHeader(BuildContext context, Tokens t, String title) {
    return Row(
      children: [
        IconButton(
          icon: Icon(Icons.chevron_left, color: t.ink),
          onPressed: () => context.pop(),
        ),
        Expanded(
          child: Text(
            title,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: t.ink,
            ),
          ),
        ),
        const SizedBox(width: 48),
      ],
    );
  }
}
