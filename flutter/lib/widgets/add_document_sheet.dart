import 'package:flutter/material.dart';

import '../app/theme.dart';

/// Add Document capture sheet — mirrors `AddDocumentSheet.tsx`. Capture
/// actions are placeholders (a real build wires `image_picker` /
/// `file_picker`). `onCapture` and `onSkip` are optional.
Future<void> showAddDocumentSheet(
  BuildContext context, {
  VoidCallback? onCapture,
  VoidCallback? onSkip,
}) {
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    backgroundColor: Tokens.of(context).surface,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (ctx) => _Body(onCapture: onCapture, onSkip: onSkip),
  );
}

class _Body extends StatelessWidget {
  const _Body({this.onCapture, this.onSkip});
  final VoidCallback? onCapture;
  final VoidCallback? onSkip;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);

    void capture() {
      onCapture?.call();
      Navigator.of(context).pop();
    }

    void skip() {
      onSkip?.call();
      Navigator.of(context).pop();
    }

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Text(
                'Add Document',
                style: TextStyle(
                  color: t.ink,
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            const SizedBox(height: 4),
            Center(
              child: Text(
                'How would you like to capture the document?',
                style: TextStyle(color: t.inkMuted, fontSize: 14),
              ),
            ),
            const SizedBox(height: 20),
            Row(children: [
              Expanded(child: _Tile(icon: Icons.description_outlined, label: 'Scan Document', onTap: capture, t: t)),
              const SizedBox(width: 12),
              Expanded(child: _Tile(icon: Icons.camera_alt_outlined, label: 'Take Photo', onTap: capture, t: t)),
            ]),
            const SizedBox(height: 12),
            _Row(icon: Icons.folder_outlined, label: 'Upload from Files', onTap: capture, t: t),
            const SizedBox(height: 8),
            _Row(icon: Icons.image_outlined, label: 'Select from Gallery', onTap: capture, t: t),
            if (onSkip != null) ...[
              const SizedBox(height: 16),
              FilledButton.tonal(
                onPressed: skip,
                style: FilledButton.styleFrom(
                  backgroundColor: t.surfaceMuted,
                  foregroundColor: t.ink,
                  minimumSize: const Size.fromHeight(48),
                ),
                child: const Text('Skip for now'),
              ),
            ],
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Cancel',
                  style: TextStyle(color: t.inkMuted)),
            ),
          ],
        ),
      ),
    );
  }
}

class _Tile extends StatelessWidget {
  const _Tile({required this.icon, required this.label, required this.onTap, required this.t});
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Tokens t;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 18),
        decoration: BoxDecoration(
          color: t.surfaceMuted,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(children: [
          Icon(icon, size: 28, color: t.inkMuted),
          const SizedBox(height: 6),
          Text(label,
              textAlign: TextAlign.center,
              style: TextStyle(
                  color: t.ink, fontWeight: FontWeight.w600, fontSize: 13)),
        ]),
      ),
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({required this.icon, required this.label, required this.onTap, required this.t});
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Tokens t;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
        decoration: BoxDecoration(
          color: t.surfaceMuted,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 16, color: t.inkMuted),
            const SizedBox(width: 8),
            Text(label,
                style: TextStyle(
                    color: t.ink, fontWeight: FontWeight.w600, fontSize: 13)),
          ],
        ),
      ),
    );
  }
}
