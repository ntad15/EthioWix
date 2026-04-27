# Domain Registrar Integration (v1)

## Context

EthioWix today only supports `<slug>.fetansites.com` subdomains via Caddy on-demand TLS + a middleware rewrite ([src/middleware.ts](src/middleware.ts)). Site owners can't yet use a real custom domain.

Goal: let a user click "Get a domain" inside their dashboard, pay in **birr via Chapa**, and have FetanSites register the domain via the **Porkbun API** under FetanSites' own registrant contact, then automatically wire it to the user's site. The user is purely a tenant — they never touch the registrar. A secondary lightweight path lets users who **already own a domain elsewhere** point it at FetanSites with copy-paste DNS instructions.

Scope decisions (confirmed with user):
- **Registrar**: Porkbun (instant API, ~580 TLDs, free WHOIS privacy).
- **TLDs in v1**: `.com`, `.net`, `.org`.
- **Pricing**: flat birr per TLD, hardcoded table re-evaluated quarterly. FetanSites eats FX risk.
- **Renewals**: auto-renew via stored Chapa token; dunning on failure.
- **Ownership**: FetanSites is legal registrant; user has contractual right of use while subscription is active. Transfer-out to user's own name is **not** in v1 but the data model should not preclude it.

## Things the user should be aware of (risks / policy decisions)

1. **Chapa tokenization** — auto-renew requires Chapa's Direct Charge / tokenization product. Confirm it's available on the user's Chapa account before committing to auto-renew. If it's not, fall back to "manual yearly invoice" mode without changing the schema.
2. **Failure-after-charge** — if Chapa succeeds but Porkbun's `domain/create` fails (out-of-stock TLD, name collision in the milliseconds between check + buy, API outage), code MUST refund automatically. This is the single biggest correctness risk; design the purchase flow as a state machine with a `pendingRegistration` state, not an inline RPC chain.
3. **Domain freeze** — ICANN locks newly-registered domains for 60 days against transfers. Surface this in the confirmation modal so users don't expect to move out immediately.
4. **Renewal grace + redemption** — if auto-renew fails repeatedly, domain expires, then enters ICANN's 30-day redemption period (~$80 USD recovery fee from Porkbun). v1 policy: 3 retry attempts over 14 days, then notify user that domain will lapse; do NOT pay redemption on user's behalf without explicit re-payment.
5. **WHOIS contact** — Porkbun requires a real registrant contact. Use FetanSites' company contact + privacy enabled by default. Store the user's name/email/phone separately as the *beneficial* owner (needed for any future transfer-out flow).
6. **Caddy on-demand TLS for custom domains** — Caddy already calls [/api/internal/check-domain](src/app/api/internal/) before issuing a cert. That endpoint must be extended to also accept arbitrary custom domains that resolve to a known site, otherwise certs won't issue.
7. **Refund policy** — domain registrations are NOT refundable from the registrar once the registry has accepted them. ToS must say so explicitly; show in the purchase modal.
8. **`.et` is out of scope** — ETC's registry is not on Porkbun. Plan UI text accordingly (don't promise it).

## Architecture

```
[Dashboard UI]
   │
   ├─ Search domain ──────► POST /api/domains/search ──► Porkbun /pricing + /checkDomain
   │
   ├─ Buy domain ─────────► POST /api/domains/purchase
   │                          1. create DomainOrder(status=PENDING_PAYMENT)
   │                          2. init Chapa transaction → return checkout URL
   │
   │      [Chapa redirects user back]
   │
   └─ Chapa webhook ──────► POST /api/webhooks/chapa
                              1. verify signature
                              2. mark DomainOrder PAID
                              3. enqueue registerDomainJob
                                   ├─ call Porkbun /domain/create
                                   ├─ on success: create Domain row, set DNS to point at fetansites apex
                                   └─ on failure: refund via Chapa, mark FAILED, notify user

[Caddy] ──► GET /api/internal/check-domain?domain=foo.com
              checks Domain table (status=ACTIVE) → 200/404
[Middleware] ──► resolves request host:
              1. *.fetansites.com → existing slug rewrite
              2. else → look up Domain table → rewrite to /sites/{slug}
```

## Data model (Prisma, [prisma/schema.prisma](prisma/schema.prisma))

Add three models. Keep `Site` untouched except for back-relation.

