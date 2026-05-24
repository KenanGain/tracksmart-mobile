import 'package:flutter/material.dart';

import '../app/theme.dart';

class PillTab {
  final String key;
  final String label;
  final IconData? icon;
  const PillTab({required this.key, required this.label, this.icon});
}

/// Rounded-pill / bubble tab bar — used by Trips and Expense Status.
class PillTabs extends StatelessWidget {
  const PillTabs({
    super.key,
    required this.tabs,
    required this.active,
    required this.onChanged,
  });

  final List<PillTab> tabs;
  final String active;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: t.surfaceMuted,
        borderRadius: BorderRadius.circular(999),
        boxShadow: [
          BoxShadow(color: t.ink.withOpacity(0.05), blurRadius: 2),
        ],
      ),
      child: Row(
        children: tabs.map((tab) {
          final isActive = tab.key == active;
          return Expanded(
            child: GestureDetector(
              onTap: () => onChanged(tab.key),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: isActive ? t.brand : Colors.transparent,
                  borderRadius: BorderRadius.circular(999),
                  boxShadow: isActive
                      ? [
                          BoxShadow(
                            color: t.ink.withOpacity(0.14),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ]
                      : null,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (tab.icon != null) ...[
                      Icon(tab.icon,
                          size: 16,
                          color: isActive ? Colors.white : t.inkMuted),
                      const SizedBox(width: 6),
                    ],
                    Text(
                      tab.label,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: isActive ? Colors.white : t.inkMuted,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
