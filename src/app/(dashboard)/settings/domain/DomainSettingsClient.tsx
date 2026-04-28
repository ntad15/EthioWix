"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type SearchHit = {
  name: string;
  tld: string;
  available: boolean;
  premium: boolean;
  priceBirr: number;
};

type Tab = "buy" | "byo";

type SiteSummary = { id: string; name: string; slug: string };

export default function DomainSettingsClient() {
  return (
    <Suspense
      fallback={
        <div className="mt-8 flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      }
    >
      <DomainSettingsInner />
    </Suspense>
  );
}

function DomainSettingsInner() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get("siteId");
  const orderId = searchParams.get("order");
  const [tab, setTab] = useState<Tab>("buy");
  const [site, setSite] = useState<SiteSummary | null>(null);
  const [siteError, setSiteError] = useState<string | null>(null);

  useEffect(() => {
    if (!siteId) return;
    fetch(`/api/sites?id=${siteId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.error) setSiteError(data.error);
        else if (data?.id) setSite({ id: data.id, name: data.name, slug: data.slug });
      })
      .catch(() => setSiteError("Could not load site"));
  }, [siteId]);

  if (!siteId && !orderId) {
    return (
      <div className="mt-8 rounded-lg border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
        <p className="font-medium">Pick a site first.</p>
        <p className="mt-1">
          A domain attaches to a specific site. Open a site from the dashboard and click{" "}
          <em>Domain</em>.
        </p>
        <Link
          href="/"
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-900 underline"
        >
          <ArrowLeft size={12} /> Back to dashboard
        </Link>
      </div>
    );
  }

  if (!siteId && orderId) {
    return (
      <div className="mt-2">
        <OrderStatusBanner orderId={orderId} />
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-muted-ink underline"
        >
          <ArrowLeft size={12} /> Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm">
        {site ? (
          <span>
            Connecting a domain to <strong>{site.name}</strong>{" "}
            <span className="text-muted-ink">({site.slug}.fetansites.com)</span>
          </span>
        ) : siteError ? (
          <span className="text-red-600">{siteError}</span>
        ) : (
          <span className="text-muted-ink">Loading site…</span>
        )}
      </div>

      {orderId && <OrderStatusBanner orderId={orderId} />}

      <DomainActivity siteId={siteId!} />

      <div className="mt-6 flex gap-2 border-b border-ink/10">
        <TabBtn active={tab === "buy"} onClick={() => setTab("buy")}>
          Get a new domain
        </TabBtn>
        <TabBtn active={tab === "byo"} onClick={() => setTab("byo")}>
          I already own a domain
        </TabBtn>
      </div>
      <div className="mt-6">
        {tab === "buy" ? <BuyTab siteId={siteId!} /> : <ByoTab siteId={siteId!} />}
      </div>
    </div>
  );
}

type OrderState = {
  id: string;
  status: "PENDING_PAYMENT" | "PAID" | "REGISTERED" | "REFUNDED" | "FAILED";
  failureReason: string | null;
  domainName: string;
  priceBirr: number;
  domain: {
    id: string;
    name: string;
    status: "PENDING" | "ACTIVE" | "EXPIRED" | "FAILED";
    expiresAt: string | null;
  } | null;
};

function OrderStatusBanner({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    // Kick off finalize first — does verify+register server-side. Don't await; polling
    // below will see the result either way. This makes the webhook a safety net rather
    // than a single point of failure.
    fetch(`/api/domains/orders/${orderId}/finalize`, { method: "POST" }).catch(() => {});

    async function tick(attempt: number) {
      try {
        const res = await fetch(`/api/domains/orders/${orderId}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error ?? "Could not load order status");
          return;
        }
        setOrder(data);
        setPollCount(attempt);
        const terminal =
          data.status === "REGISTERED" ||
          data.status === "REFUNDED" ||
          data.status === "FAILED";
        if (!terminal && attempt < 30) {
          timer = setTimeout(() => tick(attempt + 1), 2000);
        }
      } catch {
        if (!cancelled) setError("Could not load order status");
      }
    }

    tick(0);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [orderId]);

  if (error) {
    return (
      <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900">
        <p className="font-medium">Could not load order status</p>
        <p className="mt-1 text-xs">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mt-4 rounded-lg border border-ink/10 bg-white p-4 text-sm text-muted-ink">
        Loading order status…
      </div>
    );
  }

  const stalled = pollCount >= 30 && (order.status === "PENDING_PAYMENT" || order.status === "PAID");

  if (order.status === "REGISTERED") {
    return (
      <div className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 p-5 text-sm text-emerald-900">
        <p className="text-base font-semibold">🎉 Domain registered</p>
        <p className="mt-1">
          <strong>{order.domainName}</strong> is now connected to your site. DNS may take a few
          minutes to propagate worldwide.
        </p>
        {order.domain?.expiresAt && (
          <p className="mt-2 text-xs">
            Expires {new Date(order.domain.expiresAt).toLocaleDateString()} · auto-renews from your
            stored payment method.
          </p>
        )}
      </div>
    );
  }

  if (order.status === "REFUNDED") {
    return (
      <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
        <p className="text-base font-semibold">Refund issued</p>
        <p className="mt-1">
          We could not register <strong>{order.domainName}</strong> at the registry, so we refunded
          your payment of {order.priceBirr.toLocaleString()} ETB.
        </p>
        {order.failureReason && (
          <p className="mt-2 text-xs">
            <span className="font-medium">Reason:</span> {order.failureReason}
          </p>
        )}
        <p className="mt-2 text-xs">
          The refund usually appears within 1-3 business days. You can try a different domain
          below.
        </p>
      </div>
    );
  }

  if (order.status === "FAILED") {
    return (
      <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-5 text-sm text-red-900">
        <p className="text-base font-semibold">Something went wrong</p>
        <p className="mt-1">
          We couldn&apos;t register <strong>{order.domainName}</strong> and the automatic refund
          also failed. Please contact support — we&apos;ll resolve this manually.
        </p>
        {order.failureReason && (
          <p className="mt-2 text-xs">
            <span className="font-medium">Details:</span> {order.failureReason}
          </p>
        )}
      </div>
    );
  }

  if (order.status === "PAID") {
    return (
      <div className="mt-4 rounded-lg border border-blue-300 bg-blue-50 p-5 text-sm text-blue-900">
        <p className="font-semibold">
          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-blue-600" />
          Payment confirmed — registering domain…
        </p>
        <p className="mt-1 text-xs">
          We&apos;re reaching out to the registry to set up <strong>{order.domainName}</strong>.
          This usually takes 5-15 seconds.
        </p>
        {stalled && (
          <p className="mt-2 text-xs">
            Taking longer than expected. If this doesn&apos;t resolve in a minute, refresh the page
            or contact support with order ID <code>{order.id.slice(0, 8)}</code>.
          </p>
        )}
      </div>
    );
  }

  // PENDING_PAYMENT
  return (
    <div className="mt-4 rounded-lg border border-blue-300 bg-blue-50 p-5 text-sm text-blue-900">
      <p className="font-semibold">
        <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-blue-600" />
        Confirming your payment with Chapa…
      </p>
      <p className="mt-1 text-xs">
        Chapa is finalizing the transaction. This usually takes a few seconds.
      </p>
      {stalled && (
        <p className="mt-2 text-xs">
          Still waiting after a minute. If you completed payment, contact support with order ID{" "}
          <code>{order.id.slice(0, 8)}</code>. If you cancelled, you can safely close this and try
          again.
        </p>
      )}
    </div>
  );
}