```prisma
model Domain {
  id              String         @id @default(cuid())
  name            String         @unique          // e.g. "myshop.com" (lowercased, no protocol)
  tld             String                          // "com" | "net" | "org"
  siteId          String?
  site            Site?          @relation(fields: [siteId], references: [id])
  userId          String                          // beneficial owner
  user            User           @relation(fields: [userId], references: [id])
  source          DomainSource                    // REGISTERED | EXTERNAL
  status          DomainStatus                    // PENDING | ACTIVE | EXPIRED | FAILED
  registeredAt    DateTime?
  expiresAt       DateTime?
  autoRenew       Boolean        @default(true)
  porkbunOrderId  String?                         // for EXTERNAL: null
  // beneficial-owner contact captured at purchase (for future transfer-out)
  ownerName       String?
  ownerEmail      String?
  ownerPhone      String?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  orders          DomainOrder[]

  @@index([siteId])
  @@index([userId])
}

enum DomainSource { REGISTERED EXTERNAL }
enum DomainStatus { PENDING ACTIVE EXPIRED FAILED }

model DomainOrder {
  id             String       @id @default(cuid())
  domainId       String?
  domain         Domain?      @relation(fields: [domainId], references: [id])
  userId         String
  user           User         @relation(fields: [userId], references: [id])
  domainName     String                         // captured at order time (Domain may not exist yet)
  tld            String
  priceBirr      Int                            // store as integer cents-of-birr
  years          Int          @default(1)
  kind           OrderKind                      // INITIAL | RENEWAL
  status         OrderStatus                    // PENDING_PAYMENT | PAID | REGISTERED | REFUNDED | FAILED
  chapaTxRef     String       @unique
  chapaChargeId  String?                        // tokenized recurring id (for renewals)
  failureReason  String?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

enum OrderKind   { INITIAL RENEWAL }
enum OrderStatus { PENDING_PAYMENT PAID REGISTERED REFUNDED FAILED }

model PaymentMethod {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  chapaCustomerId String                         // tokenized customer / card ref
  cardLast4       String?
  createdAt       DateTime @default(now())
}
```

Add to existing `Site` model: `domains Domain[]` back-relation.
Add to existing `User` model: `domains Domain[]`, `domainOrders DomainOrder[]`, `paymentMethod PaymentMethod?`.

## New files

### Registrar client
- [src/lib/registrar/porkbun.ts](src/lib/registrar/porkbun.ts) — typed wrapper over Porkbun's REST API (`/pricing/get`, `/domain/checkDomain/{name}`, `/domain/create`, `/domain/renew`, `/dns/createOrEdit`). All calls take `apiKey` + `secretApiKey` from env. Map errors to a discriminated union (`{ ok: true, data } | { ok: false, code, message }`); never throw.
- [src/lib/registrar/types.ts](src/lib/registrar/types.ts) — shared types.

### Pricing
- [src/lib/domains/pricing.ts](src/lib/domains/pricing.ts) — exports `BIRR_PRICING: Record<Tld, number>` and `getPriceBirr(tld)`. Single source of truth, easy to bump quarterly.

### Payment
- [src/lib/payments/chapa.ts](src/lib/payments/chapa.ts) — wrapper for `initialize`, `verify`, `chargeToken` (tokenized recurring), `refund`. Webhook signature verification helper.

### API routes (Next.js 16 App Router; follow pattern in [src/app/api/sites/route.ts](src/app/api/sites/route.ts) — use `getAuthUserId()` from [src/lib/supabase](src/lib/supabase))
- `src/app/api/domains/search/route.ts` — `POST { query }` → returns `[{ name, tld, available, priceBirr }]`. Calls Porkbun `checkDomain` for the requested TLD only when the second-level label is well-formed.
- `src/app/api/domains/purchase/route.ts` — `POST { domainName, tld, siteId, ownerContact }` → creates `DomainOrder(PENDING_PAYMENT)`, initializes Chapa transaction, returns `{ checkoutUrl, txRef }`.
- `src/app/api/domains/external/route.ts` — `POST { domainName, siteId }` → creates `Domain(source=EXTERNAL, status=PENDING)`, returns DNS instructions payload (A record IP + verification token if we want CNAME-based ownership proof). `GET /api/domains/external/[id]/verify` polls DNS resolution and flips to ACTIVE when it sees the expected record.
- `src/app/api/domains/[id]/route.ts` — `GET` (owner only), `PATCH { autoRenew }`, `DELETE` (cancels auto-renew; does not delete from registrar).
- `src/app/api/webhooks/chapa/route.ts` — verifies signature, on `charge.success` advances `DomainOrder` to `PAID` and enqueues registration job.

### Internal endpoint extension
- Edit existing [src/app/api/internal/check-domain/route.ts](src/app/api/internal/check-domain/route.ts) — when host is not a `*.fetansites.com` subdomain, also look up `Domain` table for an `ACTIVE` record matching the host, return 200 if found. Caddy already calls this for ALL hosts before issuing certs.

### Middleware
- Edit [src/middleware.ts](src/middleware.ts) — after the existing subdomain branch, add a custom-domain branch: if host doesn't match `*.{DOMAIN}`, look up `Domain` table (cached, see below) and rewrite to `/sites/{site.slug}`. Use a short-TTL in-memory LRU keyed by host (middleware runs on every request — must not hit DB each time). Cache miss → DB lookup; cache invalidated when Domain row changes (call a small revalidation API from mutation routes). Acceptable v1: 60s TTL, no explicit invalidation (worst case: 60s of 404 after attaching).

