import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../app/scale.dart';
import '../app/theme.dart';
import '../data/mock_data.dart' as mock;
import '../widgets/primitives.dart';

/// Home — mirror of `app/(app)/home/page.tsx`.
/// Outer wrapper: `space-y-4` → 16px between cards.
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(
          S.s4, S.s4, S.s4, S.s4 + kShellBottomInset),
      itemCount: 8,
      separatorBuilder: (_, __) => const SizedBox(height: S.s4),
      itemBuilder: (_, i) => switch (i) {
        0 => const _CompanyCard(),
        1 => const _ComplianceCard(),
        2 => const _ActionCard(
            title: 'Expenses',
            primary: _Action('Submit New', Icons.add, '/expenses/new'),
            secondary: _Action('Status', Icons.menu, '/expenses'),
          ),
        3 => const _ActionCard(
            title: 'Maintenance Requests',
            primary: _Action('New Request', Icons.add, '/maintenance/new'),
            secondary: _Action('History', Icons.menu, null),
          ),
        4 => const _ActionCard(
            title: 'Trip Sheets',
            primary: _Action('Submit New', Icons.add, '/trip-sheets/new'),
            secondary: _Action('Status', Icons.menu, '/trip-sheets'),
          ),
        5 => const _LinkCard(
            title: 'Payroll',
            summary: 'No payrolls available',
          ),
        6 => const _TimeTrackingCard(),
        7 => const _HomeMenu(),
        _ => const SizedBox.shrink(),
      },
    );
  }
}

// ─── CompanyCard ──────────────────────────────────────────────────────
// rounded-card bg-surface p-5 text-center shadow-card
//   h2 text-base font-bold text-ink
//   mt-3 flex justify-center
//     div h-16 w-16 rounded-xl bg-brand-light
//       span text-xl font-extrabold tracking-tight text-brand
class _CompanyCard extends StatelessWidget {
  const _CompanyCard();
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return AppCard(
      child: Column(children: [
        Text(
          mock.company.name,
          textAlign: TextAlign.center,
          style: Tx.base.copyWith(fontWeight: fw700, color: t.ink),
        ),
        const SizedBox(height: S.s3),
        Container(
          width: Sz.x16,
          height: Sz.x16,
          decoration: BoxDecoration(
            color: t.brandLight,
            borderRadius: BorderRadius.circular(R.r12),
          ),
          alignment: Alignment.center,
          child: Text(
            mock.company.monogram,
            style: Tx.xl.copyWith(
              fontWeight: fw800,
              letterSpacing: -0.4,
              color: t.brand,
            ),
          ),
        ),
      ]),
    );
  }
}

// ─── ComplianceCard ───────────────────────────────────────────────────
class _ComplianceCard extends StatelessWidget {
  const _ComplianceCard();
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final p = mock.driverProfile;
    return AppCard(
      onTap: () => context.push('/compliance'),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(children: [
            Text('My Compliance',
                style: Tx.base.copyWith(fontWeight: fw700, color: t.ink)),
            const Spacer(),
            Icon(Icons.chevron_right, size: Sz.x5, color: t.inkMuted),
          ]),
          const SizedBox(height: S.s4),
          Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(
              width: Sz.x20,
              height: Sz.x20,
              decoration: BoxDecoration(
                color: t.surfaceMuted,
                borderRadius: BorderRadius.circular(R.r8),
              ),
              alignment: Alignment.center,
              child: Text(p.initials,
                  style: Tx.xl.copyWith(fontWeight: fw700, color: t.inkMuted)),
            ),
            const SizedBox(width: S.s4),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _field(t, 'Name', 'JESSICA VEE'),
                  const SizedBox(height: S.s2_5),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(child: _field(t, 'License No', 'ON-1234-5678')),
                      const SizedBox(width: S.s3),
                      _field(t, 'Items', '2', alignRight: true),
                    ],
                  ),
                  const SizedBox(height: S.s2_5),
                  _field(t, 'Expiry', 'NOV 17, 2026'),
                ],
              ),
            ),
          ]),
          const SizedBox(height: S.s4),
          Container(height: 1, color: t.surfaceMuted),
          const SizedBox(height: S.s3),
          Row(children: [
            Icon(Icons.check, size: Sz.x4, color: t.success),
            const SizedBox(width: S.s1_5),
            Text('All documents valid',
                style: Tx.sm.copyWith(fontWeight: fw500, color: t.success)),
          ]),
        ],
      ),
    );
  }

  Widget _field(Tokens t, String label, String value,
      {bool alignRight = false}) {
    return Column(
      crossAxisAlignment:
          alignRight ? CrossAxisAlignment.end : CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(),
            style: Tx.t10.copyWith(
                fontWeight: fw600,
                letterSpacing: 0.5,
                color: t.inkMuted)),
        Text(value,
            textAlign: alignRight ? TextAlign.right : TextAlign.left,
            style: Tx.sm.copyWith(fontWeight: fw600, color: t.ink)),
      ],
    );
  }
}

// ─── ActionCard ───────────────────────────────────────────────────────
class _Action {
  final String label;
  final IconData icon;
  final String? href;
  const _Action(this.label, this.icon, this.href);
}

