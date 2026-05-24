import 'package:flutter/material.dart';

import '../app/scale.dart';
import '../app/theme.dart';
import '../widgets/add_document_sheet.dart';
import '../widgets/compliance_sheets.dart';
import '../widgets/primitives.dart';

/// My Compliance — 1:1 mirror of `app/(app)/compliance/page.tsx`.
/// Mock data mirrors `lib/data/compliance.ts` exactly.
class ComplianceScreen extends StatefulWidget {
  const ComplianceScreen({super.key});
  @override
  State<ComplianceScreen> createState() => _ComplianceScreenState();
}

class _ComplianceScreenState extends State<ComplianceScreen> {
  // Mirrors lib/data/compliance.ts — license has number+expiry, passport
  // + emergency contact are empty, no docs/certs yet.
  final String _licenseNumber = '123456789';
  final String _licenseExpiry = '2026-11-17';
  final String? _licenseProvince = null;

  final String? _passportNumber = null;
  final String? _passportCountry = null;
  final String? _passportExpiry = null;

  final String? _emergencyName = null;
  final String? _emergencyRelationship = null;
  final String? _emergencyPhone = null;

  int _documents = 0;
  int _certifications = 0;

  static const _provinces = [
    (value: 'AB', label: 'Alberta'),
    (value: 'BC', label: 'British Columbia'),
    (value: 'MB', label: 'Manitoba'),
    (value: 'NB', label: 'New Brunswick'),
    (value: 'NL', label: 'Newfoundland and Labrador'),
    (value: 'NS', label: 'Nova Scotia'),
    (value: 'NT', label: 'Northwest Territories'),
    (value: 'NU', label: 'Nunavut'),
    (value: 'ON', label: 'Ontario'),
    (value: 'PE', label: 'Prince Edward Island'),
    (value: 'QC', label: 'Quebec'),
    (value: 'SK', label: 'Saskatchewan'),
    (value: 'YT', label: 'Yukon'),
  ];

  static const _noteField = SheetField(
    kind: 'textarea',
    label: 'Note (Optional)',
    placeholder: 'Add a note...',
  );

  String _na(String? v) => (v == null || v.isEmpty) ? 'N/A' : v;

  /// Status line for an item with optional expiry date.
  ({String text, bool ok})? _expiryStatus(String? iso) {
    if (iso == null || iso.isEmpty) return (text: 'No expiry', ok: true);
    final d = DateTime.tryParse(iso);
    if (d == null) return (text: 'No expiry', ok: true);
    final days = d.difference(DateTime.now()).inDays;
    if (days < 0) return (text: 'Expired', ok: false);
    return (text: '$days days until expiry', ok: true);
  }

