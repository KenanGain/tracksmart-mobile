import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../app/scale.dart';
import '../app/theme.dart';
import '../data/repos.dart';
import '../models.dart';

class ChatsScreen extends StatefulWidget {
  const ChatsScreen({super.key});
  @override
  State<ChatsScreen> createState() => _ChatsScreenState();
}

class _ChatsScreenState extends State<ChatsScreen> {
  List<Conversation>? _conversations;
  String _query = '';

  @override
  void initState() {
    super.initState();
    ChatsRepo.all().then((d) {
      if (mounted) setState(() => _conversations = d);
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final all = _conversations;
    if (all == null) return const Center(child: CircularProgressIndicator());
    final term = _query.trim().toLowerCase();
    final list = term.isEmpty
        ? all
        : all
            .where((c) =>
                '${c.name} ${c.lastMessage}'.toLowerCase().contains(term))
            .toList();

    return Stack(
      children: [
        ListView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 16 + kShellBottomInset),
          children: [
            TextField(
              decoration: const InputDecoration(
                hintText: 'Search',
                prefixIcon: Icon(Icons.search),
              ),
              onChanged: (v) => setState(() => _query = v),
            ),
            const SizedBox(height: 12),
            if (list.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 24),
                child: Center(
                  child: Text('No conversations found.',
                      style: TextStyle(color: t.inkMuted)),
                ),
              )
            else
              for (final c in list) ...[
                _row(c, t, context),
                const SizedBox(height: 8),
              ],
          ],
        ),
        Positioned(
          right: 16,
          bottom: 16,
          child: FloatingActionButton.extended(
            onPressed: () => _showNewChat(context),
            icon: const Icon(Icons.add),
            label: const Text('New chat'),
          ),
        ),
      ],
    );
  }

  Widget _row(Conversation c, Tokens t, BuildContext ctx) {
    return Card(
      margin: EdgeInsets.zero,
      child: InkWell(
        onTap: () => ctx.push('/chat/${c.id}'),
        borderRadius: BorderRadius.circular(kCardRadius),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(children: [
            CircleAvatar(
              radius: 24,
              backgroundColor: t.backdrop,
              child: Icon(Icons.person, color: t.inkMuted),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(children: [
                      Expanded(
                        child: Text(c.name,
                            style: TextStyle(
                                fontWeight: FontWeight.w700, color: t.ink)),
                      ),
                      Text(c.time,
                          style:
                              TextStyle(fontSize: 12, color: t.inkMuted)),
                    ]),
                    Row(children: [
                      Expanded(
                        child: Text(
                          c.lastMessage,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                              color: c.unread ? t.ink : t.inkMuted,
                              fontWeight: c.unread
                                  ? FontWeight.w600
                                  : FontWeight.normal,
                              fontSize: 13),
                        ),
                      ),
                      if (c.unread)
                        Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                              color: t.brand, shape: BoxShape.circle),
                        ),
                    ]),
                  ]),
            ),
          ]),
        ),
      ),
    );
  }

  Future<void> _showNewChat(BuildContext context) async {
    final contacts = await ContactsRepo.all();
    if (!mounted) return;
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      backgroundColor: Tokens.of(context).surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        String q = '';
        return StatefulBuilder(builder: (ctx2, setSt) {
          final t = Tokens.of(ctx2);
          final filtered = contacts
              .where((c) => q.isEmpty ||
                  '${c.name} ${c.role}'.toLowerCase().contains(q.toLowerCase()))
              .toList();
          return Padding(
            padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              const Center(
                  child: Text('New Chat',
                      style: TextStyle(
                          fontSize: 16, fontWeight: FontWeight.w700))),
              const SizedBox(height: 12),
              TextField(
                decoration: const InputDecoration(
                  hintText: 'Search contacts',
                  prefixIcon: Icon(Icons.search),
                ),
                onChanged: (v) => setSt(() => q = v),
              ),
              const SizedBox(height: 12),
              ConstrainedBox(
                constraints:
                    BoxConstraints(maxHeight: MediaQuery.of(ctx).size.height * 0.5),
                child: ListView.builder(
                  shrinkWrap: true,
                  itemCount: filtered.length,
                  itemBuilder: (_, i) {
                    final c = filtered[i];
                    return ListTile(
                      leading: CircleAvatar(
                        backgroundColor: t.brand,
                        child: Text(c.initials,
                            style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w700,
                                fontSize: 12)),
                      ),
                      title: Text(c.name),
                      subtitle: Text(c.role),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () {
                        Navigator.of(ctx).pop();
                        context.push('/chat/${c.id}');
                      },
                    );
                  },
                ),
              ),
            ]),
          );
        });
      },
    );
  }
}
