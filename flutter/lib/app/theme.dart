import 'package:flutter/material.dart';

/// Design tokens — mirrors `tailwind.config.ts` + `app/globals.css` CSS
/// variables in the Next.js app. Light is the default; dark is a
/// near-black ("pitch black") palette.
class Tokens {
  final Color brand;
  final Color brandDark;
  final Color brandLight;
  final Color success;
  final Color warning;
  final Color danger;
  final Color surface;
  final Color surfaceMuted;
  final Color backdrop;
  final Color ink;
  final Color inkMuted;

  const Tokens({
    required this.brand,
    required this.brandDark,
    required this.brandLight,
    required this.success,
    required this.warning,
    required this.danger,
    required this.surface,
    required this.surfaceMuted,
    required this.backdrop,
    required this.ink,
    required this.inkMuted,
  });

  static const Tokens light = Tokens(
    brand: Color(0xFF1D4ED8),
    brandDark: Color(0xFF1E3A8A),
    brandLight: Color(0xFFDBEAFE),
    success: Color(0xFF15803D),
    warning: Color(0xFFB45309),
    danger: Color(0xFFB91C1C),
    surface: Color(0xFFFFFFFF),
    surfaceMuted: Color(0xFFF4F5F7),
    backdrop: Color(0xFFCBD5E1),
    ink: Color(0xFF0F172A),
    inkMuted: Color(0xFF64748B),
  );

  static const Tokens dark = Tokens(
    brand: Color(0xFF3B82F6),
    brandDark: Color(0xFF2563EB),
    brandLight: Color(0xFF1E2954),
    success: Color(0xFF22C55E),
    warning: Color(0xFFF59E0B),
    danger: Color(0xFFF87171),
    surface: Color(0xFF18181B),
    surfaceMuted: Color(0xFF09090B),
    backdrop: Color(0xFF3F3F46),
    ink: Color(0xFFFAFAFA),
    inkMuted: Color(0xFFA1A1AA),
  );

  static Tokens of(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? dark : light;
  }
}

/// The phone-frame max width — 440px, iPhone 16 Pro Max logical width.
const double kShellMaxWidth = 440;

/// Card corner radius — `rounded-card` (~14px).
const double kCardRadius = 14;

ThemeData buildTheme(Brightness brightness) {
  final t = brightness == Brightness.dark ? Tokens.dark : Tokens.light;
  return ThemeData(
    brightness: brightness,
    scaffoldBackgroundColor: t.surfaceMuted,
    colorScheme: ColorScheme(
      brightness: brightness,
      primary: t.brand,
      onPrimary: Colors.white,
      secondary: t.brandLight,
      onSecondary: t.brand,
      surface: t.surface,
      onSurface: t.ink,
      error: t.danger,
      onError: Colors.white,
    ),
    textTheme: ThemeData(brightness: brightness).textTheme.apply(
          bodyColor: t.ink,
          displayColor: t.ink,
        ),
    iconTheme: IconThemeData(color: t.ink),
    cardTheme: CardThemeData(
      elevation: 1,
      color: t.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(kCardRadius),
      ),
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: t.surface.withOpacity(0.85),
      foregroundColor: t.ink,
      elevation: 0,
      scrolledUnderElevation: 0,
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: t.surfaceMuted,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide.none,
      ),
    ),
  );
}
