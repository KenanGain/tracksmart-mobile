import 'package:flutter/material.dart';

import '../app/scale.dart';
import '../app/theme.dart';

/// Shared field config for the Update <item> bottom-sheet form.
class SheetField {
  final String kind; // 'text' | 'select' | 'date' | 'textarea'
  final String label;
  final String? defaultValue;
  final String? placeholder;
  final List<({String value, String label})>? options;
  const SheetField({
    required this.kind,
    required this.label,
    this.defaultValue,
    this.placeholder,
    this.options,
  });
}

/// `BottomSheet` wrapper that matches `components/ui/BottomSheet.tsx`:
///   - rounded-t-2xl bg-surface
///   - header: title (text-lg font-bold) + X close button (h-8 w-8 rounded-full)
///   - body: scrollable, px-5 pb-8 pt-4
Future<void> showAppSheet(
  BuildContext context, {
  required String title,
  required Widget child,
}) {
  final t = Tokens.of(context);
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: t.surface,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
    ),
    builder: (ctx) => DraggableScrollableSheet(
      initialChildSize: 0.7,
      minChildSize: 0.4,
      maxChildSize: 0.92,
      expand: false,
      builder: (_, scroll) {
        final tt = Tokens.of(ctx);
        return SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header: px-5 pt-5
              Padding(
                padding: const EdgeInsets.fromLTRB(S.s5, S.s5, S.s5, 0),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(title,
                          style: Tx.lg.copyWith(
                              fontWeight: fw700, color: tt.ink)),
                    ),
                    Material(
                      color: Colors.transparent,
                      shape: const CircleBorder(),
                      child: InkWell(
                        onTap: () => Navigator.of(ctx).pop(),
                        customBorder: const CircleBorder(),
                        child: SizedBox(
                          width: 32,
                          height: 32,
                          child: Icon(Icons.close,
                              size: Sz.x5, color: tt.inkMuted),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  controller: scroll,
                  padding: const EdgeInsets.fromLTRB(
                      S.s5, S.s4, S.s5, S.s8),
                  child: child,
                ),
              ),
            ],
          ),
        );
      },
    ),
  );
}

/// Opens "Update <title>" with a list of dynamic fields and a submit button.
Future<void> showUpdateItemSheet(
  BuildContext context, {
  required String title,
  required List<SheetField> fields,
}) {
  return showAppSheet(
    context,
    title: 'Update $title',
    child: _UpdateBody(title: title, fields: fields),
  );
}

class _UpdateBody extends StatelessWidget {
  const _UpdateBody({required this.title, required this.fields});
  final String title;
  final List<SheetField> fields;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(title,
            style: Tx.sm.copyWith(fontWeight: fw600, color: t.brand)),
        const SizedBox(height: S.s4),
        for (var i = 0; i < fields.length; i++) ...[
          if (i > 0) const SizedBox(height: S.s4),
          _Field(field: fields[i]),
        ],
        const SizedBox(height: S.s5),
        _SubmitButton(
          label: 'Submit for Review',
          onPressed: () {
            Navigator.of(context).pop();
            ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Submitted for review')));
          },
        ),
      ],
    );
  }
}

// ─── Form primitives (mirror components/ui/form.tsx) ─────────────────

/// `block text-[11px] font-semibold uppercase tracking-wide text-ink-muted`
class _FieldLabel extends StatelessWidget {
  const _FieldLabel(this.text);
  final String text;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Text(text.toUpperCase(),
        style: Tx.t11.copyWith(
            fontWeight: fw600,
            letterSpacing: 0.5,
            color: t.inkMuted));
  }
}

class _Field extends StatefulWidget {
  const _Field({required this.field});
  final SheetField field;
  @override
  State<_Field> createState() => _FieldState();
}

class _FieldState extends State<_Field> {
  late final TextEditingController _ctrl;
  String? _select;
  DateTime? _date;

  @override
  void initState() {
    super.initState();
    _ctrl = TextEditingController(text: widget.field.defaultValue ?? '');
    _select = widget.field.defaultValue;
    if (widget.field.kind == 'date' &&
        widget.field.defaultValue != null &&
        widget.field.defaultValue!.isNotEmpty) {
      _date = DateTime.tryParse(widget.field.defaultValue!);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _FieldLabel(widget.field.label),
        const SizedBox(height: S.s1_5),
        switch (widget.field.kind) {
          'textarea' => _Input(
              controller: _ctrl,
              hint: widget.field.placeholder ?? '',
              maxLines: 3,
            ),
          'select' => _Select(
              value: _select,
              placeholder: widget.field.placeholder ?? 'Select…',
              options: widget.field.options ?? const [],
              onChanged: (v) => setState(() => _select = v),
            ),
          'date' => _DateField(
              value: _date,
              onPicked: (d) => setState(() => _date = d),
            ),
          _ => _Input(
              controller: _ctrl,
              hint: widget.field.placeholder ?? '',
            ),
        },
      ],
    );
  }
}