### Background job
- [src/lib/jobs/registerDomain.ts](src/lib/jobs/registerDomain.ts) — given a paid `DomainOrder`, calls Porkbun create → on success creates/updates `Domain(ACTIVE)`, sets DNS A records pointing at the FetanSites edge IP, sends confirmation email. On failure, calls Chapa refund, marks order `FAILED`, emails user. Idempotent (retry-safe via `chapaTxRef`).
- v1 runner: simplest is invoking it inline from the webhook handler with try/catch; if registration fails, refund inline. No queue infrastructure yet — acceptable because Porkbun calls are fast and the webhook can be retried by Chapa on 5xx.

### Renewal cron
- [src/app/api/cron/renew-domains/route.ts](src/app/api/cron/renew-domains/route.ts) — protected by a shared secret header. Picks domains expiring in 30 days with `autoRenew=true`, calls Chapa `chargeToken` against the user's stored `PaymentMethod`, on success calls Porkbun `/domain/renew`. On failure: retry schedule (3 attempts over 14 days), then mark order `FAILED` and email user. Triggered daily by an external cron (Vercel cron, or a `docker-compose` cron container — to be decided when we ship).

### Dashboard UI
- New: `src/app/(dashboard)/settings/page.tsx` — top-level settings page (does not exist yet per exploration). Contains a "Domain" section.
- New: `src/app/(dashboard)/settings/domain/page.tsx` — main domain UI. Shows current connected domain (if any) and two CTAs:
  1. **"Get a new domain"** → search modal → results list → confirmation modal with bold warnings ("FetanSites will register this domain on your behalf. Domains are non-refundable. You won't be able to transfer it to another registrar in v1.") → Chapa redirect.
  2. **"I already own a domain"** → form for the domain name → instructions screen showing exact A record and CNAME values, with a "Verify connection" button that polls `/verify`.
- Reuse styling/components from existing dashboard pages (builder, analytics, media in [src/app/(dashboard)](src/app/(dashboard))).

### Env vars (extend [.env.example](.env.example))
```
PORKBUN_API_KEY=
PORKBUN_SECRET_API_KEY=
CHAPA_SECRET_KEY=
CHAPA_PUBLIC_KEY=
CHAPA_WEBHOOK_SECRET=
FETANSITES_EDGE_IP=         # the public IP custom domains should A-record to
DOMAIN_CRON_SECRET=         # protects /api/cron/renew-domains
REGISTRANT_NAME="FetanSites"
REGISTRANT_EMAIL=
REGISTRANT_PHONE=
REGISTRANT_ADDRESS=...
```

## Build order

1. Schema + migration (Domain, DomainOrder, PaymentMethod, enums).
2. Porkbun client + pricing table + a unit-test-style script (`pnpm tsx scripts/porkbun-smoke.ts`) that hits a real test domain in their sandbox.
3. Chapa client + webhook signature verification + sandbox smoke script.
4. `/api/domains/search` + dashboard search UI (no payment yet — purely read-only).
5. `/api/domains/purchase` + Chapa init + webhook + register job (happy path end-to-end in sandbox).
6. Failure path: simulate Porkbun create failure, verify Chapa refund fires.
7. Caddy `/check-domain` extension + middleware custom-domain branch + LRU cache.
8. External-domain (BYO) flow: form → instructions → DNS verify polling.
9. Renewal cron + Chapa tokenized charge + dunning emails.
10. ToS / policy copy in confirmation modal + a static `/legal/domains` page.

## Verification (end-to-end)

- **Search**: dashboard → settings → domain → search "myteststore" → see `.com/.net/.org` availability + birr prices.
- **Purchase happy path** (Chapa sandbox + Porkbun test API): click Buy → redirected to Chapa sandbox → complete payment → returned to dashboard → within ~10s domain shows status `ACTIVE` → visiting `https://myteststore.com` resolves to the site (after DNS propagation; for local testing, point a real test domain or fake host).
- **Purchase failure path**: stub Porkbun client to return error → confirm Chapa refund issued, `DomainOrder.status=REFUNDED`, user email sent, no orphan `Domain` row.
- **External domain**: enter `example.com`, get instructions, set local `/etc/hosts` to FetanSites edge IP, click Verify → status flips to ACTIVE; request to `example.com` rewrites to the right site (verify Caddy `/check-domain` returns 200, middleware logs show rewrite).
- **Renewal**: manually invoke `/api/cron/renew-domains` with secret; for a domain expiring in 30 days, confirm Chapa `chargeToken` is called and Porkbun `/domain/renew` extends `expiresAt`.
- **Renewal failure**: revoke Chapa token → run cron → confirm 3 retries over 14 days (simulate via clock), then `FAILED` + email.
- **Type check + build**: `pnpm tsc --noEmit && pnpm build` clean.

## Out of scope for v1 (call out in the UI/ToS)

- Transfer-out to user's own registrar account.
- TLDs beyond `.com/.net/.org`.
- `.et` ccTLD.
- Domain forwarding / email-forwarding.
- Multiple domains pointing to one site (allow only the primary in v1).
