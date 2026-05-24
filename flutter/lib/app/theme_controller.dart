import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Holds the current `ThemeMode` and persists it to SharedPreferences so
/// the user's choice survives restarts. Toggled by the sun / moon button
/// in the TopBar, or set explicitly from the Settings → Appearance row.
class ThemeController extends ValueNotifier<ThemeMode> {
  ThemeController() : super(ThemeMode.system);

  static const _key = 'theme';

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_key);
    if (saved == 'dark') value = ThemeMode.dark;
    if (saved == 'light') value = ThemeMode.light;
    if (saved == 'system') value = ThemeMode.system;
  }

  Future<void> setMode(ThemeMode mode) async {
    value = mode;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      _key,
      switch (mode) {
        ThemeMode.dark => 'dark',
        ThemeMode.light => 'light',
        ThemeMode.system => 'system',
      },
    );
  }

  Future<void> toggle(Brightness platform) async {
    final isDark = value == ThemeMode.dark ||
        (value == ThemeMode.system && platform == Brightness.dark);
    await setMode(isDark ? ThemeMode.light : ThemeMode.dark);
  }
}

/// Inherited accessor so any widget can grab the controller.
class ThemeScope extends InheritedNotifier<ThemeController> {
  const ThemeScope({
    super.key,
    required ThemeController controller,
    required super.child,
  }) : super(notifier: controller);

  static ThemeController of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<ThemeScope>();
    assert(scope != null, 'ThemeScope not found in context');
    return scope!.notifier!;
  }
}
