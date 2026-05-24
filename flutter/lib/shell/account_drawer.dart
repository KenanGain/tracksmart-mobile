import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../app/theme.dart';
import '../data/repos.dart';
import '../models.dart';

/// "My Account" side drawer — opened by the account icon in the TopBar.
class AccountDrawer extends StatefulWidget {
  const AccountDrawer({super.key});
  @override
  State<AccountDrawer> createState() => _AccountDrawerState();
}

class _AccountDrawerState extends State<AccountDrawer> {
  DriverProfile? _profile;

  @override
  void initState() {
    super.initState();
    ProfileRepo.me().then((p) {
      if (mounted) setState(() => _profile = p);
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Drawer(
      backgroundColor: t.surface,
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  Text('My Account',
                      style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: t.ink)),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),
            Divider(color: t.ink.withOpacity(0.05), height: 0),

            // Profile
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: t.brand,
                    child: Text(
                      _profile?.initials ?? '··',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(_profile?.name ?? '—',
                            style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: t.ink)),
                        Text(_profile?.role ?? '',
                            style:
                                TextStyle(fontSize: 14, color: t.inkMuted)),
                        Text(_profile?.organization ?? '',
                            style:
                                TextStyle(fontSize: 12, color: t.inkMuted)),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Menu
            Expanded(
              child: ListView(
                children: [
                  _row(context, Icons.alt_route, 'Trip History',
                      '/account/trip-history', t),
                  _row(context, Icons.settings_outlined, 'Settings',
                      '/account/settings', t),
                  _row(context, Icons.info_outline, 'About',
                      '/account/about', t),
                ],
              ),
            ),

            // Log out
            Divider(color: t.ink.withOpacity(0.05), height: 0),
            ListTile(
              leading: Icon(Icons.logout, color: t.danger),
              title: Text('Log Out',
                  style: TextStyle(
                      color: t.danger, fontWeight: FontWeight.w600)),
              onTap: () => _confirmLogout(context),
            ),
          ],
        ),
      ),
    );
  }

  Widget _row(BuildContext ctx, IconData icon, String label, String href, Tokens t) {
    return ListTile(
      leading: Icon(icon, color: t.inkMuted),
      title: Text(label, style: TextStyle(color: t.ink)),
      trailing: Icon(Icons.chevron_right, color: t.inkMuted),
      onTap: () {
        Navigator.of(ctx).pop();
        ctx.push(href);
      },
    );
  }

  void _confirmLogout(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Log out?'),
        content: const Text('You will need to sign in again to use the app.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(
              backgroundColor: Tokens.of(context).danger,
            ),
            onPressed: () {
              Navigator.of(ctx).pop();
              Navigator.of(context).pop(); // close drawer
              context.go('/auth/sign-in');
            },
            child: const Text('Log Out'),
          ),
        ],
      ),
    );
  }
}
