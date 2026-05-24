import 'package:flutter/material.dart';

import '../app/scale.dart';
import '../app/theme.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 16 + kShellBottomInset),
      children: [
        Center(
          child: Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: t.brand,
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(Icons.local_shipping,
                color: Colors.white, size: 32),
          ),
        ),
        const SizedBox(height: 12),
        Center(
            child: Text('TrackSmart',
                style: TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 18,
                    color: t.ink))),
        Center(
          child: Text('Fleet operations platform',
              style: TextStyle(color: t.inkMuted)),
        ),
        Center(
          child: Text('Version 1.0.0 (prototype)',
              style: TextStyle(color: t.inkMuted, fontSize: 11)),
        ),
        const SizedBox(height: 16),
        Card(
          margin: EdgeInsets.zero,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
                'TrackSmart is the mobile companion for the fleet '
                'operations platform — giving drivers and carriers their '
                'trips, load tenders, compliance and schedule in one place.',
                style: TextStyle(color: t.inkMuted, fontSize: 13)),
          ),
        ),
        const SizedBox(height: 16),
        Card(
          margin: EdgeInsets.zero,
          child: Column(children: const [
            ListTile(
              leading: Icon(Icons.description_outlined),
              title: Text('Version'),
              trailing: Text('1.0.0',
                  style: TextStyle(fontWeight: FontWeight.w600)),
            ),
            ListTile(
              leading: Icon(Icons.business_outlined),
              title: Text('Provider'),
              trailing: Text('Transplus Systems Corp.',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 12)),
            ),
            ListTile(
              leading: Icon(Icons.mail_outline),
              title: Text('Support'),
              trailing: Text('support@tracksmart.demo',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 11)),
            ),
          ]),
        ),
        const SizedBox(height: 16),
        Center(
          child: Text('© 2026 Transplus Systems Corp.',
              style: TextStyle(color: t.inkMuted, fontSize: 11)),
        ),
      ],
    );
  }
}
