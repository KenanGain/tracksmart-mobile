import 'package:flutter/material.dart';

import '../app/scale.dart';
import '../app/theme.dart';

/// The canonical card: `rounded-card bg-surface p-5 shadow-card` —
/// matches the Next.js `Card` look exactly (14px radius, 20px padding,
/// subtle ink shadow). Override `padding` per-call when the source uses
/// p-4 or other.
class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(S.s5),
    this.onTap,
    this.color,
    this.borderColor,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;
  final Color? color;
  final Color? borderColor;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final bg = color ?? t.surface;
    final radius = BorderRadius.circular(R.r14);
    final decoration = BoxDecoration(
      color: bg,
      borderRadius: radius,
      boxShadow: shadowCard,
      border:
          borderColor != null ? Border.all(color: borderColor!) : null,
    );
    final inner = Padding(padding: padding, child: child);
    return DecoratedBox(
      decoration: decoration,
      child: onTap == null
          ? inner
          : Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: onTap,
                borderRadius: radius,
                child: inner,
              ),
            ),
    );
  }
}

/// `bg-brand text-white rounded-lg py-3 text-sm font-semibold` — primary
/// action button. Default fills its parent width.
class AppPrimaryButton extends StatelessWidget {
  const AppPrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.fullWidth = true,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final bool fullWidth;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final child = Row(
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: fullWidth ? MainAxisSize.max : MainAxisSize.min,
      children: [
        if (icon != null) ...[
          Icon(icon, size: Sz.x4),
          const SizedBox(width: S.s1_5),
        ],
        Text(label,
            style: Tx.sm.copyWith(fontWeight: fw600, color: Colors.white)),
      ],
    );
    final btn = Material(
      color: onPressed == null ? t.backdrop : t.brand,
      borderRadius: BorderRadius.circular(R.r8),
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(R.r8),
        child: Padding(
          padding:
              const EdgeInsets.symmetric(horizontal: S.s4, vertical: S.s3),
          child: child,
        ),
      ),
    );
    return fullWidth ? SizedBox(width: double.infinity, child: btn) : btn;
  }
}

/// `border border-slate-200 bg-surface text-ink rounded-lg py-3 text-sm
/// font-semibold` — outlined secondary button. `danger: true` swaps to a
/// red outline (used by Logout).
class AppSecondaryButton extends StatelessWidget {
  const AppSecondaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.fullWidth = true,
    this.danger = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final bool fullWidth;
  final bool danger;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final fg = danger ? t.danger : t.ink;
    final border = danger ? t.danger : t.ink.withValues(alpha: 0.15);
    final child = Row(
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: fullWidth ? MainAxisSize.max : MainAxisSize.min,
      children: [
        if (icon != null) ...[
          Icon(icon, size: Sz.x4, color: danger ? fg : t.inkMuted),
          const SizedBox(width: S.s1_5),
        ],
        Text(label,
            style: Tx.sm.copyWith(fontWeight: fw600, color: fg)),
      ],
    );
    final btn = Material(
      color: t.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(R.r8),
        side: BorderSide(color: border),
      ),
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(R.r8),
        child: Padding(
          padding:
              const EdgeInsets.symmetric(horizontal: S.s4, vertical: S.s3),
          child: child,
        ),
      ),
    );
    return fullWidth ? SizedBox(width: double.infinity, child: btn) : btn;
  }
}

/// `text-[11px] font-semibold uppercase tracking-wide text-ink-muted` —
/// the tiny grey label above input groups and section headers.
class SectionLabel extends StatelessWidget {
  const SectionLabel(this.text, {super.key});
  final String text;
  @override
  Widget build(BuildContext context) {
    return Text(
      text.toUpperCase(),
      style: Tx.t11.copyWith(
        fontWeight: fw600,
        letterSpacing: 0.5,
        color: Tokens.of(context).inkMuted,
      ),
    );
  }
}

/// `h-6 w-11 rounded-full` switch — matches the custom Tailwind toggle
/// used by TimeTracking and Settings. brand-blue when on, backdrop grey
/// when off, white knob slides 20px on toggle.
class AppSwitch extends StatelessWidget {
  const AppSwitch({super.key, required this.value, required this.onChanged});
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return GestureDetector(
      onTap: () => onChanged(!value),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        width: S.s4 + S.s5 + S.s2, // 44 = 16+20+8 — matches w-11
        height: Sz.x6, // 24 — matches h-6
        decoration: BoxDecoration(
          color: value ? t.brand : t.backdrop,
          borderRadius: BorderRadius.circular(R.rFull),
        ),
        child: AnimatedAlign(
          duration: const Duration(milliseconds: 150),
          alignment: value ? Alignment.centerRight : Alignment.centerLeft,
          child: Container(
            margin: const EdgeInsets.all(S.s0_5),
            width: Sz.x5,
            height: Sz.x5,
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: t.ink.withValues(alpha: 0.15),
                  blurRadius: 2,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