/// `mt-1.5 w-full rounded-lg bg-surface-muted px-3 py-3 text-sm text-ink
///  placeholder:text-ink-muted/70 focus:ring-2 ring-brand/30`
class _Input extends StatelessWidget {
  const _Input({
    required this.controller,
    required this.hint,
    this.maxLines = 1,
  });
  final TextEditingController controller;
  final String hint;
  final int maxLines;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return TextField(
      controller: controller,
      maxLines: maxLines,
      style: Tx.sm.copyWith(color: t.ink),
      decoration: InputDecoration(
        isDense: true,
        contentPadding: const EdgeInsets.symmetric(
            horizontal: S.s3, vertical: S.s3),
        filled: true,
        fillColor: t.surfaceMuted,
        hintText: hint,
        hintStyle:
            Tx.sm.copyWith(color: t.inkMuted.withValues(alpha: 0.7)),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(R.r8),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(R.r8),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(R.r8),
          borderSide:
              BorderSide(color: t.brand.withValues(alpha: 0.3), width: 2),
        ),
      ),
    );
  }
}

class _Select extends StatelessWidget {
  const _Select({
    required this.value,
    required this.placeholder,
    required this.options,
    required this.onChanged,
  });
  final String? value;
  final String placeholder;
  final List<({String value, String label})> options;
  final ValueChanged<String?> onChanged;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Container(
      decoration: BoxDecoration(
        color: t.surfaceMuted,
        borderRadius: BorderRadius.circular(R.r8),
      ),
      padding: const EdgeInsets.symmetric(
          horizontal: S.s3, vertical: 2),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          isExpanded: true,
          value: (value == null || value!.isEmpty) ? null : value,
          icon: Icon(Icons.expand_more, color: t.inkMuted, size: Sz.x5),
          hint: Text(placeholder,
              style: Tx.sm.copyWith(
                  color: t.inkMuted.withValues(alpha: 0.7))),
          style: Tx.sm.copyWith(color: t.ink),
          dropdownColor: t.surface,
          items: [
            for (final o in options)
              DropdownMenuItem(value: o.value, child: Text(o.label)),
          ],
          onChanged: onChanged,
        ),
      ),
    );
  }
}

/// Date input — `mm/dd/yyyy` placeholder + trailing calendar icon, tap
/// to open the native date picker.
class _DateField extends StatelessWidget {
  const _DateField({required this.value, required this.onPicked});
  final DateTime? value;
  final ValueChanged<DateTime> onPicked;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Material(
      color: t.surfaceMuted,
      borderRadius: BorderRadius.circular(R.r8),
      child: InkWell(
        borderRadius: BorderRadius.circular(R.r8),
        onTap: () async {
          final picked = await showDatePicker(
            context: context,
            initialDate: value ?? DateTime.now(),
            firstDate: DateTime(2000),
            lastDate: DateTime(2100),
          );
          if (picked != null) onPicked(picked);
        },
        child: Padding(
          padding: const EdgeInsets.symmetric(
              horizontal: S.s3, vertical: S.s3),
          child: Row(children: [
            Expanded(
              child: Text(
                value == null
                    ? 'mm/dd/yyyy'
                    : '${value!.month.toString().padLeft(2, '0')}/${value!.day.toString().padLeft(2, '0')}/${value!.year}',
                style: Tx.sm.copyWith(
                    fontWeight: value == null ? fw400 : fw600,
                    color: value == null
                        ? t.inkMuted.withValues(alpha: 0.7)
                        : t.ink),
              ),
            ),
            Icon(Icons.calendar_today_outlined,
                size: Sz.x4, color: t.inkMuted),
          ]),
        ),
      ),
    );
  }
}

/// `w-full rounded-lg bg-brand py-3.5 text-sm font-semibold text-white`
class _SubmitButton extends StatelessWidget {
  const _SubmitButton({required this.label, required this.onPressed});
  final String label;
  final VoidCallback onPressed;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Material(
      color: t.brand,
      borderRadius: BorderRadius.circular(R.r8),
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(R.r8),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 14),
          child: Center(
            child: Text(label,
                style: Tx.sm.copyWith(
                    fontWeight: fw600, color: Colors.white)),
          ),
        ),
      ),
    );
  }
}

