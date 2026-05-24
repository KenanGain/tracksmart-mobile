import 'package:flutter_test/flutter_test.dart';

import 'package:tracksmart_mobile/app/theme_controller.dart';
import 'package:tracksmart_mobile/main.dart';

void main() {
  testWidgets('App boots and renders the sign-in route',
      (WidgetTester tester) async {
    await tester.pumpWidget(TrackSmartApp(themeController: ThemeController()));
    await tester.pumpAndSettle();
    // The sign-in screen is the unauthenticated landing route.
    expect(find.text('Sign in'), findsWidgets);
  });
}
