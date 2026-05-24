import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../app/scale.dart';
import '../app/theme.dart';
import '../data/repos.dart';
import '../models.dart';

/// ChatThread — 1:1 mirror of `components/chats/ChatThread.tsx`.
class ChatThreadScreen extends StatefulWidget {
  const ChatThreadScreen({super.key, required this.id});
  final String id;
  @override
  State<ChatThreadScreen> createState() => _ChatThreadScreenState();
}

class _ChatThreadScreenState extends State<ChatThreadScreen> {
  Conversation? _conv;
  final _draft = TextEditingController();

  @override
  void initState() {
    super.initState();
    ChatsRepo.byId(widget.id).then((c) {
      if (mounted) setState(() => _conv = c);
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final conv = _conv;
    return Scaffold(
      backgroundColor: t.surfaceMuted,
      body: SafeArea(
        child: conv == null
            ? const Center(child: CircularProgressIndicator())
            : Column(
                children: [
                  _Header(title: conv.name),
                  Expanded(
                    child: conv.messages.isEmpty
                        ? _Empty(name: conv.name)
                        : ListView.builder(
                            padding: const EdgeInsets.all(S.s4),
                            itemCount: conv.messages.length,
                            itemBuilder: (_, i) =>
                                _Bubble(message: conv.messages[i]),
                          ),
                  ),
                  _InputBar(
                    controller: _draft,
                    onSend: _draft.text.trim().isEmpty
                        ? null
                        : () => setState(() => _draft.clear()),
                    onChanged: () => setState(() {}),
                  ),
                ],
              ),
      ),
    );
  }
}

/// Header — `h-14 border-b border-ink/5 bg-surface px-3`
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
                style: Tx.base.copyWith(fontWeight: fw700, color: t.ink)),
          ),
        ),
        const SizedBox(width: 36),
      ]),
    );
  }
}

class _Empty extends StatelessWidget {
  const _Empty({required this.name});
  final String name;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Center(
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Container(
          width: Sz.x14,
          height: Sz.x14,
          decoration: BoxDecoration(
            color: t.brandLight,
            shape: BoxShape.circle,
          ),
          child: Icon(Icons.chat_bubble_outline,
              color: t.brand, size: Sz.x7),
        ),
        const SizedBox(height: S.s3),
        Text('Start the conversation',
            style: Tx.sm.copyWith(fontWeight: fw600, color: t.ink)),
        const SizedBox(height: 2),
        Text('Say hello to $name.',
            style: Tx.xs.copyWith(color: t.inkMuted)),
      ]),
    );
  }
}

/// Message bubble — `max-w-[80%] px-3.5 py-2 text-sm`
///  mine: `rounded-2xl rounded-br-md bg-brand text-white`
///  other: `rounded-2xl rounded-bl-md bg-surface-muted text-ink`
/// Sender + time `text-[11px] text-ink-muted` above bubble.
/// Optional day separator above with hairline + label.
class _Bubble extends StatelessWidget {
  const _Bubble({required this.message});
  final ChatMessage message;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final mine = message.fromMe;
    return Padding(
      padding: const EdgeInsets.only(bottom: S.s2),
      child: Column(
        crossAxisAlignment:
            mine ? CrossAxisAlignment.end : CrossAxisAlignment.start,
        children: [
          if (message.dayMarker != null)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: S.s3),
              child: Row(children: [
                Expanded(
                  child: Container(
                      height: 1,
                      color: t.ink.withValues(alpha: 0.1)),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: S.s3),
                  child: Text(message.dayMarker!,
                      style: Tx.xs.copyWith(
                          fontWeight: fw500, color: t.inkMuted)),
                ),
                Expanded(
                  child: Container(
                      height: 1,
                      color: t.ink.withValues(alpha: 0.1)),
                ),
              ]),
            ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: S.s1),
            child: Text(
              message.senderLabel == null
                  ? message.time
                  : '${message.senderLabel}, ${message.time}',
              style: Tx.t11.copyWith(color: t.inkMuted),
            ),
          ),
          const SizedBox(height: 2),
          FractionallySizedBox(
            widthFactor: 1.0,
            child: Align(
              alignment:
                  mine ? Alignment.centerRight : Alignment.centerLeft,
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  maxWidth: MediaQuery.of(context).size.width * 0.8,
                ),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 14, vertical: S.s2),
                  decoration: BoxDecoration(
                    color: mine ? t.brand : t.surfaceMuted,
                    borderRadius: BorderRadius.only(
                      topLeft: const Radius.circular(16),
                      topRight: const Radius.circular(16),
                      bottomLeft: Radius.circular(mine ? 16 : 6),
                      bottomRight: Radius.circular(mine ? 6 : 16),
                    ),
                  ),
                  child: Text(message.text,
                      style: Tx.sm.copyWith(
                          color: mine ? Colors.white : t.ink)),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Input bar — paperclip (h-9 w-9), rounded-full input, h-10 w-10 brand send.
class _InputBar extends StatelessWidget {
  const _InputBar({
    required this.controller,
    required this.onSend,
    required this.onChanged,
  });
  final TextEditingController controller;
  final VoidCallback? onSend;
  final VoidCallback onChanged;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Container(
      decoration: BoxDecoration(
        color: t.surface,
        border: Border(
            top: BorderSide(color: t.ink.withValues(alpha: 0.05))),
      ),
      padding: const EdgeInsets.symmetric(
          horizontal: S.s3, vertical: S.s3),
      child: Row(children: [
        Material(
          color: Colors.transparent,
          shape: const CircleBorder(),
          child: InkWell(
            customBorder: const CircleBorder(),
            onTap: () {},
            child: SizedBox(
              width: 36,
              height: 36,
              child:
                  Icon(Icons.attach_file, color: t.inkMuted, size: Sz.x5),
            ),
          ),
        ),
        const SizedBox(width: S.s2),
        Expanded(
          child: Container(
            decoration: BoxDecoration(
              color: t.surfaceMuted,
              borderRadius: BorderRadius.circular(R.rFull),
            ),
            padding: const EdgeInsets.symmetric(
                horizontal: S.s4, vertical: S.s2_5),
            child: TextField(
              controller: controller,
              onChanged: (_) => onChanged(),
              style: Tx.sm.copyWith(color: t.ink),
              decoration: InputDecoration(
                isDense: true,
                contentPadding: EdgeInsets.zero,
                border: InputBorder.none,
                hintText: 'Message',
                hintStyle: Tx.sm.copyWith(color: t.inkMuted),
              ),
            ),
          ),
        ),
        const SizedBox(width: S.s2),
        Material(
          color: onSend == null
              ? t.brand.withValues(alpha: 0.5)
              : t.brand,
          shape: const CircleBorder(),
          child: InkWell(
            onTap: onSend,
            customBorder: const CircleBorder(),
            child: const SizedBox(
              width: Sz.x10,
              height: Sz.x10,
              child: Icon(Icons.send,
                  color: Colors.white, size: 16),
            ),
          ),
        ),
      ]),
    );
  }
}
