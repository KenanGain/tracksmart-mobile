import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../app/theme.dart';

/// Submit Expense — simplified single-screen form (the Next.js version
/// is a 5-step wizard). Mock submit returns to the previous screen.
class SubmitExpenseScreen extends StatefulWidget {
  const SubmitExpenseScreen({super.key});
  @override
  State<SubmitExpenseScreen> createState() => _SubmitExpenseScreenState();
}

class _SubmitExpenseScreenState extends State<SubmitExpenseScreen> {
  String _type = 'payroll';
  String _currency = 'CAD';
  String _category = 'general';
  final _amount = TextEditingController();
  final _desc = TextEditingController();
  final _notes = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Scaffold(
      backgroundColor: t.surfaceMuted,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.chevron_left),
          onPressed: () => context.pop(),
        ),
        title: const Text('Submit Expense',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _segment('Type', ['payroll', 'company'],
              ['Payroll Addition', 'Company Paid'], _type, (v) {
            setState(() => _type = v);
          }, t),
          const SizedBox(height: 16),
          Row(children: [
            Expanded(
              child: TextField(
                controller: _amount,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Amount'),
              ),
            ),
            const SizedBox(width: 8),
            _segment(null, ['USD', 'CAD'], ['USD', 'CAD'], _currency,
                (v) => setState(() => _currency = v), t),
          ]),
          const SizedBox(height: 16),
          TextField(
            controller: _desc,
            decoration: const InputDecoration(labelText: 'Description *'),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _notes,
            decoration: const InputDecoration(labelText: 'Notes (optional)'),
            maxLines: 3,
          ),
          const SizedBox(height: 16),
          _segment('Category', ['truck', 'trailer', 'general'],
              ['Truck', 'Trailer', 'General'], _category, (v) {
            setState(() => _category = v);
          }, t),
          const SizedBox(height: 24),
          FilledButton(
            style: FilledButton.styleFrom(
                minimumSize: const Size.fromHeight(48)),
            onPressed: _desc.text.trim().isEmpty
                ? null
                : () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Expense submitted')),
                    );
                    context.pop();
                  },
            child: const Text('Submit for Review'),
          ),
        ],
      ),
    );
  }

  Widget _segment(String? label, List<String> values, List<String> labels,
      String selected, ValueChanged<String> onChanged, Tokens t) {
    final body = Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(values.length, (i) {
        final active = values[i] == selected;
        return Padding(
          padding: const EdgeInsets.only(right: 6),
          child: ChoiceChip(
            label: Text(labels[i]),
            selected: active,
            onSelected: (_) => onChanged(values[i]),
          ),
        );
      }),
    );
    if (label == null) return body;
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label.toUpperCase(),
          style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.5,
              color: t.inkMuted)),
      const SizedBox(height: 6),
      body,
    ]);
  }
}
