import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../app/scale.dart';
import '../app/theme.dart';

class _NavItem {
  final String href;
  final String label;
  final IconData icon;
  const _NavItem(this.href, this.label, this.icon);
}

// Icons chosen to match Next.js Lucide icons:
//   home         → home_outlined
//   route        → route_outlined  (curve with two end-circles — NOT alt_route fork)
//   megaphone    → campaign_outlined
//   calendar     → calendar_today_outlined (binding + body, matches Lucide)
//   message-circle → chat_bubble_outline (rounded bubble)
const _items = [
  _NavItem('/home', 'Home', Icons.home_outlined),
  _NavItem('/trips', 'Trips', Icons.route_outlined),
  _NavItem('/bulletin', 'Bulletin', Icons.campaign_outlined),
  _NavItem('/calendar', 'Schedule', Icons.calendar_today_outlined),
  _NavItem('/chats', 'Chats', Icons.chat_bubble_outline),
];

/// Floating, translucent pill "bubble" nav — mirrors
/// `components/shell/BottomNav.tsx`:
///   `rounded-full bg-surface/80 px-2 py-2 shadow-nav ring-1 ring-ink/5
///    backdrop-blur-md`
class BottomNav extends StatelessWidget {
  const BottomNav({
    super.key,
    required this.location,
    this.badges = const {},
  });

  final String location;
  final Map<String, int> badges;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    // Layered:
    //   outer DecoratedBox  → drop shadow (must live OUTSIDE the clip so it
    //                          casts outward, not as a dark inner halo)
    //   ClipRRect           → rounds the bubble
    //   BackdropFilter      → blurs whatever scrolls behind
    //   inner DecoratedBox  → translucent fill + 1px hairline ring
    return SafeArea(
      top: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(S.s4, S.s2, S.s4, S.s4),
        child: DecoratedBox(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(R.rFull),
            boxShadow: [
              BoxShadow(
                // Dark ink shadow on dark mode reads as a ghosted halo;
                // use pure black at lower alpha so it stays subtle.
                color: isDark
                    ? Colors.black.withValues(alpha: 0.35)
                    : const Color(0xFF0F172A).withValues(alpha: 0.14),
                blurRadius: 24,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(R.rFull),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
              child: DecoratedBox(
                decoration: BoxDecoration(
                  // More translucent — 0.65 lets content show through the
                  // blur clearly so the bubble reads as glass, not a slab.
                  color: t.surface.withValues(alpha: 0.65),
                  borderRadius: BorderRadius.circular(R.rFull),
                  border: Border.all(
                    color: t.ink.withValues(alpha: isDark ? 0.08 : 0.05),
                    width: 0.5,
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: S.s2, vertical: S.s2),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      for (final item in _items)
                        Expanded(
                          child: _NavBtn(
                            item: item,
                            active: location == item.href ||
                                location.startsWith('${item.href}/'),
                            badge: badges[item.href] ?? 0,
                            t: t,
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _NavBtn extends StatelessWidget {
  const _NavBtn({
    required this.item,
    required this.active,
    required this.badge,
    required this.t,
  });

  final _NavItem item;
  final bool active;
  final int badge;
  final Tokens t;

  @override
  Widget build(BuildContext context) {
    final iconColor = active ? t.brand : t.inkMuted;
    // Active pill = brand-light per Next.js spec (`bg-brand-light text-brand`).
    // In dark mode brandLight is the dark-navy `#1E2954`; in light mode it's
    // sky `#DBEAFE`. Both render as a clearly-defined pill behind the icon.
    final iconBg = active ? t.brandLight : Colors.transparent;
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => context.go(item.href),
        borderRadius: BorderRadius.circular(R.r16),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: S.s1),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Stack(
                clipBehavior: Clip.none,
                children: [
                  Container(
                    width: Sz.x9,
                    height: Sz.x9,
                    decoration: BoxDecoration(
                      color: iconBg,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(item.icon, size: Sz.x5, color: iconColor),
                  ),
                  if (badge > 0)
                    Positioned(
                      right: -2,
                      top: -2,
                      child: Container(
                        constraints: const BoxConstraints(
                            minWidth: 16, minHeight: 16),
                        padding:
                            const EdgeInsets.symmetric(horizontal: 4),
                        decoration: BoxDecoration(
                          color: t.danger,
                          borderRadius: BorderRadius.circular(R.rFull),
                          border: Border.all(color: t.surface, width: 2),
                        ),
                        child: Center(
                          child: Text(
                            badge > 9 ? '9+' : '$badge',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              height: 1,
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: S.s1),
              Text(item.label,
                  style: Tx.t10.copyWith(
                      fontWeight: fw500,
                      height: 1,
                      color: iconColor)),
            ],
          ),
        ),
      ),
    );
  }
}
