import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../app/theme.dart';
import '../../models.dart';
import 'stop_actions.dart';

const _kindMeta = <TripStopKind, ({String label, IconData icon})>{
  TripStopKind.acquire: (label: 'Acquire', icon: Icons.local_shipping_outlined),
  TripStopKind.hook: (label: 'Hook', icon: Icons.local_shipping_outlined),
  TripStopKind.pickup: (label: 'Pick Up', icon: Icons.inventory_2_outlined),
  TripStopKind.dropOff: (label: 'Drop Off', icon: Icons.business_outlined),
};

enum _State { done, next, upcoming }

/// One row in the trip's stop timeline. Done / next / upcoming visual
/// states drive the rail node + the card; tap to expand the detail +
/// actions.
class TripStopRow extends StatefulWidget {
  const TripStopRow({
    super.key,
    required this.stop,
    required this.index,
    required this.isLast,
    required this.isNext,
  });
  final TripStop stop;
  final int index;
  final bool isLast;
  final bool isNext;

  @override
  State<TripStopRow> createState() => _TripStopRowState();
}

class _TripStopRowState extends State<TripStopRow> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    final t = Tokens.of(context);
    final meta = _kindMeta[widget.stop.kind]!;
    final state = widget.stop.completed
        ? _State.done
        : widget.isNext
            ? _State.next
            : _State.upcoming;
    final isYard = widget.stop.kind == TripStopKind.acquire ||
        widget.stop.kind == TripStopKind.hook;

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _rail(t, state),
          const SizedBox(width: 12),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Container(
                clipBehavior: Clip.antiAlias,
                decoration: _cardDeco(t, state),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    InkWell(
                      onTap: () => setState(() => _expanded = !_expanded),
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Row(children: [
                          _chip(t, state, meta.icon),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(meta.label,
                                    style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w700,
                                        color: t.ink)),
                                Text(widget.stop.name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style:
                                        TextStyle(fontSize: 13, color: t.ink)),
                                Text(
                                  '${widget.stop.location} · ${widget.stop.appointment}',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                      fontSize: 11, color: t.inkMuted),
                                ),
                              ],
                            ),
                          ),
                          if (state != _State.upcoming) _stateBadge(t, state),
                          const SizedBox(width: 4),
                          Icon(
                            _expanded
                                ? Icons.keyboard_arrow_up
                                : Icons.chevron_right,
                            size: 18,
                            color: t.inkMuted,
                          ),
                        ]),
                      ),
                    ),
                    if (_expanded)
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          border: Border(
                            top: BorderSide(color: t.ink.withOpacity(0.1)),
                          ),
                        ),
                        child: _detail(t, isYard),
                      ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _rail(Tokens t, _State state) {
    final node = state == _State.done
        ? Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(color: t.success, shape: BoxShape.circle),
            child: const Icon(Icons.check, color: Colors.white, size: 16),
          )
        : Container(
            width: 28,
            height: 28,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: t.surface,
              shape: BoxShape.circle,
              border: Border.all(
                color: state == _State.next ? t.brand : t.backdrop,
                width: 2,
              ),
            ),
            child: Text('${widget.index}',
                style: TextStyle(
                    color: state == _State.next ? t.brand : t.inkMuted,
                    fontSize: 12,
                    fontWeight: FontWeight.w700)),
          );

    return SizedBox(
      width: 28,
      child: Column(children: [
        node,
        if (!widget.isLast)
          Expanded(
            child: Container(
              width: 2,
              margin: const EdgeInsets.symmetric(vertical: 4),
              color: widget.stop.completed ? t.success : t.backdrop,
            ),
          ),
      ]),
    );
  }

  BoxDecoration _cardDeco(Tokens t, _State state) {
    switch (state) {
      case _State.done:
        return BoxDecoration(
          color: t.surface,
          borderRadius: BorderRadius.circular(kCardRadius),
          border: Border.all(color: t.ink.withOpacity(0.05)),
        );
      case _State.next:
        return BoxDecoration(
          color: t.brandLight,
          borderRadius: BorderRadius.circular(kCardRadius),
          border: Border.all(color: t.brand, width: 2),
        );
      case _State.upcoming:
        return BoxDecoration(
          color: t.surfaceMuted,
          borderRadius: BorderRadius.circular(kCardRadius),
        );
    }
  }

  Widget _chip(Tokens t, _State state, IconData icon) {
    Color bg;
    Color fg;
    switch (state) {
      case _State.done:
        bg = t.success.withOpacity(0.1);
        fg = t.success;
        break;
      case _State.next:
        bg = t.brand;
        fg = Colors.white;
        break;
      case _State.upcoming:
        bg = t.surface;
        fg = t.inkMuted;
        break;
    }
    return Container(
      width: 36,
      height: 36,
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Icon(icon, size: 20, color: fg),
    );
  }

  Widget _stateBadge(Tokens t, _State state) {
    final isDone = state == _State.done;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: isDone ? t.success.withOpacity(0.1) : t.brand,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        isDone ? 'DONE' : 'NEXT',
        style: TextStyle(
          color: isDone ? t.success : Colors.white,
          fontSize: 10,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.5,
        ),
      ),
    );
  }

  Widget _detail(Tokens t, bool isYard) {
    final stop = widget.stop;
    final refLabel = stop.kind == TripStopKind.dropOff
        ? 'Drop Off Number'
        : 'Pick Up Number';
    final noteLabel =
        stop.kind == TripStopKind.dropOff ? 'Drop Off Note' : 'Pickup Note';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Equipment chips
        if (stop.powerUnit != null || stop.trailer != null) ...[
          Row(children: [
            if (stop.powerUnit != null)
              Expanded(
                child: _equipChip(t, Icons.local_shipping_outlined,
                    'Unit ${stop.powerUnit}'),
              ),
            if (stop.powerUnit != null && stop.trailer != null)
              const SizedBox(width: 8),
            if (stop.trailer != null)
              Expanded(
                child: _equipChip(t, Icons.inventory_2_outlined,
                    'Trailer ${stop.trailer}'),
              ),
          ]),
          const SizedBox(height: 12),
        ],

        if (!isYard) ...[
          if (stop.note != null) ...[
            _note(t, noteLabel, stop.note!),
            const SizedBox(height: 12),
          ],
          _row(t, Icons.location_on_outlined, 'Address', stop.address,
              link: _mapsUrl(stop)),
          _row(t, Icons.calendar_today_outlined, 'Appointment',
              stop.appointment),
          if (stop.pickupNumber != null)
            _row(t, Icons.description_outlined, refLabel, stop.pickupNumber!),
          if (stop.temperature != null)
            _row(t, Icons.thermostat_outlined, 'Temperature', stop.temperature!),
          if (stop.phone != null)
            _row(t, Icons.phone_outlined, 'Phone', stop.phone!),
          _row(t, Icons.mail_outline, 'Email address', stop.email),
          const SizedBox(height: 8),
        ],

        // Actions
        Container(
          padding: const EdgeInsets.only(top: 12),
          decoration: BoxDecoration(
            border: Border(top: BorderSide(color: t.ink.withOpacity(0.1))),
          ),
          child: StopActions(stop: stop),
        ),
      ],
    );
  }

  Widget _equipChip(Tokens t, IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: t.surfaceMuted,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
        Icon(icon, size: 16, color: t.brand),
        const SizedBox(width: 6),
        Text(label,
            style: TextStyle(
                color: t.ink, fontWeight: FontWeight.w600, fontSize: 12)),
      ]),
    );
  }

  Widget _note(Tokens t, String label, String text) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: t.warning.withOpacity(0.1),
        border: Border.all(color: t.warning.withOpacity(0.3)),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Icon(Icons.info_outline, size: 14, color: t.warning),
          const SizedBox(width: 6),
          Text(label,
              style: TextStyle(
                  color: t.warning,
                  fontSize: 11,
                  fontWeight: FontWeight.w700)),
        ]),
        const SizedBox(height: 4),
        Text(text, style: TextStyle(color: t.ink, fontSize: 13)),
      ]),
    );
  }

  Widget _row(Tokens t, IconData icon, String label, String value,
      {Uri? link}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Icon(icon, size: 16, color: t.brand),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: TextStyle(
                        color: t.ink,
                        fontSize: 11,
                        fontWeight: FontWeight.w600)),
                if (link != null)
                  InkWell(
                    onTap: () =>
                        launchUrl(link, mode: LaunchMode.externalApplication),
                    child: Text(value,
                        style: TextStyle(
                            color: t.brand,
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            decoration: TextDecoration.underline)),
                  )
                else
                  Text(value, style: TextStyle(color: t.inkMuted, fontSize: 13)),
              ]),
        ),
      ]),
    );
  }

  Uri _mapsUrl(TripStop s) => Uri.parse(
      'https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}');
}
