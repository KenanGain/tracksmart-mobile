import 'package:flutter/material.dart';

/// Exact Tailwind → Flutter mapping. Every spacing / radius / shadow /
/// text value the Next.js app uses is reproduced here at the same pixel
/// value, so screens can be translated class-by-class.

// ─── Spacing (Tailwind's 4px scale) ───────────────────────────────────
//   p-1 = 4   p-2 = 8   p-3 = 12   p-4 = 16   p-5 = 20   p-6 = 24
//   p-2.5 = 10  p-1.5 = 6  p-0.5 = 2
class S {
  static const s0_5 = 2.0;
  static const s1 = 4.0;
  static const s1_5 = 6.0;
  static const s2 = 8.0;
  static const s2_5 = 10.0;
  static const s3 = 12.0;
  static const s4 = 16.0;
  static const s5 = 20.0;
  static const s6 = 24.0;
  static const s7 = 28.0;
  static const s8 = 32.0;
  static const s10 = 40.0;
  static const s12 = 48.0;
}

// ─── Radius ───────────────────────────────────────────────────────────
//   rounded = 4   rounded-md = 6   rounded-lg = 8   rounded-xl = 12
//   rounded-card = 14 (project custom)   rounded-full = 9999
class R {
  static const r4 = 4.0;
  static const r6 = 6.0;
  static const r8 = 8.0;
  static const r12 = 12.0;
  static const r14 = 14.0; // rounded-card
  static const r16 = 16.0;
  static const rFull = 999.0;
}

// ─── Sizes (icons / avatars / chips) ──────────────────────────────────
//   h-3 = 12  h-4 = 16  h-5 = 20  h-6 = 24  h-7 = 28  h-9 = 36
//   h-10 = 40  h-11 = 44  h-12 = 48  h-14 = 56  h-16 = 64  h-20 = 80
class Sz {
  static const x3 = 12.0;
  static const x4 = 16.0;
  static const x5 = 20.0;
  static const x6 = 24.0;
  static const x7 = 28.0;
  static const x9 = 36.0;
  static const x10 = 40.0;
  static const x11 = 44.0;
  static const x12 = 48.0;
  static const x14 = 56.0;
  static const x16 = 64.0;
  static const x20 = 80.0;
}

// ─── Font weights (Tailwind → Flutter) ────────────────────────────────
const fw400 = FontWeight.w400; // font-normal
const fw500 = FontWeight.w500; // font-medium
const fw600 = FontWeight.w600; // font-semibold
const fw700 = FontWeight.w700; // font-bold
const fw800 = FontWeight.w800; // font-extrabold

// ─── Text sizes (Tailwind → Flutter, line-height ratios) ──────────────
//   text-[10px] = 10   text-[11px] = 11   text-xs = 12   text-[13px] = 13
//   text-sm = 14   text-base = 16   text-lg = 18   text-xl = 20
class Tx {
  static const t10 = TextStyle(fontSize: 10, height: 1.4);
  static const t11 = TextStyle(fontSize: 11, height: 1.4);
  static const xs = TextStyle(fontSize: 12, height: 1.33);
  static const t13 = TextStyle(fontSize: 13, height: 1.4);
  static const sm = TextStyle(fontSize: 14, height: 1.43);
  static const base = TextStyle(fontSize: 16, height: 1.5);
  static const lg = TextStyle(fontSize: 18, height: 1.55);
  static const xl = TextStyle(fontSize: 20, height: 1.4);
}

// ─── Shell insets ─────────────────────────────────────────────────────
// The floating bubble nav lives inside the shell at the bottom. Screens
// add this much bottom padding to their scrollables so the last item
// isn't hidden behind the nav, while the nav's BackdropFilter still
// blurs the content that scrolls past it.
const double kShellBottomInset = 96;

// ─── Shadows ──────────────────────────────────────────────────────────
//   shadow-card: 0 1px 3px rgba(15,23,42,0.08)
//   shadow-nav:  0 6px 24px rgba(15,23,42,0.14)
//   These use literal ink (#0F172A) so the shadow stays subtle in both
//   themes — exactly how Tailwind renders them.
const _inkRgb = Color(0xFF0F172A);

final List<BoxShadow> shadowCard = [
  BoxShadow(
    color: _inkRgb.withValues(alpha: 0.08),
    blurRadius: 3,
    offset: const Offset(0, 1),
  ),
];

final List<BoxShadow> shadowNav = [
  BoxShadow(
    color: _inkRgb.withValues(alpha: 0.14),
    blurRadius: 24,
    offset: const Offset(0, 6),
  ),
];
