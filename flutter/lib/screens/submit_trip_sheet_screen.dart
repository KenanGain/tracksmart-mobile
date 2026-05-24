import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../app/scale.dart';
import '../app/theme.dart';

/// Submit Trip Sheet — 1:1 mirror of `components/trip-sheets/SubmitTripSheetForm.tsx`.
class SubmitTripSheetScreen extends StatefulWidget {
  const SubmitTripSheetScreen({super.key});
  @override
  State<SubmitTripSheetScreen> createState() => _SubmitTripSheetScreenState();
}

class _SubmitTripSheetScreenState extends State<SubmitTripSheetScreen> {
  bool _uploaded = false;
  DateTime _periodStart = DateTime(2026, 5, 1);
  DateTime _periodEnd = DateTime(2026, 5, 21);
  final _note = TextEditingController();
  bool _submitting = false;

  static const _uploadOptions = [
    (icon: Icons.description_outlined, label: 'Scan'),
    (icon: Icons.camera_alt_outlined, label: 'Camera'),
    (icon: Icons.image_outlined, label: 'Gallery'),
    (icon: Icons.folder_outlined, label: 'Files'),
  ];

  Future<void> _pickStart() async {
    final d = await showDatePicker(
      context: context,
      initialDate: _periodStart,
      firstDate: DateTime(2020),
      lastDate: DateTime(2100),
    );
    if (d != null) setState(() => _periodStart = d);
  }

  Future<void> _pickEnd() async {
    final d = await showDatePicker(
      context: context,
      initialDate: _periodEnd,
      firstDate: DateTime(2020),
      lastDate: DateTime(2100),
    );
    if (d != null) setState(() => _periodEnd = d);
  }

