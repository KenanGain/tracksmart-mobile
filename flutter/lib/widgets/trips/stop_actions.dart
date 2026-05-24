import 'package:flutter/material.dart';
import 'package:signature/signature.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:intl/intl.dart';

import '../../app/theme.dart';
import '../../models.dart';
import '../add_document_sheet.dart';

/// Status buttons + dialog flows for an expanded stop.
///   - Pick Up → Arrived / Picked Up / Departed
///       Arrived → odometer (value kept)
///       Picked Up → confirm trailer → confirm temp → document (skippable)
///   - Drop Off → Arrived / Delivered
///       Arrived → odometer
///       Delivered → receiver e-signature (skippable) → document (skippable)
///   - Acquire → Mark as Completed → odometer
///   - Hook    → Mark as Completed → confirm trailer
/// All mocks.
class StopActions extends StatefulWidget {
  const StopActions({super.key, required this.stop});
  final TripStop stop;
  @override
  State<StopActions> createState() => _StopActionsState();
}

class _Entry {
  final String label;
  final String time;
  final String? detail;
  const _Entry(this.label, this.time, [this.detail]);
}

class _StopActionsState extends State<StopActions> {
  final List<_Entry> _history = [];
  String? _pending;

  bool _isDone(String label) => _history.any((e) => e.label == label);

  void _finish(String label, [String? detail]) {
    if (_isDone(label)) return;
    setState(() {
      _history.add(_Entry(label, _formatNow(), detail));
      _pending = null;
    });
  }

  String _formatNow() {
    final d = DateTime.now();
    return '${DateFormat('MMM d').format(d)} ${DateFormat('h:mm a').format(d)}';
  }

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final kind = widget.stop.kind;
    final isPickup = kind == TripStopKind.pickup;
    final isDelivery = kind == TripStopKind.dropOff;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Status buttons
        Row(children: [
          if (isPickup) ...[
            _btn('Arrived', () => _arrived()),
            const SizedBox(width: 8),
            _btn('Picked Up', () => _pickedUp()),
            const SizedBox(width: 8),
            _btn('Departed', () => _finish('Departed')),
          ] else if (isDelivery) ...[
            _btn('Arrived', () => _arrived()),
            const SizedBox(width: 8),
            _btn('Delivered', () => _delivered()),
          ] else
            _btn('Completed', () => _simpleCompleted()),
        ]),