type ActivityDomain = {
  id: string;
  name: string;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "FAILED";
  source: "REGISTERED" | "EXTERNAL";
  registeredAt: string | null;
  expiresAt: string | null;
  autoRenew: boolean;
};

type ActivityOrder = {
  id: string;
  domainName: string;
  kind: "INITIAL" | "RENEWAL";
  status: "PENDING_PAYMENT" | "PAID" | "REGISTERED" | "REFUNDED" | "FAILED";
  priceBirr: number;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
};

type ActivityResponse = { domains: ActivityDomain[]; orders: ActivityOrder[] };

function DomainActivity({ siteId }: { siteId: string }) {
  const [data, setData] = useState<ActivityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function load() {
      try {
        const res = await fetch(`/api/domains/list?siteId=${siteId}`, { cache: "no-store" });
        const body = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(body.error ?? "Could not load activity");
          return;
        }
        setError(null);
        setData(body);
        const hasInProgress = (body.orders as ActivityOrder[]).some(
          (o) => o.status === "PENDING_PAYMENT" || o.status === "PAID"
        );
        const hasPending = (body.domains as ActivityDomain[]).some((d) => d.status === "PENDING");
        const interval = hasInProgress || hasPending ? 5000 : 30000;
        timer = setTimeout(load, interval);
      } catch {
        if (!cancelled) setError("Could not load activity");
      }
    }

    load();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [siteId]);

  if (error) {
    return (
      <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-900">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-4 rounded-lg border border-ink/10 bg-white p-3 text-xs text-muted-ink">
        Loading domain activity…
      </div>
    );
  }

  if (data.domains.length === 0 && data.orders.length === 0) return null;

  return (
    <div className="mt-4 rounded-lg border border-ink/10 bg-white">
      <div className="border-b border-ink/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-ink">
        Domain activity
      </div>
      <ul className="divide-y divide-ink/10">
        {data.domains.map((d) => (
          <DomainRow key={`d-${d.id}`} domain={d} />
        ))}
        {data.orders
          .filter((o) => o.status !== "REGISTERED")
          .map((o) => (
            <OrderRow key={`o-${o.id}`} order={o} />
          ))}
      </ul>
    </div>
  );
}