class _ActionCard extends StatelessWidget {
  const _ActionCard({
    required this.title,
    required this.primary,
    required this.secondary,
  });
  final String title;
  final _Action primary;
  final _Action secondary;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(title,
              style: Tx.base.copyWith(fontWeight: fw700, color: t.ink)),
          const SizedBox(height: S.s4),
          Row(children: [
            Expanded(
              child: AppPrimaryButton(
                label: primary.label,
                icon: primary.icon,
                fullWidth: false,
                onPressed: primary.href == null
                    ? null
                    : () => context.push(primary.href!),
              ),
            ),
            const SizedBox(width: S.s3),
            Expanded(
              child: AppSecondaryButton(
                label: secondary.label,
                icon: secondary.icon,
                fullWidth: false,
                onPressed: secondary.href == null
                    ? null
                    : () => context.push(secondary.href!),
              ),
            ),
          ]),
        ],
      ),
    );
  }
}

// ─── LinkCard ─────────────────────────────────────────────────────────
class _LinkCard extends StatelessWidget {
  const _LinkCard({required this.title, required this.summary});
  final String title;
  final String summary;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(children: [
            Text(title,
                style: Tx.base.copyWith(fontWeight: fw700, color: t.ink)),
            const Spacer(),
            Icon(Icons.chevron_right, size: Sz.x5, color: t.inkMuted),
          ]),
          const SizedBox(height: S.s3),
          Center(child: Text(summary, style: Tx.sm.copyWith(color: t.inkMuted))),
        ],
      ),
    );
  }
}

// ─── TimeTrackingCard ─────────────────────────────────────────────────
class _TimeTrackingCard extends StatefulWidget {
  const _TimeTrackingCard();
  @override
  State<_TimeTrackingCard> createState() => _TimeTrackingCardState();
}

class _TimeTrackingCardState extends State<_TimeTrackingCard> {
  DateTime? _since;
  Timer? _ticker;

  void _toggle() {
    setState(() {
      if (_since != null) {
        _since = null;
        _ticker?.cancel();
        _ticker = null;
      } else {
        _since = DateTime.now();
        _ticker = Timer.periodic(const Duration(seconds: 1), (_) {
          if (mounted) setState(() {});
        });
      }
    });
  }

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
  }

  String _elapsed() {
    if (_since == null) return '00:00:00';
    final d = DateTime.now().difference(_since!);
    String two(int n) => n.toString().padLeft(2, '0');
    return '${two(d.inHours)}:${two(d.inMinutes % 60)}:${two(d.inSeconds % 60)}';
  }

  String _startedLabel() => _since == null
      ? ''
      : TimeOfDay.fromDateTime(_since!).format(context);

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final on = _since != null;
    return AppCard(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Time Tracking',
                    style: Tx.base.copyWith(fontWeight: fw700, color: t.ink)),
                const SizedBox(height: 2),
                Text(
                  on
                      ? 'Clocked in at ${_startedLabel()}'
                      : 'Currently Clocked Out',
                  style: Tx.xs.copyWith(
                    fontWeight: fw500,
                    color: on ? t.success : t.inkMuted,
                  ),
                ),
              ],
            ),
          ),
          if (on) ...[
            Text(_elapsed(),
                style: Tx.sm.copyWith(
                  fontFamily: 'monospace',
                  fontFeatures: const [FontFeature.tabularFigures()],
                  fontWeight: fw700,
                  color: t.success,
                )),
            const SizedBox(width: S.s3),
          ],
          AppSwitch(value: on, onChanged: (_) => _toggle()),
        ],
      ),
    );
  }
}

// ─── HomeMenu ─────────────────────────────────────────────────────────
class _HomeMenu extends StatelessWidget {
  const _HomeMenu();

  void _confirmLogout(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Do you want to log out?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(
                backgroundColor: Tokens.of(context).danger),
            onPressed: () {
              Navigator.of(ctx).pop();
              context.go('/auth/sign-in');
            },
            child: const Text('Log out'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(children: [
          Expanded(
            child: _CardButton(
              icon: Icons.refresh,
              label: 'Refresh',
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Refreshed')));
              },
            ),
          ),
          const SizedBox(width: S.s4),
          Expanded(
            child: _CardButton(
              icon: Icons.help_outline,
              label: 'Help',
              onTap: () {},
            ),
          ),
        ]),
        const SizedBox(height: S.s4),
        _CardButton(
          icon: Icons.logout,
          label: 'Logout',
          danger: true,
          onTap: () => _confirmLogout(context),
        ),
      ],
    );
  }
}

class _CardButton extends StatelessWidget {
  const _CardButton({
    required this.icon,
    required this.label,
    required this.onTap,
    this.danger = false,
  });
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool danger;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final fg = danger ? t.danger : t.ink;
    final iconColor = danger ? t.danger : t.inkMuted;
    return AppCard(
      onTap: onTap,
      padding: const EdgeInsets.all(S.s4),
      borderColor: danger ? t.danger : null,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: Sz.x4, color: iconColor),
          const SizedBox(width: S.s2),
          Text(label, style: Tx.sm.copyWith(fontWeight: fw600, color: fg)),
        ],
      ),
    );
  }
}
