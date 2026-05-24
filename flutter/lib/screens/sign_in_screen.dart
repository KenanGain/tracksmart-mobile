import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../app/scale.dart';
import '../app/theme.dart';
import '../data/repos.dart';
import '../models.dart';
import '../widgets/primitives.dart';

class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key});
  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  DemoUser? _demo;
  final _email = TextEditingController();
  final _password = TextEditingController(text: AuthRepo.demoPassword);
  bool _showPass = false;
  bool _loading = false;
  String? _error;

  void _pickDemo(DemoUser u) {
    setState(() {
      _demo = u;
      _error = null;
      _email.text = u.email;
      _password.text = AuthRepo.demoPassword;
    });
  }

  Future<void> _openPicker() async {
    final users = AuthRepo.demoUsers();
    final picked = await showModalBottomSheet<DemoUser>(
      context: context,
      backgroundColor: Tokens.of(context).surface,
      showDragHandle: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        final t = Tokens.of(ctx);
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(S.s5, 0, S.s5, S.s5),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Padding(
                  padding: const EdgeInsets.only(bottom: S.s3),
                  child: Text('Pick a demo user',
                      style: Tx.base
                          .copyWith(fontWeight: fw700, color: t.ink)),
                ),
                for (final u in users)
                  Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () => Navigator.of(ctx).pop(u),
                      borderRadius: BorderRadius.circular(R.r8),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                            vertical: S.s3, horizontal: S.s2),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 18,
                              backgroundColor: t.brand,
                              child: Text(
                                _initials(u.name),
                                style: Tx.xs.copyWith(
                                    color: Colors.white,
                                    fontWeight: fw700),
                              ),
                            ),
                            const SizedBox(width: S.s3),
                            Expanded(
                              child: Column(
                                crossAxisAlignment:
                                    CrossAxisAlignment.start,
                                children: [
                                  Text(u.name,
                                      style: Tx.sm.copyWith(
                                          fontWeight: fw600,
                                          color: t.ink)),
                                  Text('${u.jobTitle} · ${u.email}',
                                      style: Tx.xs
                                          .copyWith(color: t.inkMuted)),
                                ],
                              ),
                            ),
                            if (_demo?.id == u.id)
                              Icon(Icons.check, color: t.brand),
                          ],
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        );
      },
    );
    if (picked != null) _pickDemo(picked);
  }

  String _initials(String name) {
    final parts = name.trim().split(RegExp(r'\s+'));
    final letters = parts.take(2).map((p) => p.isEmpty ? '' : p[0]).join();
    return letters.toUpperCase();
  }

  Future<void> _submit() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    final r = await AuthRepo.signIn(_email.text, _password.text);
    if (!mounted) return;
    if (r.ok) {
      context.go('/home');
    } else {
      setState(() {
        _error = r.error;
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Scaffold(
      backgroundColor: t.surfaceMuted,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(
                horizontal: S.s6, vertical: S.s10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Logo tile
                Center(
                  child: Container(
                    width: Sz.x14,
                    height: Sz.x14,
                    decoration: BoxDecoration(
                      color: t.brand,
                      borderRadius: BorderRadius.circular(R.r16),
                    ),
                    child: const Icon(Icons.local_shipping,
                        color: Colors.white, size: 28),
                  ),
                ),
                const SizedBox(height: S.s3),
                Center(
                  child: Text('TrackSmart',
                      style: Tx.xl
                          .copyWith(color: t.ink, fontWeight: fw700)),
                ),
                Center(
                  child: Text('Fleet operations platform',
                      style: Tx.t13.copyWith(color: t.inkMuted)),
                ),
                const SizedBox(height: S.s6),

                // Card
                AppCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text('Sign in to your account',
                          style: Tx.base
                              .copyWith(fontWeight: fw600, color: t.ink)),
                      const SizedBox(height: S.s4),

                      // "QUICK DEMO LOGIN" label + picker button
                      Text('QUICK DEMO LOGIN',
                          style: Tx.t11.copyWith(
                              fontWeight: fw700,
                              letterSpacing: 0.5,
                              color: t.brand)),
                      const SizedBox(height: S.s1_5),
                      _DemoPickerButton(
                        demo: _demo,
                        onTap: _loading ? null : _openPicker,
                      ),
                      const SizedBox(height: S.s4),

                      // Email
                      _TextLabel('Email', t),
                      const SizedBox(height: S.s1_5),
                      TextField(
                        controller: _email,
                        keyboardType: TextInputType.emailAddress,
                        onChanged: (_) => setState(() => _demo = null),
                        decoration: _inputDeco(t,
                            prefix: Icons.mail_outline,
                            hint: 'you@example.com'),
                      ),
                      const SizedBox(height: S.s3),

                      // Password
                      _TextLabel('Password', t),
                      const SizedBox(height: S.s1_5),
                      TextField(
                        controller: _password,
                        obscureText: !_showPass,
                        onChanged: (_) => setState(() => _demo = null),
                        decoration: _inputDeco(
                          t,
                          prefix: Icons.lock_outline,
                          hint: '••••••••',
                          suffix: IconButton(
                            onPressed: () =>
                                setState(() => _showPass = !_showPass),
                            icon: Icon(_showPass
                                ? Icons.visibility_off_outlined
                                : Icons.visibility_outlined),
                            color: t.inkMuted,
                          ),
                        ),
                      ),
                      const SizedBox(height: S.s1_5),
                      Text('Demo password: ${AuthRepo.demoPassword}',
                          style:
                              Tx.t11.copyWith(color: t.inkMuted)),

                      if (_error != null) ...[
                        const SizedBox(height: S.s3),
                        Container(
                          padding: const EdgeInsets.all(S.s2),
                          decoration: BoxDecoration(
                            color: t.danger.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(R.r8),
                          ),
                          child: Text(_error!,
                              style: Tx.xs.copyWith(
                                  color: t.danger, fontWeight: fw600)),
                        ),
                      ],

                      const SizedBox(height: S.s4),
                      AppPrimaryButton(
                        label: _loading ? 'Signing in…' : 'Sign In',
                        icon: Icons.login,
                        onPressed: _loading ? null : _submit,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: S.s4),
                Center(
                  child: Text(
                      'Prototype build · No real authentication is performed.',
                      textAlign: TextAlign.center,
                      style: Tx.t11.copyWith(color: t.inkMuted)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

InputDecoration _inputDeco(
  Tokens t, {
  required IconData prefix,
  required String hint,
  Widget? suffix,
}) {
  return InputDecoration(
    isDense: true,
    contentPadding:
        const EdgeInsets.symmetric(horizontal: S.s3, vertical: S.s3),
    filled: true,
    fillColor: t.surfaceMuted,
    hintText: hint,
    hintStyle: Tx.sm.copyWith(color: t.inkMuted),
    prefixIcon: Icon(prefix, color: t.inkMuted, size: Sz.x5),
    suffixIcon: suffix,
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

class _TextLabel extends StatelessWidget {
  const _TextLabel(this.text, this.t);
  final String text;
  final Tokens t;
  @override
  Widget build(BuildContext context) => Text(text,
      style: Tx.t13.copyWith(fontWeight: fw600, color: t.ink));
}

class _DemoPickerButton extends StatelessWidget {
  const _DemoPickerButton({required this.demo, required this.onTap});
  final DemoUser? demo;
  final VoidCallback? onTap;
  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    return Material(
      color: t.surfaceMuted,
      borderRadius: BorderRadius.circular(R.r8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(R.r8),
        child: Padding(
          padding: const EdgeInsets.symmetric(
              horizontal: S.s3, vertical: S.s3),
          child: Row(
            children: [
              Icon(Icons.person_outline, color: t.inkMuted, size: Sz.x5),
              const SizedBox(width: S.s2),
              Expanded(
                child: Text(
                  demo == null
                      ? 'Select a user…'
                      : '${demo!.name} · ${demo!.jobTitle}',
                  style: Tx.sm.copyWith(
                      color: demo == null ? t.inkMuted : t.ink,
                      fontWeight: demo == null ? fw400 : fw500),
                ),
              ),
              Icon(Icons.expand_more, color: t.inkMuted, size: Sz.x5),
            ],
          ),
        ),
      ),
    );
  }
}