  String _fmtDate(String? iso) {
    if (iso == null || iso.isEmpty) return 'N/A';
    final d = DateTime.tryParse(iso);
    if (d == null) return 'N/A';
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${months[d.month - 1]} ${d.day}, ${d.year}';
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(
          S.s4, S.s4, S.s4, S.s4 + kShellBottomInset),
      children: [
        // ── Basic section ────────────────────────────────────────────
        const _GroupHeader('Basic'),
        const SizedBox(height: S.s3),

        _ComplianceItemCard(
          title: "Driver's License",
          rows: [
            ('Number', _na(_licenseNumber)),
            ('Expires', _fmtDate(_licenseExpiry)),
            ('Province/State', _na(_licenseProvince)),
          ],
          status: _expiryStatus(_licenseExpiry),
          onUpdate: () => showUpdateItemSheet(
            context,
            title: "Driver's License",
            fields: [
              SheetField(
                kind: 'text',
                label: 'New License Number',
                defaultValue: _licenseNumber,
                placeholder: 'License number',
              ),
              SheetField(
                kind: 'select',
                label: 'New Province/State',
                defaultValue: _licenseProvince ?? '',
                placeholder: 'Select province/state',
                options: _provinces,
              ),
              SheetField(
                kind: 'date',
                label: 'New Expiry Date',
                defaultValue: _licenseExpiry,
              ),
              _noteField,
            ],
          ),
        ),
        const SizedBox(height: S.s4),

        _ComplianceItemCard(
          title: 'Passport',
          rows: [
            ('Number', _na(_passportNumber)),
            ('Country', _na(_passportCountry)),
            ('Expires', _fmtDate(_passportExpiry)),
          ],
          status: _expiryStatus(_passportExpiry),
          onUpdate: () => showUpdateItemSheet(
            context,
            title: 'Passport',
            fields: [
              SheetField(
                kind: 'text',
                label: 'New Passport Number',
                defaultValue: _passportNumber ?? '',
                placeholder: 'Passport number',
              ),
              SheetField(
                kind: 'text',
                label: 'New Country',
                defaultValue: _passportCountry ?? '',
                placeholder: 'Country',
              ),
              SheetField(
                kind: 'date',
                label: 'New Expiry Date',
                defaultValue: _passportExpiry ?? '',
              ),
              _noteField,
            ],
          ),
        ),
        const SizedBox(height: S.s4),

        _ComplianceItemCard(
          title: 'Emergency Contact',
          // Name shows literal "Not set" instead of "N/A" when null —
          // matches the Next.js page's `c.emergencyContact.name ?? "Not set"`.
          rows: [
            ('Name', _emergencyName ?? 'Not set'),
            ('Relationship', _na(_emergencyRelationship)),
            ('Phone', _na(_emergencyPhone)),
          ],
          status: null, // Emergency Contact has no status line.
          onUpdate: () => showUpdateItemSheet(
            context,
            title: 'Emergency Contact',
            fields: [
              SheetField(
                kind: 'text',
                label: 'New Contact Name',
                defaultValue: _emergencyName ?? '',
                placeholder: 'Full name',
              ),
              SheetField(
                kind: 'text',
                label: 'New Relationship',
                defaultValue: _emergencyRelationship ?? '',
                placeholder: 'e.g. Spouse',
              ),
              SheetField(
                kind: 'text',
                label: 'New Phone',
                defaultValue: _emergencyPhone ?? '',
                placeholder: 'Phone number',
              ),
              _noteField,
            ],
          ),
        ),

        const SizedBox(height: S.s6),

        // ── Documents section ────────────────────────────────────────
        _SectionHeader(
          title: 'Documents',
          onAdd: () => showAddDocumentSheet(
            context,
            onCapture: () => setState(() => _documents++),
          ),
        ),
        const SizedBox(height: S.s3),
        if (_documents == 0)
          const _EmptyCard('No documents')
        else
          for (var i = 0; i < _documents; i++) ...[
            if (i > 0) const SizedBox(height: S.s2),
            _LineCard('Document ${i + 1}'),
          ],

        const SizedBox(height: S.s6),

        // ── Certifications section ───────────────────────────────────
        _SectionHeader(
          title: 'Certifications',
          onAdd: () => showAddCertificationSheet(
            context,
            onSubmit: () => setState(() => _certifications++),
          ),
        ),
        const SizedBox(height: S.s3),
        if (_certifications == 0)
          const _EmptyCard('No certifications')
        else
          for (var i = 0; i < _certifications; i++) ...[
            if (i > 0) const SizedBox(height: S.s2),
            const _CertCard(name: 'New Certification', result: 'Pass'),
          ],
      ],
    );
  }
}

/// `text-sm font-semibold text-ink`
class _GroupHeader extends StatelessWidget {
  const _GroupHeader(this.text);
  final String text;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Text(text,
        style: Tx.sm.copyWith(fontWeight: fw600, color: t.ink));
  }
}

/// Header row for Documents / Certifications: title + brand "+ Add" pill.
class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.title, required this.onAdd});
  final String title;
  final VoidCallback onAdd;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Row(
      children: [
        Expanded(
          child: Text(title,
              style:
                  Tx.sm.copyWith(fontWeight: fw600, color: t.ink)),
        ),
        Material(
          color: t.brand,
          borderRadius: BorderRadius.circular(R.rFull),
          child: InkWell(
            onTap: onAdd,
            borderRadius: BorderRadius.circular(R.rFull),
            child: Padding(
              padding: const EdgeInsets.symmetric(
                  horizontal: S.s3, vertical: S.s1_5),
              child: Row(mainAxisSize: MainAxisSize.min, children: [
                const Icon(Icons.add, size: 14, color: Colors.white),
                const SizedBox(width: S.s1),
                Text('Add',
                    style: Tx.xs.copyWith(
                        fontWeight: fw600, color: Colors.white)),
              ]),
            ),
          ),
        ),
      ],
    );
  }
}

