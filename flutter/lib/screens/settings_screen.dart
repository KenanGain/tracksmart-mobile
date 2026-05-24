import 'package:flutter/material.dart';

import '../app/scale.dart';
import '../app/theme.dart';
import '../app/theme_controller.dart';
import '../widgets/primitives.dart';

/// Settings — 1:1 mirror of `components/account/SettingsScreen.tsx`.
/// Outer `section space-y-7` → 28px between groups.
class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});
  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  // Order + labels match the Next.js NOTIFICATIONS constant.
  final _notifications = <String, bool>{
    'Trip': false,
    'Message': true,
    'Bulletin': true,
    'Calendar': true,
  };

  int _fontIdx = 0;
  static const _fonts = ['Default', 'Small', 'Large'];

  static const _themeModes = [
    ThemeMode.system,
    ThemeMode.light,
    ThemeMode.dark,
  ];
  static const _themeLabels = {
    ThemeMode.system: 'Use system setting',
    ThemeMode.light: 'Light',
    ThemeMode.dark: 'Dark',
  };

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final controller = ThemeScope.of(context);

    return ListView(
      padding: const EdgeInsets.fromLTRB(
          S.s4, S.s4, S.s4, S.s4 + kShellBottomInset),
      children: [
        // ── Notifications group ─────────────────────────────────────────
        _GroupLabel('Notifications', t),
        const SizedBox(height: S.s2), // mt-2
        _DividedCard(t, [
          for (final entry in _notifications.entries)
            _NotifRow(
              label: entry.key,
              value: entry.value,
              onChanged: (v) =>
                  setState(() => _notifications[entry.key] = v),
            ),
        ]),

        const SizedBox(height: S.s7), // space-y-7 = 28

        // ── Appearance group ────────────────────────────────────────────
        _GroupLabel('Appearance', t),
        const SizedBox(height: S.s2),
        _DividedCard(t, [
          _CycleRow(
            label: 'Font Size',
            value: _fonts[_fontIdx],
            onTap: () =>
                setState(() => _fontIdx = (_fontIdx + 1) % _fonts.length),
          ),
          ValueListenableBuilder<ThemeMode>(
            valueListenable: controller,
            builder: (_, mode, __) => _CycleRow(
              label: 'Theme',
              value: _themeLabels[mode]!,
              onTap: () {
                final i = _themeModes.indexOf(mode);
                controller.setMode(
                    _themeModes[(i + 1) % _themeModes.length]);
              },
            ),
          ),
        ]),

        const SizedBox(height: S.s7),

        // ── Footer note: rounded-card border-dashed border-brand/40
        //                bg-brand-light/40 p-3 text-xs text-ink-muted ──
        const DottedNote(
          'Preferences are stored locally in this prototype. Connecting a '
          'backend will persist them across devices.',
        ),
      ],
    );
  }
}

/// `h2 text-xs font-semibold text-ink-muted` — note: plain case, NOT
/// the uppercase tracking-wide `SectionLabel` used elsewhere.
class _GroupLabel extends StatelessWidget {
  const _GroupLabel(this.text, this.t);
  final String text;
  final Tokens t;
  @override
  Widget build(BuildContext context) => Text(
        text,
        style: Tx.xs.copyWith(fontWeight: fw600, color: t.inkMuted),
      );
}

/// `divide-y divide-ink/5 rounded-card bg-surface shadow-card` — a list
/// card with hairline ink/5 dividers between every row.
class _DividedCard extends StatelessWidget {
  const _DividedCard(this.t, this.rows);
  final Tokens t;
  final List<Widget> rows;
  @override
  Widget build(BuildContext context) {
    final divider = Container(
      height: 1,
      color: t.ink.withValues(alpha: 0.05), // divide-ink/5
    );
    return AppCard(
      padding: EdgeInsets.zero,
      child: Column(
        children: [
          for (var i = 0; i < rows.length; i++) ...[
            if (i > 0) divider,
            rows[i],
          ],
        ],
      ),
    );
  }
}

/// One row of the Notifications card.
/// `flex items-center justify-between gap-3 px-4 py-3.5`
/// label: `text-base font-semibold text-ink`
class _NotifRow extends StatelessWidget {
  const _NotifRow({
    required this.label,
    required this.value,
    required this.onChanged,
  });
  final String label;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: S.s4, // px-4
        vertical: 14, // py-3.5 = 14
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: Tx.base.copyWith(fontWeight: fw600, color: t.ink),
            ),
          ),
          const SizedBox(width: S.s3), // gap-3
          AppSwitch(value: value, onChanged: onChanged),
        ],
      ),
    );
  }
}

/// Appearance row — tap cycles to the next value.
/// `flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left`
/// label: `text-base font-semibold text-ink`
/// value: `text-sm text-ink-muted` + `chevron-right h-4 w-4`
class _CycleRow extends StatelessWidget {
  const _CycleRow({
    required this.label,
    required this.value,
    required this.onTap,
  });
  final String label;
  final String value;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: S.s4,
            vertical: 14,
          ),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  label,
                  style:
                      Tx.base.copyWith(fontWeight: fw600, color: t.ink),
                ),
              ),
              Text(value,
                  style: Tx.sm.copyWith(color: t.inkMuted)),
              const SizedBox(width: S.s1), // gap-1
              Icon(Icons.chevron_right,
                  size: Sz.x4, color: t.inkMuted),
            ],
          ),
        ),
      ),
    );
  }
}

/// `rounded-card border border-dashed border-brand/40 bg-brand-light/40
///  p-3 text-xs text-ink-muted` — the soft brand-tinted footer note.
class DottedNote extends StatelessWidget {
  const DottedNote(this.text, {super.key});
  final String text;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return _DashedBorder(
      color: t.brand.withValues(alpha: 0.4),
      radius: R.r14,
      child: Container(
        decoration: BoxDecoration(
          color: t.brandLight.withValues(alpha: 0.4),
          borderRadius: BorderRadius.circular(R.r14),
        ),
        padding: const EdgeInsets.all(S.s3),
        child: Text(text,
            style: Tx.xs.copyWith(color: t.inkMuted)),
      ),
    );
  }
}

/// Paints a 1px dashed rectangular border (no real CSS equivalent in
/// Flutter, so we draw it ourselves). Used by the Settings footer.
class _DashedBorder extends StatelessWidget {
  const _DashedBorder({
    required this.color,
    required this.radius,
    required this.child,
  });
  final Color color;
  final double radius;
  final Widget child;
  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: _DashedRectPainter(color: color, radius: radius),
      child: child,
    );
  }
}

class _DashedRectPainter extends CustomPainter {
  _DashedRectPainter({required this.color, required this.radius});
  final Color color;
  final double radius;
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;
    final rrect = RRect.fromRectAndRadius(
      Offset.zero & size,
      Radius.circular(radius),
    );
    // Walk the rounded-rect path and draw 4-on / 4-off dashes.
    final path = Path()..addRRect(rrect);
    for (final metric in path.computeMetrics()) {
      var dist = 0.0;
      const dash = 4.0;
      const gap = 4.0;
      while (dist < metric.length) {
        final next = (dist + dash).clamp(0.0, metric.length);
        canvas.drawPath(metric.extractPath(dist, next), paint);
        dist = next + gap;
      }
    }
  }

  @override
  bool shouldRepaint(_DashedRectPainter old) =>
      old.color != color || old.radius != radius;
}
