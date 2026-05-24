import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../app/theme.dart';
import '../data/repos.dart';
import 'top_bar.dart';
import 'bottom_nav.dart';
import 'account_drawer.dart';

/// AppShell — the phone-width frame. Wraps every (app)/ screen with a
/// translucent TopBar + a floating BottomNav and centres the content
/// inside a max-width column on desktop.
class AppShell extends StatefulWidget {
  const AppShell({super.key, required this.child});
  final Widget child;

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _chatBadge = 0;
  int _bulletinBadge = 0;

  @override
  void initState() {
    super.initState();
    _loadBadges();
  }

  Future<void> _loadBadges() async {
    final chats = await ChatsRepo.unreadCount();
    final bull = await BulletinRepo.unreadCount();
    if (mounted) {
      setState(() {
        _chatBadge = chats;
        _bulletinBadge = bull;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final location =
        GoRouterState.of(context).matchedLocation;

    return Scaffold(
      backgroundColor: t.backdrop,
      endDrawer: const AccountDrawer(),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: kShellMaxWidth),
          child: DecoratedBox(
            decoration: BoxDecoration(color: t.surfaceMuted),
            child: Stack(
              children: [
                // Scrollable content with padding for the floating bars.
                // Content fills the whole shell — top bar + bottom nav
                // float on top with backdrop blur, frosting whatever scrolls
                // behind them. Bottom padding lives INSIDE each screen's
                // ListView (kShellBottomInset) so the bubble nav's bg
                // shows the blurred content, not a dead-zone slab.
                Positioned.fill(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 56),
                    child: widget.child,
                  ),
                ),
                // Translucent TopBar overlay.
                const Positioned(
                  top: 0,
                  left: 0,
                  right: 0,
                  child: TopBar(),
                ),
                // Floating BottomNav.
                Positioned(
                  bottom: 0,
                  left: 0,
                  right: 0,
                  child: BottomNav(
                    location: location,
                    badges: {
                      '/bulletin': _bulletinBadge,
                      '/chats': _chatBadge,
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