function DomainRow({ domain }: { domain: ActivityDomain }) {
  const label = domainLabel(domain);
  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
      <div className="min-w-0">
        <div className="truncate font-medium">{domain.name}</div>
        <div className="text-xs text-muted-ink">
          {domain.source === "REGISTERED" ? "Registered through FetanSites" : "External domain"}
          {domain.expiresAt && domain.status === "ACTIVE" && (
            <> · expires {new Date(domain.expiresAt).toLocaleDateString()}</>
          )}
          {domain.status === "ACTIVE" && (
            <> · auto-renew {domain.autoRenew ? "on" : "off"}</>
          )}
        </div>
      </div>
      <StatusPill tone={label.tone}>{label.text}</StatusPill>
    </li>
  );
}

function OrderRow({ order }: { order: ActivityOrder }) {
  const label = orderLabel(order);
  return (
    <li className="px-4 py-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-medium">{order.domainName}</div>
          <div className="text-xs text-muted-ink">
            {order.kind === "RENEWAL" ? "Renewal" : "New domain"} ·{" "}
            {order.priceBirr.toLocaleString()} ETB · {timeAgo(order.createdAt)}
          </div>
        </div>
        <StatusPill tone={label.tone}>{label.text}</StatusPill>
      </div>
      {label.detail && (
        <p className="mt-2 text-xs text-muted-ink">{label.detail}</p>
      )}
      {order.failureReason && (order.status === "FAILED" || order.status === "REFUNDED") && (
        <p className="mt-1 text-xs text-muted-ink">
          <span className="font-medium">Reason:</span> {order.failureReason}
        </p>
      )}
    </li>
  );
}

type Tone = "green" | "blue" | "amber" | "red" | "gray";

