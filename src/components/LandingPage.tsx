import Link from "next/link";

const TEMPLATE_HIGHLIGHTS: ReadonlyArray<readonly [string, string]> = [
  ["Fine Dining", "01"],
  ["Casual Café", "02"],
  ["Hotel & Stay", "03"],
  ["Habesha Spa", "04"],
  ["Enat Studio", "05"],
  ["Lulit Salon", "06"],
];

const STEPS: ReadonlyArray<{ n: string; t: string; d: string }> = [
  {
    n: "01",
    t: "Pick a template",
    d: "11 templates designed for restaurants, cafés, hotels, spas, salons and photographers.",
  },
  {
    n: "02",
    t: "Make it yours",
    d: "Edit text, swap photos, change colors. No code. The builder is your canvas.",
  },
  {
    n: "03",
    t: "Publish & share",
    d: "Get a clean URL you can share on Telegram, Instagram, or print on a card.",
  },
];

function Wordmark({ size = "text-[22px]" }: { size?: string }) {
  return (
    <span className={`font-sans font-bold tracking-[-0.01em] text-ink ${size}`}>
      Fetan<span className="text-brand">Sites</span>
    </span>
  );
}

function TextileEdge() {
  return (
    <svg
      width="100%"
      height="14"
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      className="block opacity-45"
      aria-hidden
    >
      <defs>
        <pattern id="textile-edge" width="20" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 7 L10 0 L20 7 L10 14 Z" fill="none" stroke="#1f6b3a" strokeWidth="1" />
          <circle cx="10" cy="7" r="1.2" fill="#1f6b3a" />
        </pattern>
      </defs>
      <rect width="200" height="14" fill="url(#textile-edge)" />
    </svg>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-cream font-sans text-ink">
      {/* Top nav */}
      <nav className="flex items-center justify-between border-b border-soft-border px-14 py-5">
        <Wordmark />
        <div className="flex gap-8 text-sm text-muted-ink">
          <Link href="#templates" className="text-muted-ink no-underline">
            Templates
          </Link>
          <Link href="#how-it-works" className="text-muted-ink no-underline">
            How it works
          </Link>
          <Link href="#pricing" className="text-muted-ink no-underline">
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm text-ink no-underline">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="whitespace-nowrap rounded-[10px] bg-brand px-4 py-[9px] text-sm font-semibold text-white no-underline hover:bg-brand-soft"
          >
            Create your site
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-14 pt-[120px] pb-20">
        <div className="mx-auto grid max-w-[1100px] grid-cols-[1fr_360px] items-start gap-20">
          <div>
            <div className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              · Issue 01 · Hospitality on the web
            </div>
            <h1 className="mb-8 font-serif text-[96px] font-normal leading-[0.98] tracking-[-0.025em] text-ink [text-wrap:balance]">
              Your business deserves a{" "}
              <em className="font-light italic text-brand">beautiful</em> website.
            </h1>
            <p className="mb-10 max-w-[540px] text-[19px] leading-[1.6] text-muted-ink">
              Beautiful websites for Ethiopian restaurants, cafés, and hotels — no code, ready in minutes.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/sign-up"
                className="rounded bg-brand px-7 py-4 text-[15px] font-semibold tracking-[0.01em] text-white no-underline hover:bg-brand-soft"
              >
                Create your site
              </Link>
              <Link
                href="#templates"
                className="border-b border-ink pb-0.5 text-[15px] font-medium text-ink no-underline"
              >
                See templates →
              </Link>
            </div>
          </div>

          {/* Editorial side-card */}
          <aside className="border border-soft-border bg-white p-8">
            <TextileEdge />
            <div className="mt-6 mb-4 text-xs uppercase tracking-[0.15em] text-muted-ink">
              In this template set
            </div>
            <ul className="m-0 list-none p-0 font-serif text-[22px] leading-[1.6] text-ink">
              {TEMPLATE_HIGHLIGHTS.map(([name, n]) => (
                <li
                  key={n}
                  className="flex items-baseline justify-between border-b border-dashed border-soft-border py-1.5"
                >
                  <span>{name}</span>
                  <span className="font-sans text-xs tracking-[0.1em] text-muted-ink">{n}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 font-sans text-[13px] text-muted-ink">+ 5 more</div>
          </aside>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-soft-border bg-white px-14 py-24 font-sans"
      >
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
            The method
          </div>
          <h2 className="mb-16 max-w-[720px] font-serif text-[44px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            From idea to live site in three steps.
          </h2>
          <div className="grid grid-cols-3 gap-12">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="font-serif text-[88px] font-semibold leading-none tracking-[-0.04em] text-brand">
                  {s.n}
                </div>
                <h3 className="mt-6 mb-2.5 font-serif text-[22px] font-semibold tracking-[-0.01em] text-ink">
                  {s.t}
                </h3>
                <p className="max-w-[320px] text-[15px] leading-[1.6] text-muted-ink">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t border-soft-border px-14 py-8 font-sans text-[13px] text-muted-ink">
        <div className="flex items-center gap-4">
          <Wordmark size="text-base" />
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6">
          <Link href="#privacy" className="text-muted-ink no-underline">
            Privacy
          </Link>
          <Link href="#terms" className="text-muted-ink no-underline">
            Terms
          </Link>
          <Link href="#contact" className="text-muted-ink no-underline">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}
