import 'package:flutter/material.dart';

import '../app/theme.dart';
import '../models.dart';

/// Pending / Approved / Rejected pill — mirrors `StatusBadge.tsx`.
class StatusBadge extends StatelessWidget {
  const StatusBadge({super.key, required this.status});
  final ExpenseStatus status;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final (Color bg, Color fg, String label) = switch (status) {
      ExpenseStatus.pending => (
          t.warning.withOpacity(0.1),
          t.warning,
          'Pending'
        ),
      ExpenseStatus.approved => (
          t.success.withOpacity(0.1),
          t.success,
          'Approved'
        ),
      ExpenseStatus.rejected => (
          t.danger.withOpacity(0.1),
          t.danger,
          'Rejected'
        ),
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: fg,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
