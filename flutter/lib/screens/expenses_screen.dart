import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../app/theme.dart';
import '../data/repos.dart';
import '../models.dart';
import '../widgets/pill_tabs.dart';
import '../widgets/status_badge.dart';

class ExpensesScreen extends StatefulWidget {
  const ExpensesScreen({super.key});
  @override
  State<ExpensesScreen> createState() => _ExpensesScreenState();
}

class _ExpensesScreenState extends State<ExpensesScreen> {
  String _tab = 'payroll';
  String _query = '';
  List<ExpenseRecord>? _all;

  static const _tabs = [
    PillTab(key: 'payroll', label: 'Payroll Addition', icon: Icons.attach_money),
    PillTab(key: 'company', label: 'Company Paid', icon: Icons.business_outlined),
  ];

  @override
  void initState() {
    super.initState();
    ExpensesRepo.all().then((d) {
      if (mounted) setState(() => _all = d);
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final all = _all;
    if (all == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    final term = _query.trim().toLowerCase();
    final tabKind =
        _tab == 'payroll' ? ExpenseType.payroll : ExpenseType.company;
    final list = all
        .where((e) => e.expenseType == tabKind)
        .where((e) =>
            term.isEmpty ||
            '${e.description} ${e.tripId}'.toLowerCase().contains(term))
        .toList();

    return Scaffold(
      backgroundColor: t.surfaceMuted,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.chevron_left),
          onPressed: () => context.pop(),
        ),
        title: const Text('Expense Status',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          PillTabs(
            tabs: _tabs,
            active: _tab,
            onChanged: (k) => setState(() => _tab = k),
          ),
          const SizedBox(height: 12),
          TextField(
            decoration: const InputDecoration(
              hintText: 'Search expenses',
              prefixIcon: Icon(Icons.search),
            ),
            onChanged: (v) => setState(() => _query = v),
          ),
          const SizedBox(height: 12),
          if (list.isEmpty)
            Card(
              margin: EdgeInsets.zero,
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Center(
                  child: Text('No expenses found.',
                      style: TextStyle(color: t.inkMuted)),
                ),
              ),
            )
          else
            for (final e in list) ...[
              _row(e, t),
              const SizedBox(height: 8),
            ],
        ],
      ),
    );
  }

  Widget _row(ExpenseRecord e, Tokens t) {
    final date = DateTime.tryParse(e.submittedAt);
    final formatted = date == null ? e.submittedAt : DateFormat('MMM d, yyyy').format(date);
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(children: [
                Expanded(
                  child: Text(e.description,
                      style: TextStyle(
                          fontWeight: FontWeight.w700, color: t.ink)),
                ),
                StatusBadge(status: e.status),
              ]),
              const SizedBox(height: 6),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: t.brandLight,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  Icon(Icons.alt_route, size: 12, color: t.brand),
                  const SizedBox(width: 4),
                  Text('Trip ${e.tripId}',
                      style: TextStyle(
                          color: t.brand,
                          fontSize: 11,
                          fontWeight: FontWeight.w600)),
                ]),
              ),
              const SizedBox(height: 6),
              Text('${e.amount} ${e.currency} · $formatted',
                  style: TextStyle(color: t.inkMuted, fontSize: 12)),
            ]),
      ),
    );
  }
}