        // Action history
        if (_history.isNotEmpty) ...[
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border.all(color: t.ink.withOpacity(0.1)),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('ACTION HISTORY',
                    style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.5,
                        color: t.inkMuted)),
                const SizedBox(height: 8),
                for (final e in _history)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 6),
                    child: Row(children: [
                      Icon(Icons.check, size: 16, color: t.success),
                      const SizedBox(width: 6),
                      Text(e.label,
                          style: TextStyle(
                              fontWeight: FontWeight.w600,
                              color: t.success,
                              fontSize: 13)),
                      if (e.detail != null) ...[
                        const SizedBox(width: 6),
                        Text('· ${e.detail}',
                            style: TextStyle(color: t.inkMuted, fontSize: 13)),
                      ],
                      const Spacer(),
                      Text(e.time,
                          style: TextStyle(
                              color: t.ink,
                              fontWeight: FontWeight.w600,
                              fontSize: 13)),
                    ]),
                  ),
              ],
            ),
          ),
        ],

        // Navigate — only for pickup / drop-off
        if (isPickup || isDelivery) ...[
          const SizedBox(height: 12),
          FilledButton.icon(
            style: FilledButton.styleFrom(
              backgroundColor: t.inkMuted,
              minimumSize: const Size.fromHeight(48),
            ),
            onPressed: _navigate,
            icon: const Icon(Icons.location_on_outlined, size: 16),
            label: const Text('Navigate'),
          ),
        ],
      ],
    );
  }

  Widget _btn(String label, VoidCallback onTap) {
    final done = _isDone(label);
    final t = Tokens.of(context);
    return Expanded(
      child: FilledButton(
        style: FilledButton.styleFrom(
          backgroundColor: done ? t.success.withOpacity(0.1) : t.brand,
          foregroundColor: done ? t.success : Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 10),
        ),
        onPressed: done ? null : onTap,
        child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          if (done) ...[
            const Icon(Icons.check, size: 14),
            const SizedBox(width: 4),
          ],
          Text(label.toUpperCase(),
              style:
                  const TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
        ]),
      ),
    );
  }

  // ─── flows ────────────────────────────────────────────────────────
  Future<void> _arrived() async {
    _pending = 'Arrived';
    final km = await _showValueSheet(
      'Odometer Reading',
      'Enter the truck odometer (km).',
      'Enter km',
      numeric: true,
    );
    if (km != null) _finish('Arrived', '$km km');
  }

  Future<void> _pickedUp() async {
    _pending = 'Picked Up';
    final trailerOk = await _showTrailerSheet();
    if (!mounted || !trailerOk) return;
    final temp = await _showValueSheet(
      'Confirm Temperature',
      'Required: ${widget.stop.temperature ?? "—"}',
      'Enter current temp',
    );
    if (!mounted || temp == null) return;
    await _showDocument('Picked Up');
  }

  Future<void> _delivered() async {
    _pending = 'Delivered';
    final signed = await _showSignatureSheet();
    if (!mounted || !signed) return;
    await _showDocument('Delivered');
  }

  Future<void> _simpleCompleted() async {
    _pending = 'Completed';
    if (widget.stop.kind == TripStopKind.acquire) {
      final km = await _showValueSheet(
        'Odometer Reading',
        'Enter the truck odometer (km).',
        'Enter km',
        numeric: true,
      );
      if (km != null) _finish('Completed', '$km km');
    } else {
      final trailerOk = await _showTrailerSheet();
      if (trailerOk) _finish('Completed');
    }
  }

  Future<void> _showDocument(String label) async {
    await showAddDocumentSheet(
      context,
      onCapture: () => _finish(label),
      onSkip: () => _finish(label),
    );
  }

  void _navigate() async {
    final url = Uri.parse(
        'https://www.google.com/maps/dir/?api=1&destination=${widget.stop.lat},${widget.stop.lng}');
    await launchUrl(url, mode: LaunchMode.externalApplication);
  }

  // ─── sheets ───────────────────────────────────────────────────────
  Future<String?> _showValueSheet(
    String title,
    String subtitle,
    String placeholder, {
    bool numeric = false,
  }) {
    final controller = TextEditingController();
    return showModalBottomSheet<String>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      backgroundColor: Tokens.of(context).surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          left: 20,
          right: 20,
          top: 4,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
        ),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Center(
              child: Text(title,
                  style: const TextStyle(
                      fontWeight: FontWeight.w700, fontSize: 16))),
          const SizedBox(height: 4),
          Center(
              child: Text(subtitle,
                  style: TextStyle(color: Tokens.of(ctx).inkMuted))),
          const SizedBox(height: 16),
          TextField(
            controller: controller,
            keyboardType:
                numeric ? TextInputType.number : TextInputType.text,
            textAlign: TextAlign.center,
            decoration: InputDecoration(hintText: placeholder),
            autofocus: true,
          ),
          const SizedBox(height: 16),
          FilledButton(
            style: FilledButton.styleFrom(
                minimumSize: const Size.fromHeight(48)),
            onPressed: () {
              final v = controller.text.trim();
              if (v.isEmpty) return;
              Navigator.of(ctx).pop(v);
            },
            child: const Text('Confirm'),
          ),
        ]),
      ),
    );
  }

  Future<bool> _showTrailerSheet() async {
    final t = Tokens.of(context);
    final result = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      backgroundColor: t.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          const Center(
              child: Text('Confirm Trailer',
                  style: TextStyle(
                      fontWeight: FontWeight.w700, fontSize: 16))),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 16),
            decoration: BoxDecoration(
              color: t.surfaceMuted,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(children: [
              Text('CURRENT TRAILER',
                  style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.5,
                      color: t.inkMuted)),
              const SizedBox(height: 4),
              Text(widget.stop.trailer ?? '—',
                  style: const TextStyle(
                      fontSize: 22, fontWeight: FontWeight.w700)),
            ]),
          ),
          const SizedBox(height: 12),
          Text('Is this the correct trailer?',
              style: TextStyle(color: t.inkMuted)),
          const SizedBox(height: 16),
          Row(children: [
            Expanded(
              child: FilledButton(
                style: FilledButton.styleFrom(
                  backgroundColor: t.danger,
                  minimumSize: const Size.fromHeight(48),
                ),
                onPressed: () => Navigator.of(ctx).pop(true),
                child: const Text('Wrong'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: FilledButton(
                style: FilledButton.styleFrom(
                  backgroundColor: t.success,
                  minimumSize: const Size.fromHeight(48),
                ),
                onPressed: () => Navigator.of(ctx).pop(true),
                child: const Text('Correct'),
              ),
            ),
          ]),
          const SizedBox(height: 8),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: Text('Skip', style: TextStyle(color: t.inkMuted)),
          ),
        ]),
      ),
    );
    return result == true;
  }

  Future<bool> _showSignatureSheet() async {
    final t = Tokens.of(context);
    final controller = SignatureController(
      penColor: t.ink,
      penStrokeWidth: 2.5,
      exportBackgroundColor: t.surfaceMuted,
    );
    final result = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      backgroundColor: t.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return StatefulBuilder(builder: (ctx2, setSt) {
          // Subscribe once — rebuilds when ink changes so the Confirm
          // button can enable / disable.
          controller.addListener(() => setSt(() {}));
          final hasInk = !controller.isEmpty;
          return Padding(
            padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              const Center(
                  child: Text('Receiver Signature',
                      style: TextStyle(
                          fontWeight: FontWeight.w700, fontSize: 16))),
              const SizedBox(height: 4),
              Center(
                  child: Text(
                      'The receiver signs below to confirm delivery.',
                      style: TextStyle(color: t.inkMuted))),
              const SizedBox(height: 12),
              Container(
                decoration: BoxDecoration(
                  color: t.surfaceMuted,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: t.ink.withOpacity(0.15)),
                ),
                height: 160,
                child: Signature(
                  controller: controller,
                  backgroundColor: t.surfaceMuted,
                ),
              ),
              const SizedBox(height: 12),
              Row(children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      controller.clear();
                      setSt(() {});
                    },
                    child: const Text('Clear'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: hasInk
                        ? () => Navigator.of(ctx).pop(true)
                        : null,
                    child: const Text('Confirm'),
                  ),
                ),
              ]),
              const SizedBox(height: 8),
              TextButton(
                onPressed: () => Navigator.of(ctx).pop(true),
                child: Text('Skip signature',
                    style: TextStyle(color: t.inkMuted)),
              ),
            ]),
          );
        });
      },
    );
    controller.dispose();
    return result == true;
  }
}