// ─── Add New Certification ─────────────────────────────────────────
Future<void> showAddCertificationSheet(
  BuildContext context, {
  required VoidCallback onSubmit,
}) {
  return showAppSheet(
    context,
    title: 'Add New Certification',
    child: _AddCertificationBody(onSubmit: onSubmit),
  );
}

class _AddCertificationBody extends StatefulWidget {
  const _AddCertificationBody({required this.onSubmit});
  final VoidCallback onSubmit;
  @override
  State<_AddCertificationBody> createState() =>
      _AddCertificationBodyState();
}

class _AddCertificationBodyState extends State<_AddCertificationBody> {
  final _name = TextEditingController();
  String _category = 'drug_test';
  String _result = 'pass';
  DateTime? _expiry;
  bool _docAttached = false;
  final _note = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const _FieldLabel('Certification Name'),
        const SizedBox(height: S.s1_5),
        _Input(controller: _name, hint: 'e.g., Hazmat Training'),
        const SizedBox(height: S.s4),

        const _FieldLabel('Category'),
        const SizedBox(height: S.s1_5),
        _ToggleRow(
          value: _category,
          options: const [
            ('drug_test', 'Drug Test'),
            ('road_test', 'Road Test'),
          ],
          onChanged: (v) => setState(() => _category = v),
        ),
        const SizedBox(height: S.s4),

        const _FieldLabel('Result'),
        const SizedBox(height: S.s1_5),
        _ToggleRow(
          value: _result,
          options: const [
            ('pass', 'Pass'),
            ('fail', 'Fail'),
          ],
          onChanged: (v) => setState(() => _result = v),
        ),
        const SizedBox(height: S.s4),

        const _FieldLabel('Expiry Date'),
        const SizedBox(height: S.s1_5),
        _DateField(
          value: _expiry,
          onPicked: (d) => setState(() => _expiry = d),
        ),
        const SizedBox(height: S.s4),

        const _FieldLabel('Document File'),
        const SizedBox(height: S.s1_5),
        _UploadField(
          attached: _docAttached,
          onTap: () => setState(() => _docAttached = true),
        ),
        const SizedBox(height: S.s4),

        const _FieldLabel('Note (Optional)'),
        const SizedBox(height: S.s1_5),
        _Input(controller: _note, hint: 'Add a note...', maxLines: 3),

        const SizedBox(height: S.s5),
        _SubmitButton(
          label: 'Submit for Review',
          onPressed: () {
            Navigator.of(context).pop();
            widget.onSubmit();
            ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Certification submitted')));
          },
        ),
      ],
    );
  }
}

/// Standalone-pill toggle group — `mt-1.5 flex gap-3` with each button
///   `flex-1 rounded-lg py-3 text-sm font-semibold`
///   active: bg-brand text-white | else: bg-surface-muted text-ink
class _ToggleRow extends StatelessWidget {
  const _ToggleRow({
    required this.value,
    required this.options,
    required this.onChanged,
  });
  final String value;
  final List<(String, String)> options;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Row(
      children: [
        for (var i = 0; i < options.length; i++) ...[
          if (i > 0) const SizedBox(width: S.s3),
          Expanded(
            child: Material(
              color: options[i].$1 == value ? t.brand : t.surfaceMuted,
              borderRadius: BorderRadius.circular(R.r8),
              child: InkWell(
                onTap: () => onChanged(options[i].$1),
                borderRadius: BorderRadius.circular(R.r8),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: S.s3),
                  child: Center(
                    child: Text(
                      options[i].$2,
                      style: Tx.sm.copyWith(
                        fontWeight: fw600,
                        color: options[i].$1 == value
                            ? Colors.white
                            : t.ink,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ],
    );
  }
}

/// `mt-1.5 w-full rounded-lg py-3 text-sm font-semibold`
///   attached → bg-success/10 text-success "Document attached ✓"
///   else      → bg-surface-muted text-brand   "+ Upload Document"
class _UploadField extends StatelessWidget {
  const _UploadField({required this.attached, required this.onTap});
  final bool attached;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Material(
      color: attached
          ? t.success.withValues(alpha: 0.1)
          : t.surfaceMuted,
      borderRadius: BorderRadius.circular(R.r8),
      child: InkWell(
        onTap: attached ? null : onTap,
        borderRadius: BorderRadius.circular(R.r8),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: S.s3),
          child: Center(
            child: Text(
              attached ? 'Document attached ✓' : '+ Upload Document',
              style: Tx.sm.copyWith(
                fontWeight: fw600,
                color: attached ? t.success : t.brand,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
