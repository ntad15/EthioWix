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

  if (!siteId) {
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

      <div className="mt-6 flex gap-2 border-b border-ink/10">
        <TabBtn active={tab === "buy"} onClick={() => setTab("buy")}>
          Get a new domain
        </TabBtn>
        <TabBtn active={tab === "byo"} onClick={() => setTab("byo")}>
          I already own a domain
        </TabBtn>
      </div>
      <div className="mt-6">
        {tab === "buy" ? <BuyTab siteId={siteId} /> : <ByoTab siteId={siteId} />}
      </div>
    </div>
  );
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
