# TimeLink V5 premium integration gates

Status: NOT IMPLEMENTED / NOT PAYMENT-TESTED.

1. Verify V5 sealed release, ownership, copyright rights, and broadcast grants before promotion eligibility.
2. Use separate KRW promotion orders; do not invoke generic Toss TL-credit settlement.
3. Activate TL PREMIUM only after server-side payment verification, amount check and idempotent posting.
4. Deduct KRW budget only for verified actual broadcast airtime at 2.5 KRW per second; avoid duplicate event IDs.
5. Keep regular TILO 0.3 TL/second 70:30 rights-holder/platform accounting separate from promotional broadcasts.
6. DJ promotion reward rate must be configured and approved by admin before enabling payout.
7. Link verified settlement to PoC only once; no TLC mint from payment alone.
8. Test with Toss sandbox, TILO receiver, ledger reconciliation and TON testnet before production.

Known blocker: station inventory currently requires active service-file grants and country-specific rights grants; a public SharePlace release alone is not a broadcast license.
