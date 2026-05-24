import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../app/scale.dart';
import '../app/theme.dart';

/// Request Work Order — 1:1 mirror of `components/maintenance/RequestWorkOrderForm.tsx`.
class MaintenanceScreen extends StatefulWidget {
  const MaintenanceScreen({super.key});
  @override
  State<MaintenanceScreen> createState() => _MaintenanceScreenState();
}

class _MaintenanceScreenState extends State<MaintenanceScreen> {
  String _asset = 'Truck';
  String _priority = 'Medium';
  String _category = '';
  String _woCategory = '';
  String _reason = '';
  final _description = TextEditingController();
  final _notes = TextEditingController();
  final _odometer = TextEditingController();
  int _photos = 0;
  bool _submitting = false;

  static const _priorities = ['Low', 'Medium', 'High', 'Critical'];
  static const _categories = [
    'Engine', 'Transmission', 'Brakes', 'Tires & Wheels', 'Electrical',
    'Lights', 'Body & Cab', 'Refrigeration Unit', 'HVAC', 'Other'
  ];
  static const _woCategories = [
    'Repair', 'Preventive Maintenance', 'Inspection', 'Diagnostic', 'Other'
  ];
  static const _reasons = [
    'Breakdown', 'Scheduled Service', 'Damage', 'Recall', 'Wear & Tear', 'Other'
  ];
  static const _assetNumbers = {'Truck': '001', 'Trailer': 'RL8095'};

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final disabled = _description.text.trim().isEmpty || _submitting;
    return Scaffold(
      backgroundColor: t.surfaceMuted,
      body: SafeArea(
        child: Column(children: [
          // Header: h-14 border-b bg-surface px-3
          const _Header(title: 'Request Work Order'),
          // Body
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(S.s4, S.s4, S.s4, S.s8),
              children: [
                const _Label('Asset'),
                const SizedBox(height: S.s1_5),
                _Segmented(
                  options: const ['Truck', 'Trailer'],
                  value: _asset,
                  onChanged: (v) => setState(() => _asset = v),
                ),
                const SizedBox(height: S.s2),
                _AssetBadge(text: _assetNumbers[_asset]!),

                const SizedBox(height: S.s5),
                const _Label('Priority'),
                const SizedBox(height: S.s1_5),
                _Segmented(
                  options: _priorities,
                  value: _priority,
                  onChanged: (v) => setState(() => _priority = v),
                ),

                const SizedBox(height: S.s5),
                _SelectField(
                  label: 'Category',
                  placeholder: 'Select category',
                  value: _category,
                  options: _categories,
                  onChanged: (v) => setState(() => _category = v ?? ''),
                ),
                const SizedBox(height: S.s5),
                _SelectField(
                  label: 'Work Order Category',
                  placeholder: 'Select work order category',
                  value: _woCategory,
                  options: _woCategories,
                  onChanged: (v) => setState(() => _woCategory = v ?? ''),
                ),
                const SizedBox(height: S.s5),
                _SelectField(
                  label: 'Reason (optional)',
                  placeholder: 'Select reason',
                  value: _reason,
                  options: _reasons,
                  onChanged: (v) => setState(() => _reason = v ?? ''),
                ),

                const SizedBox(height: S.s5),
                _LabelRich(children: [
                  TextSpan(
                      text: 'Description ',
                      style: Tx.t13.copyWith(
                          fontWeight: fw600, color: t.ink)),
                  TextSpan(
                      text: '*',
                      style: Tx.t13.copyWith(
                          fontWeight: fw600, color: t.danger)),
                ]),
                const SizedBox(height: S.s1_5),
                _Textarea(
                  controller: _description,
                  hint: "What's going on with the vehicle?",
                  onChanged: (_) => setState(() {}),
                ),

                const SizedBox(height: S.s5),
                const _Label('Notes (optional)'),
                const SizedBox(height: S.s1_5),
                _Textarea(
                  controller: _notes,
                  hint: 'Any additional context',
                ),

                const SizedBox(height: S.s5),
                const _Label('Odometer (optional)'),
                const SizedBox(height: S.s1_5),
                _Input(
                  controller: _odometer,
                  keyboard: TextInputType.number,
                  hint: 'e.g. 412503',
                ),

                const SizedBox(height: S.s5),
                const _Label('Photos (optional)'),
                const SizedBox(height: S.s1_5),
                Wrap(
                  spacing: S.s2,
                  runSpacing: S.s2,
                  children: [
                    for (var i = 0; i < _photos; i++)
                      _PhotoSlot(
                        bordered: false,
                        child: Icon(Icons.image_outlined,
                            color: t.inkMuted, size: Sz.x6),
                      ),
                    _PhotoSlot(
                      bordered: true,
                      onTap: () => setState(() => _photos++),
                      child: Icon(Icons.add,
                          color: t.inkMuted, size: Sz.x6),
                    ),
                  ],
                ),

                const SizedBox(height: S.s6),
                _SubmitButton(
                  disabled: disabled,
                  label: _submitting ? 'Submitting…' : 'Submit Request',
                  onPressed: disabled
                      ? null
                      : () async {
                          setState(() => _submitting = true);
                          final messenger = ScaffoldMessenger.of(context);
                          final go = GoRouter.of(context);
                          await Future<void>.delayed(
                              const Duration(milliseconds: 200));
                          if (!mounted) return;
                          messenger.showSnackBar(const SnackBar(
                              content: Text('Work order submitted')));
                          go.pop();
                        },
                ),
              ],
            ),
          ),
        ]),
      ),
    );
  }
}

