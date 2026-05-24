import 'package:flutter/material.dart';

import 'app/router.dart';
import 'app/theme.dart';
import 'app/theme_controller.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final theme = ThemeController();
  await theme.load();
  runApp(TrackSmartApp(themeController: theme));
}

class TrackSmartApp extends StatelessWidget {
  const TrackSmartApp({super.key, required this.themeController});
  final ThemeController themeController;

  @override
  Widget build(BuildContext context) {
    return ThemeScope(
      controller: themeController,
      child: ValueListenableBuilder<ThemeMode>(
        valueListenable: themeController,
        builder: (_, mode, __) => MaterialApp.router(
          title: 'TrackSmart',
          debugShowCheckedModeBanner: false,
          theme: buildTheme(Brightness.light),
          darkTheme: buildTheme(Brightness.dark),
          themeMode: mode,
          routerConfig: router,
          // Wrap every route in a 440px phone-shell on wide screens so
          // detail routes (sign-in, chat thread, maintenance form, the
          // account drawer, etc.) all live inside the same phone frame
          // as the tabbed (app)/ screens. On real phones (≤ 440px wide)
          // this is a no-op — the child renders at full screen width.
          builder: (context, child) => _PhoneFrame(child: child ?? const SizedBox()),
        ),
      ),
    );
  }
}

class _PhoneFrame extends StatelessWidget {
  const _PhoneFrame({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final mq = MediaQuery.of(context);
    if (mq.size.width <= kShellMaxWidth) return child;
    final t = Tokens.of(context);
    return ColoredBox(
      color: t.backdrop,
      child: Center(
        child: ClipRect(
          child: SizedBox(
            width: kShellMaxWidth,
            height: mq.size.height,
            // Override MediaQuery so the child computes layout as if the
            // screen were exactly 440 wide — `MediaQuery.size.width * 0.7`
            // bubbles, etc., size correctly.
            child: MediaQuery(
              data: mq.copyWith(
                size: Size(kShellMaxWidth, mq.size.height),
              ),
              child: child,
            ),
          ),
        ),
      ),
    );
  }
}
