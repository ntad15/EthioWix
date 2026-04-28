# Domain Registrar Integration

Lets users either buy a domain through FetanSites (paid in birr via Chapa, registered via Porkbun) or point an externally-owned domain at FetanSites with DNS instructions.

See the original plan: [.claude/plans/domain-registrar-integration.md](../.claude/plans/domain-registrar-integration.md).

## Setup checklist

### One-time (you've already done these)

- [x] Run [supabase-domains-schema.sql](../supabase-domains-schema.sql) in the Supabase SQL editor.
- [x] Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` (Supabase dashboard → Project Settings → API → `service_role` key).

### Still to do before testing

- [ ] **Porkbun API keys** — sign up at [porkbun.com/account/api](https://porkbun.com/account/api), enable API access, set `PORKBUN_API_KEY` and `PORKBUN_SECRET_API_KEY` in `.env.local`. For development you can use Porkbun's real API — they don't have a sandbox; use a cheap test domain (`.xyz` is ~$1) or just exercise the read-only endpoints (search, pricing).
- [ ] **Chapa keys** — get test keys from the Chapa dashboard. Set `CHAPA_SECRET_KEY`, `CHAPA_PUBLIC_KEY`, `CHAPA_WEBHOOK_SECRET`.
- [ ] **Edge IP** — set `FETANSITES_EDGE_IP` to the public IPv4 of your Caddy host. This is what apex A-records will point to.
- [ ] **Cron secret** — set `DOMAIN_CRON_SECRET` to a long random string. The renewal cron at `/api/cron/renew-domains` requires the `x-cron-secret` header to match.
- [ ] **Registrant contact** — set the `REGISTRANT_*` vars to FetanSites' company contact. This is the WHOIS-of-record contact for every domain you register on a user's behalf.
- [ ] **Webhook URL in Chapa** — register `https://<your-domain>/api/webhooks/chapa` as the webhook endpoint in the Chapa dashboard, using the same secret as `CHAPA_WEBHOOK_SECRET`.

### Before going live

- [ ] **Confirm Chapa tokenization is enabled on your account.** Auto-renew (the `chargeToken` call) requires Chapa's Direct Charge product. If your account doesn't have it, auto-renew will fail and you'll need to fall back to manual yearly invoicing.
- [ ] **Schedule the renewal cron.** Hit `POST /api/cron/renew-domains` with `x-cron-secret: <DOMAIN_CRON_SECRET>` daily. Options: Vercel cron, a `docker-compose` cron container, or any external scheduler.
- [ ] **Add a ToS / `/legal/domains` page** covering: non-refundable, FetanSites is registrant of record, transfer-out not in v1, 60-day ICANN transfer lock.
- [ ] **Bump prices quarterly.** Edit [src/lib/domains/pricing.ts](../src/lib/domains/pricing.ts) — flat birr per TLD, FetanSites absorbs FX risk.

## Smoke test

### Search (read-only, safe to run anytime)

1. Sign in to the dashboard.
2. Go to **Settings → Domain → Get a new domain**.
3. Search `myteststore`. You should see `.com` / `.net` / `.org` / `.xyz` availability + birr prices.
4. If the request fails: check `PORKBUN_API_KEY` / `PORKBUN_SECRET_API_KEY` in `.env.local`.

### Buy (real money in test mode)

1. With Chapa **test keys** set, click Buy on an available domain.
2. Fill the contact form, hit **Pay with Chapa**.
3. Complete the test payment in Chapa's checkout page.
4. Chapa redirects to `/settings/domain?order=<id>`. The webhook should fire in the background.
5. Within ~10s, the `domain_orders` row should be `REGISTERED` and the `domains` row should be `ACTIVE` with an `expires_at` set.
6. **Failure path**: temporarily edit `src/lib/registrar/porkbun.ts` to make `createDomain` return `{ ok: false, ... }`. Re-run the flow. Order should end as `REFUNDED`, the placeholder domain row should be `FAILED`, and the Chapa dashboard should show a refund.

### Bring-your-own domain

1. Go to **Settings → Domain → I already own a domain**.
2. Enter a domain you control. Get DNS instructions.
3. For local testing, add a line to `/etc/hosts`: `127.0.0.1 example.com`.
4. Click **Verify connection**. (DNS lookup happens server-side via `dns.resolve4` — `/etc/hosts` won't help here. To actually verify locally, point a real cheap test domain at your dev box's public IP and run via ngrok or similar.)
5. When verified, the `domains` row flips to `ACTIVE` and Caddy's `/api/internal/check-domain` will accept it for cert issuance.

### Renewal

```bash
curl -X POST https://<host>/api/cron/renew-domains \
  -H "x-cron-secret: $DOMAIN_CRON_SECRET"
```

For each ACTIVE, auto-renewing, REGISTERED domain expiring within 30 days, this charges the user's stored Chapa token and calls Porkbun `/domain/renew`. Returns a JSON outcome list.

After 3 failed renewal attempts (across separate cron runs), the domain is marked `EXPIRED` and the user must re-pay manually.

## Architecture notes

- **State machine**: `domain_orders.status` is the source of truth. `PENDING_PAYMENT → PAID → REGISTERED` (happy path) or `→ REFUNDED / FAILED`. The webhook is idempotent on `chapa_tx_ref`.
- **RLS**: users can only `select` their own `domains` and `domain_orders` (see [supabase-domains-schema.sql](../supabase-domains-schema.sql)). Backend writes from the webhook / cron / register job use the service-role client at [src/lib/supabase/admin.ts](../src/lib/supabase/admin.ts), which bypasses RLS.
- **Caddy on-demand TLS**: [src/app/api/internal/check-domain/route.ts](../src/app/api/internal/check-domain/route.ts) is the ask-endpoint. Returns 200 for `*.fetansites.com` (existing) and for any custom domain with an `ACTIVE` row.
- **Middleware**: [src/middleware.ts](../src/middleware.ts) rewrites custom-domain requests onto `/sites/{slug}` via a 60s in-memory cache → `/api/internal/resolve-domain` lookup. Cache has no explicit invalidation in v1; worst case is 60s of 404 after attaching a new domain.

## Out of scope (v1)

- Transfer-out to user's own registrar account.
- TLDs beyond `.com / .net / .org / .xyz`.
- `.et` ccTLD (not on Porkbun).
- Domain forwarding / email forwarding.
- Multiple custom domains on one site.
