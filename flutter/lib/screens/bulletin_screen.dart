import 'package:flutter/material.dart';

import '../app/scale.dart';
import '../app/theme.dart';
import '../data/repos.dart';
import '../models.dart';

class BulletinScreen extends StatefulWidget {
  const BulletinScreen({super.key});
  @override
  State<BulletinScreen> createState() => _BulletinScreenState();
}

class _BulletinScreenState extends State<BulletinScreen> {
  List<LoadTender>? _tenders;
  final Map<String, String> _decisions = {}; // id → "Accepted" / "Declined"

  @override
  void initState() {
    super.initState();
    BulletinRepo.all().then((d) => mounted ? setState(() => _tenders = d) : null);
  }

  @override
  Widget build(BuildContext context) {
    final tenders = _tenders;
    if (tenders == null) return const Center(child: CircularProgressIndicator());
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 16 + kShellBottomInset),
      itemCount: tenders.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (_, i) => _Card(
        tender: tenders[i],
        decision: _decisions[tenders[i].id],
        onDecide: (d) => setState(() => _decisions[tenders[i].id] = d),
      ),
    );
  }
}

class _Card extends StatelessWidget {
  const _Card({required this.tender, this.decision, required this.onDecide});
  final LoadTender tender;
  final String? decision;
  final ValueChanged<String> onDecide;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Card(
      margin: EdgeInsets.zero,
      color: t.brandLight,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(children: [
              CircleAvatar(
                radius: 14,
                backgroundColor: t.brand,
                child: Text(
                  tender.sender[0],
                  style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w700,
                      fontSize: 12),
                ),
              ),
              const SizedBox(width: 8),
              Text(tender.sender,
                  style: TextStyle(
                      fontWeight: FontWeight.w700, color: t.ink)),
              const Spacer(),
              Text(tender.time,
                  style: TextStyle(color: t.inkMuted, fontSize: 12)),
              if (tender.unread) ...[
                const SizedBox(width: 6),
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                      color: t.brand, shape: BoxShape.circle),
                ),
              ],
            ]),
            const SizedBox(height: 8),
            Text('LOAD TENDER',
                style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.5,
                    color: t.brand)),
            const SizedBox(height: 4),
            Text('${tender.origin} → ${tender.destination}',
                style: TextStyle(
                    fontWeight: FontWeight.w700, color: t.ink, fontSize: 14)),
            Text('Pickup ${tender.pickupTime} · Delivery ${tender.deliveryTime}',
                style: TextStyle(color: t.inkMuted, fontSize: 12)),
            const SizedBox(height: 12),
            if (decision == null)
              Row(children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => onDecide('Declined'),
                    child: const Text('Decline'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: FilledButton(
                    onPressed: () => onDecide('Accepted'),
                    child: const Text('Accept'),
                  ),
                ),
              ])
            else
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: decision == 'Accepted'
                      ? t.success.withOpacity(0.15)
                      : t.danger.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(decision!,
                    style: TextStyle(
                        color: decision == 'Accepted' ? t.success : t.danger,
                        fontWeight: FontWeight.w700,
                        fontSize: 12)),
              ),
          ],
        ),
      ),
    );
  }
}
