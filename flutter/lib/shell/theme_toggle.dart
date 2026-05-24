import 'package:flutter/material.dart';

import '../app/theme.dart';
import '../app/theme_controller.dart';

/// Sun / moon button — toggles dark mode and persists the choice.
class ThemeToggle extends StatelessWidget {
  const ThemeToggle({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = ThemeScope.of(context);
    final t = Tokens.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return IconButton(
      tooltip: isDark ? 'Switch to light mode' : 'Switch to dark mode',
      icon: Icon(
        isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
        color: t.ink,
      ),
      onPressed: () => controller.toggle(MediaQuery.platformBrightnessOf(context)),
    );
  }
}