function StatusPill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const cls: Record<Tone, string> = {
    green: "bg-emerald-100 text-emerald-900",
    blue: "bg-blue-100 text-blue-900",
    amber: "bg-amber-100 text-amber-900",
    red: "bg-red-100 text-red-900",
    gray: "bg-ink/10 text-ink",
  };
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${cls[tone]}`}
    >
      {children}
    </span>
  );
}

function domainLabel(d: ActivityDomain): { text: string; tone: Tone } {
  if (d.status === "ACTIVE") return { text: "Active", tone: "green" };
  if (d.status === "PENDING") return { text: "Setting up", tone: "blue" };
  if (d.status === "EXPIRED") return { text: "Expired", tone: "amber" };
  return { text: "Failed", tone: "red" };
}

function orderLabel(o: ActivityOrder): { text: string; tone: Tone; detail?: string } {
  switch (o.status) {
    case "PENDING_PAYMENT":
      return {
        text: "Awaiting payment",
        tone: "blue",
        detail: "Waiting for Chapa to confirm your payment.",
      };
    case "PAID":
      return {
        text: "Registering",
        tone: "blue",
        detail: "Payment confirmed. Setting up the domain at the registry.",
      };
    case "REGISTERED":
      return { text: "Done", tone: "green" };
    case "REFUNDED":
      return {
        text: "Refunded",
        tone: "amber",
        detail: "We could not register this domain, so we refunded your payment.",
      };
    case "FAILED":
      return {
        text: "Couldn't be set up",
        tone: "red",
        detail:
          "We could not register this domain and the automatic refund did not go through. Please contact support and we'll resolve it.",
      };
  }
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const day = Math.floor(hr / 24);
  return `${day} day${day === 1 ? "" : "s"} ago`;
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium ${
        active ? "border-b-2 border-brand text-brand" : "text-muted-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function BuyTab({ siteId }: { siteId: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<SearchHit | null>(null);

  async function search() {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/domains/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setResults(data.results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="myshop"
          className="flex-1 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <button
          onClick={search}
          disabled={loading || !query.trim()}
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {results && (
        <ul className="mt-6 divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
          {results.map((r) => (
            <li key={r.name} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-muted-ink">
                  {r.available ? `${r.priceBirr.toLocaleString()} ETB / year` : "Taken"}
                  {r.premium && " · Premium (not supported)"}
                </div>
              </div>
              <button
                disabled={!r.available || r.premium}
                onClick={() => setConfirming(r)}
                className="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
              >
                Buy
              </button>
            </li>
          ))}
        </ul>
      )}
      {confirming && (
        <ConfirmModal
          hit={confirming}
          siteId={siteId}
          onClose={() => setConfirming(null)}
        />
      )}
    </div>
  );
}

function ConfirmModal({
  hit,
  siteId,
  onClose,
}: {
  hit: SearchHit;
  siteId: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/domains/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domainName: hit.name,
          siteId,
          ownerContact: { name, email, phone },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Purchase failed");
      window.location.href = data.checkoutUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Purchase failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg bg-white p-6">
        <h2 className="font-serif text-xl font-semibold">Confirm purchase</h2>
        <p className="mt-2 text-sm">
          You are about to register <strong>{hit.name}</strong> for{" "}
          <strong>{hit.priceBirr.toLocaleString()} ETB</strong> (1 year).
        </p>
        <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
          <strong>Important:</strong>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>FetanSites registers this domain on your behalf as the legal registrant.</li>
            <li>Domain registrations are non-refundable once accepted by the registry.</li>
            <li>ICANN locks new domains for 60 days against transfers.</li>
            <li>Transfer to your own registrar account is not available in v1.</li>
          </ul>
        </div>
        <div className="mt-4 grid gap-3">
          <input
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
          <input
            placeholder="Phone (e.g. +251911234567)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-md border border-ink/15 px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-md border border-ink/15 px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={buy}
            disabled={submitting || !name || !email || !phone}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {submitting ? "Redirecting…" : "Pay with Chapa"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ByoTab({ siteId }: { siteId: string }) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [domainId, setDomainId] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<{
    apexA: { type: string; name: string; value: string };
    wwwCname: { type: string; name: string; value: string };
    note: string;
  } | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function attach() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/domains/external", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainName: name, siteId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Attach failed");
      setDomainId(data.id);
      setInstructions(data.instructions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Attach failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function verify() {
    if (!domainId) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await fetch(`/api/domains/external/${domainId}/verify`);
      const data = await res.json();
      setVerifyResult(
        data.verified
          ? "Verified — your domain is now active."
          : `Not yet. Resolved: ${(data.resolved ?? []).join(", ") || "(none)"} — expected ${data.expected}.`
      );
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          placeholder="example.com"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <button
          onClick={attach}
          disabled={submitting || !name.trim()}
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? "Attaching…" : "Attach"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {instructions && (
        <div className="mt-6 rounded-lg border border-ink/10 bg-white p-5">
          <h3 className="font-serif text-lg font-semibold">DNS instructions</h3>
          <p className="mt-1 text-xs text-muted-ink">{instructions.note}</p>
          <table className="mt-4 w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-ink">
              <tr>
                <th className="pb-2">Type</th>
                <th className="pb-2">Name</th>
                <th className="pb-2">Value</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-t border-ink/10">
                <td className="py-2">{instructions.apexA.type}</td>
                <td className="py-2">{instructions.apexA.name}</td>
                <td className="py-2">{instructions.apexA.value}</td>
              </tr>
              <tr className="border-t border-ink/10">
                <td className="py-2">{instructions.wwwCname.type}</td>
                <td className="py-2">{instructions.wwwCname.name}</td>
                <td className="py-2">{instructions.wwwCname.value}</td>
              </tr>
            </tbody>
          </table>
          <button
            onClick={verify}
            disabled={verifying}
            className="mt-4 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {verifying ? "Checking…" : "Verify connection"}
          </button>
          {verifyResult && <p className="mt-3 text-sm">{verifyResult}</p>}
        </div>
      )}
    </div>
  );
}