// ─── Local primitives (matched to the Next.js form classes) ─────────

/// `flex h-14 items-center border-b border-ink/5 bg-surface px-3`
class _Header extends StatelessWidget {
  const _Header({required this.title});
  final String title;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Container(
      height: 56,
      decoration: BoxDecoration(
        color: t.surface,
        border: Border(
            bottom: BorderSide(color: t.ink.withValues(alpha: 0.05))),
      ),
      padding: const EdgeInsets.symmetric(horizontal: S.s3),
      child: Row(children: [
        // h-9 w-9 rounded-full back button
        Material(
          color: Colors.transparent,
          shape: const CircleBorder(),
          child: InkWell(
            onTap: () => context.pop(),
            customBorder: const CircleBorder(),
            child: SizedBox(
              width: 36,
              height: 36,
              child: Icon(Icons.chevron_left, color: t.ink, size: Sz.x5),
            ),
          ),
        ),
        Expanded(
          child: Center(
            child: Text(title,
                style: Tx.lg.copyWith(fontWeight: fw700, color: t.ink)),
          ),
        ),
        const SizedBox(width: 36),
      ]),
    );
  }
}

/// `mb-1.5 block text-[13px] font-semibold text-ink`
class _Label extends StatelessWidget {
  const _Label(this.text);
  final String text;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Text(text,
        style: Tx.t13.copyWith(fontWeight: fw600, color: t.ink));
  }
}

class _LabelRich extends StatelessWidget {
  const _LabelRich({required this.children});
  final List<InlineSpan> children;
  @override
  Widget build(BuildContext context) => Text.rich(TextSpan(children: children));
}

/// `inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold text-white`
class _AssetBadge extends StatelessWidget {
  const _AssetBadge({required this.text});
  final String text;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        padding: const EdgeInsets.symmetric(
            horizontal: S.s3, vertical: S.s1),
        decoration: BoxDecoration(
          color: t.brand,
          borderRadius: BorderRadius.circular(R.rFull),
        ),
        child: Text(text,
            style: Tx.xs.copyWith(
                fontWeight: fw700, color: Colors.white)),
      ),
    );
  }
}

/// `flex gap-2 / button flex-1 rounded-lg px-1 py-2.5 text-sm font-semibold`
/// active: bg-brand text-white | else border border-ink/10 bg-surface text-ink
class _Segmented extends StatelessWidget {
  const _Segmented({
    required this.options,
    required this.value,
    required this.onChanged,
  });
  final List<String> options;
  final String value;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Row(
      children: [
        for (var i = 0; i < options.length; i++) ...[
          if (i > 0) const SizedBox(width: S.s2),
          Expanded(
            child: GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: () => onChanged(options[i]),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 120),
                padding: const EdgeInsets.symmetric(
                    horizontal: S.s1, vertical: S.s2_5),
                decoration: BoxDecoration(
                  color: options[i] == value ? t.brand : t.surface,
                  borderRadius: BorderRadius.circular(R.r8),
                  border: options[i] == value
                      ? null
                      : Border.all(color: t.ink.withValues(alpha: 0.1)),
                ),
                alignment: Alignment.center,
                child: Text(options[i],
                    style: Tx.sm.copyWith(
                        fontWeight: fw600,
                        color: options[i] == value
                            ? Colors.white
                            : t.ink)),
              ),
            ),
          ),
        ],
      ],
    );
  }
}