  String _fmtDate(DateTime d) =>
      '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final disabled = !_uploaded || _submitting;
    return Scaffold(
      backgroundColor: t.surfaceMuted,
      body: SafeArea(
        child: Column(children: [
          // Header
          _Header(title: 'Submit Trip Sheet', onBack: () => context.go('/home')),
          // Body
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(S.s4, S.s4, S.s4, S.s8 + S.s4),
              children: [
                const _TripSheetPreview(),
                const SizedBox(height: S.s5),

                // Upload Trip Sheet
                const _Label('Upload Trip Sheet'),
                const SizedBox(height: S.s2),
                Row(
                  children: [
                    for (var i = 0; i < _uploadOptions.length; i++) ...[
                      if (i > 0) const SizedBox(width: S.s2),
                      Expanded(
                        child: _UploadTile(
                          icon: _uploadOptions[i].icon,
                          label: _uploadOptions[i].label,
                          onTap: () => setState(() => _uploaded = true),
                        ),
                      ),
                    ],
                  ],
                ),
                if (_uploaded) ...[
                  const SizedBox(height: S.s2),
                  Row(children: [
                    Icon(Icons.check, size: Sz.x4, color: t.success),
                    const SizedBox(width: S.s1_5),
                    Text('Trip sheet attached',
                        style: Tx.sm.copyWith(
                            fontWeight: fw500, color: t.success)),
                  ]),
                ],
                const SizedBox(height: S.s5),

                // Period
                const _Label('Period'),
                const SizedBox(height: S.s2),
                Row(children: [
                  Expanded(
                    child: _DateTile(
                      label: 'Start',
                      value: _fmtDate(_periodStart),
                      onTap: _pickStart,
                    ),
                  ),
                  const SizedBox(width: S.s2),
                  Icon(Icons.chevron_right, size: Sz.x4, color: t.inkMuted),
                  const SizedBox(width: S.s2),
                  Expanded(
                    child: _DateTile(
                      label: 'End',
                      value: _fmtDate(_periodEnd),
                      onTap: _pickEnd,
                    ),
                  ),
                ]),

                const SizedBox(height: S.s5),

                // Note
                const _Label('Note (Optional)'),
                const SizedBox(height: S.s2),
                Container(
                  decoration: BoxDecoration(
                    color: t.surface,
                    borderRadius: BorderRadius.circular(R.r14),
                    boxShadow: shadowCard,
                  ),
                  child: TextField(
                    controller: _note,
                    maxLines: 4,
                    style: Tx.sm.copyWith(color: t.ink),
                    decoration: InputDecoration(
                      isCollapsed: true,
                      contentPadding: const EdgeInsets.all(S.s4),
                      hintText: 'Add a note...',
                      hintStyle: Tx.sm.copyWith(
                          color: t.inkMuted.withValues(alpha: 0.7)),
                      border: InputBorder.none,
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Footer
          _Footer(
            disabled: disabled,
            label: _submitting ? 'Submitting…' : 'Submit Trip Sheet',
            onSubmit: disabled
                ? null
                : () async {
                    setState(() => _submitting = true);
                    final go = GoRouter.of(context);
                    await Future<void>.delayed(
                        const Duration(milliseconds: 200));
                    if (!mounted) return;
                    go.go('/trip-sheets');
                  },
          ),
        ]),
      ),
    );
  }
}

// ─── Header ──────────────────────────────────────────────────────────
class _Header extends StatelessWidget {
  const _Header({required this.title, required this.onBack});
  final String title;
  final VoidCallback onBack;
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
        Material(
          color: Colors.transparent,
          shape: const CircleBorder(),
          child: InkWell(
            onTap: onBack,
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

// ─── Section label (text-[11px] uppercase tracking-wide ink-muted) ───
class _Label extends StatelessWidget {
  const _Label(this.text);
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

// ─── Trip Sheet preview card ─────────────────────────────────────────
// `rounded-card bg-surface p-4 shadow-card` outer,
// inner box `rounded-lg border-blue-200 bg-blue-50 p-4` with title,
// Driver/Period field lines, 5-col header (Date/Load #/From/To/Miles),
// 3 dotted-ish underline rows. Caption below.
class _TripSheetPreview extends StatelessWidget {
  const _TripSheetPreview();
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    const blueLine = Color(0xFF93C5FD); // blue-300
    const blueLightBg = Color(0xFFEFF6FF); // blue-50
    const blueBorder = Color(0xFFBFDBFE); // blue-200
    const blueRow = Color(0xFFBFDBFE); // blue-200

    Widget fieldRow(String label) => Row(children: [
          Text('$label:',
              style: Tx.t10.copyWith(fontWeight: fw500, color: t.ink)),
          const SizedBox(width: S.s2),
          Expanded(child: Container(height: 1, color: blueLine)),
        ]);

    Widget colHeader(String s, {bool right = false}) => Expanded(
          child: Text(s.toUpperCase(),
              textAlign: right ? TextAlign.right : TextAlign.left,
              style: TextStyle(
                  fontSize: 8,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                  color: t.brand)),
        );

    return Container(
      decoration: BoxDecoration(
        color: t.surface,
        borderRadius: BorderRadius.circular(R.r14),
        boxShadow: shadowCard,
      ),
      padding: const EdgeInsets.all(S.s4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            decoration: BoxDecoration(
              color: blueLightBg,
              border: Border.all(color: blueBorder),
              borderRadius: BorderRadius.circular(R.r8),
            ),
            padding: const EdgeInsets.all(S.s4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Center(
                  child: Text("DRIVER'S TRIP SHEET",
                      style: Tx.xs.copyWith(
                          fontWeight: fw700,
                          letterSpacing: 1.2,
                          color: t.brand)),
                ),
                const SizedBox(height: S.s3),
                fieldRow('Driver'),
                const SizedBox(height: S.s2),
                fieldRow('Period'),
                const SizedBox(height: S.s3),
                Row(children: [
                  colHeader('Date'),
                  colHeader('Load #'),
                  colHeader('From'),
                  colHeader('To'),
                  colHeader('Miles', right: true),
                ]),
                const SizedBox(height: S.s2),
                Container(height: 1, color: blueRow),
                const SizedBox(height: S.s2),
                Container(height: 1, color: blueRow),
                const SizedBox(height: S.s2),
                Container(height: 1, color: blueRow),
              ],
            ),
          ),
          const SizedBox(height: S.s3),
          Center(
            child: Text(
              'Upload your trip sheet showing loads hauled for the period',
              textAlign: TextAlign.center,
              style: Tx.sm.copyWith(fontWeight: fw500, color: t.brand),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Upload tile (one of the 4-col grid) ────────────────────────────
class _UploadTile extends StatelessWidget {
  const _UploadTile({
    required this.icon,
    required this.label,
    required this.onTap,
  });
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Material(
      color: t.surface,
      borderRadius: BorderRadius.circular(R.r14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(R.r14),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(R.r14),
            boxShadow: shadowCard,
          ),
          padding: const EdgeInsets.symmetric(
              horizontal: S.s2, vertical: S.s3),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: Sz.x5, color: t.brand),
              const SizedBox(height: S.s1_5),
              Text(label,
                  style: Tx.xs
                      .copyWith(fontWeight: fw500, color: t.ink)),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Date tile (Start / End) ────────────────────────────────────────
// `flex-1 rounded-card bg-surface p-3 shadow-card`
//   text-[10px] uppercase tracking-wide ink-muted label
//   mt-0.5 text-sm font-bold ink value
class _DateTile extends StatelessWidget {
  const _DateTile({
    required this.label,
    required this.value,
    required this.onTap,
  });
  final String label;
  final String value;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Material(
      color: t.surface,
      borderRadius: BorderRadius.circular(R.r14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(R.r14),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(R.r14),
            boxShadow: shadowCard,
          ),
          padding: const EdgeInsets.all(S.s3),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label.toUpperCase(),
                  style: Tx.t10.copyWith(
                      fontWeight: fw500,
                      letterSpacing: 0.5,
                      color: t.inkMuted)),
              const SizedBox(height: 2),
              Text(value,
                  style:
                      Tx.sm.copyWith(fontWeight: fw700, color: t.ink)),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Footer with rounded-full brand submit ──────────────────────────
class _Footer extends StatelessWidget {
  const _Footer({
    required this.disabled,
    required this.label,
    required this.onSubmit,
  });
  final bool disabled;
  final String label;
  final VoidCallback? onSubmit;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Container(
      decoration: BoxDecoration(
        color: t.surface.withValues(alpha: 0.85),
        border: Border(
            top: BorderSide(color: t.ink.withValues(alpha: 0.05))),
      ),
      padding: const EdgeInsets.fromLTRB(S.s4, S.s3, S.s4, S.s4),
      child: Material(
        color: disabled ? t.backdrop : t.brand,
        borderRadius: BorderRadius.circular(R.rFull),
        child: InkWell(
          onTap: onSubmit,
          borderRadius: BorderRadius.circular(R.rFull),
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