/// One "Basic" compliance item.
/// `rounded-card bg-surface p-5 shadow-card`
///   h3 text-base font-bold ink
///   dl mt-3 space-y-2 — label/value rows justify-between
///   Update button `mt-4 w-full rounded-lg bg-surface-muted py-2.5
///                  text-sm font-semibold ink`
///   Status `mt-3 border-t border-surface-muted pt-3` — check + label
class _ComplianceItemCard extends StatelessWidget {
  const _ComplianceItemCard({
    required this.title,
    required this.rows,
    required this.onUpdate,
    required this.status,
  });
  final String title;
  final List<(String, String)> rows;
  final VoidCallback onUpdate;
  final ({String text, bool ok})? status;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(title,
              style: Tx.base.copyWith(fontWeight: fw700, color: t.ink)),
          const SizedBox(height: S.s3),
          for (var i = 0; i < rows.length; i++) ...[
            if (i > 0) const SizedBox(height: S.s2),
            Row(children: [
              Text(rows[i].$1, style: Tx.sm.copyWith(color: t.inkMuted)),
              const Spacer(),
              Flexible(
                child: Text(
                  rows[i].$2,
                  textAlign: TextAlign.right,
                  style: Tx.sm.copyWith(fontWeight: fw600, color: t.ink),
                ),
              ),
            ]),
          ],
          const SizedBox(height: S.s4),
          Material(
            color: t.surfaceMuted,
            borderRadius: BorderRadius.circular(R.r8),
            child: InkWell(
              onTap: onUpdate,
              borderRadius: BorderRadius.circular(R.r8),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: S.s2_5),
                child: Center(
                  child: Text('Update',
                      style: Tx.sm.copyWith(
                          fontWeight: fw600, color: t.ink)),
                ),
              ),
            ),
          ),
          if (status != null) ...[
            const SizedBox(height: S.s3),
            Container(height: 1, color: t.surfaceMuted),
            const SizedBox(height: S.s3),
            Row(children: [
              Icon(
                status!.ok ? Icons.check : Icons.warning_amber_rounded,
                size: Sz.x4,
                color: status!.ok ? t.success : t.warning,
              ),
              const SizedBox(width: S.s1_5),
              Text(
                status!.text,
                style: Tx.sm.copyWith(
                    fontWeight: fw500,
                    color: status!.ok ? t.success : t.warning),
              ),
            ]),
          ],
        ],
      ),
    );
  }
}

class _EmptyCard extends StatelessWidget {
  const _EmptyCard(this.text);
  final String text;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return AppCard(
      padding: const EdgeInsets.all(S.s6),
      child: Center(
        child: Text(text, style: Tx.sm.copyWith(color: t.inkMuted)),
      ),
    );
  }
}

class _LineCard extends StatelessWidget {
  const _LineCard(this.text);
  final String text;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return AppCard(
      padding: const EdgeInsets.all(S.s4),
      child: Row(children: [
        Icon(Icons.description_outlined, size: Sz.x5, color: t.brand),
        const SizedBox(width: S.s2),
        Expanded(
          child: Text(text,
              style: Tx.sm.copyWith(fontWeight: fw500, color: t.ink)),
        ),
      ]),
    );
  }
}

class _CertCard extends StatelessWidget {
  const _CertCard({required this.name, required this.result});
  final String name;
  final String result;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return AppCard(
      padding: const EdgeInsets.all(S.s4),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(name,
            style: Tx.sm.copyWith(fontWeight: fw600, color: t.ink)),
        Text(result,
            style: Tx.xs.copyWith(fontWeight: fw500, color: t.inkMuted)),
      ]),
    );
  }
}