/// `w-full rounded-lg border border-ink/10 bg-surface px-3 py-3 text-sm`
class _Input extends StatelessWidget {
  const _Input({
    required this.controller,
    required this.hint,
    this.keyboard,
  });
  final TextEditingController controller;
  final String hint;
  final TextInputType? keyboard;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return TextField(
      controller: controller,
      keyboardType: keyboard,
      style: Tx.sm.copyWith(color: t.ink),
      decoration: _deco(t, hint: hint),
    );
  }
}

class _Textarea extends StatelessWidget {
  const _Textarea({
    required this.controller,
    required this.hint,
    this.onChanged,
  });
  final TextEditingController controller;
  final String hint;
  final ValueChanged<String>? onChanged;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return TextField(
      controller: controller,
      maxLines: 3,
      onChanged: onChanged,
      style: Tx.sm.copyWith(color: t.ink),
      decoration: _deco(t, hint: hint),
    );
  }
}

class _SelectField extends StatelessWidget {
  const _SelectField({
    required this.label,
    required this.placeholder,
    required this.value,
    required this.options,
    required this.onChanged,
  });
  final String label;
  final String placeholder;
  final String value;
  final List<String> options;
  final ValueChanged<String?> onChanged;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _Label(label),
        const SizedBox(height: S.s1_5),
        DropdownButtonFormField<String>(
          initialValue: value.isEmpty ? null : value,
          isExpanded: true,
          icon: Icon(Icons.expand_more, color: t.inkMuted),
          hint: Text(placeholder,
              style: Tx.sm.copyWith(color: t.inkMuted)),
          decoration: _deco(t),
          style: Tx.sm.copyWith(color: t.ink),
          items: [
            for (final o in options)
              DropdownMenuItem(value: o, child: Text(o)),
          ],
          onChanged: onChanged,
        ),
      ],
    );
  }
}

InputDecoration _deco(Tokens t, {String? hint}) {
  return InputDecoration(
    isDense: true,
    contentPadding: const EdgeInsets.symmetric(
        horizontal: S.s3, vertical: S.s3),
    filled: true,
    fillColor: t.surface,
    hintText: hint,
    hintStyle: Tx.sm.copyWith(color: t.inkMuted),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(R.r8),
      borderSide: BorderSide(color: t.ink.withValues(alpha: 0.1)),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(R.r8),
      borderSide: BorderSide(color: t.ink.withValues(alpha: 0.1)),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(R.r8),
      borderSide: BorderSide(color: t.brand.withValues(alpha: 0.5)),
    ),
  );
}

class _PhotoSlot extends StatelessWidget {
  const _PhotoSlot({
    required this.child,
    required this.bordered,
    this.onTap,
  });
  final Widget child;
  final bool bordered;
  final VoidCallback? onTap;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final slot = Container(
      width: Sz.x20,
      height: Sz.x20,
      decoration: BoxDecoration(
        color: bordered ? Colors.transparent : t.surface,
        borderRadius: BorderRadius.circular(R.r8),
        border: Border.all(
          color: t.ink.withValues(alpha: bordered ? 0.2 : 0.1),
          width: bordered ? 2 : 1,
        ),
      ),
      child: Center(child: child),
    );
    if (onTap == null) return slot;
    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(R.r8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(R.r8),
        child: slot,
      ),
    );
  }
}

/// `w-full rounded-lg bg-brand py-3.5 text-sm font-semibold text-white
///  disabled:bg-slate-200 disabled:text-ink-muted`
class _SubmitButton extends StatelessWidget {
  const _SubmitButton({
    required this.disabled,
    required this.label,
    required this.onPressed,
  });
  final bool disabled;
  final String label;
  final VoidCallback? onPressed;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return SizedBox(
      width: double.infinity,
      child: Material(
        color: disabled ? t.backdrop : t.brand,
        borderRadius: BorderRadius.circular(R.r8),
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(R.r8),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 14),
            child: Center(
              child: Text(label,
                  style: Tx.sm.copyWith(
                      fontWeight: fw600,
                      color: disabled ? t.inkMuted : Colors.white)),
            ),
          ),
        ),
      ),
    );
  }
}
