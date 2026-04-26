import Link from "next/link";

const ACCENT = "#1f6b3a";
const INK = "#13161b";
const MUTED = "#5e6470";
const BORDER = "#e9e7e1";
const BG = "#faf9f5";

const sansFont = "var(--font-geist-sans), system-ui, sans-serif";
const serifFont = "var(--font-fraunces), 'Times New Roman', serif";

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

function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <span
      style={{
        fontFamily: sansFont,
        fontWeight: 700,
        color: INK,
        fontSize: size,
        letterSpacing: "-0.01em",
      }}
    >
      Fetan<span style={{ color: ACCENT }}>Sites</span>
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
      style={{ display: "block", opacity: 0.45 }}
      aria-hidden
    >
      <defs>
        <pattern id="textile-edge" width="20" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 7 L10 0 L20 7 L10 14 Z" fill="none" stroke={ACCENT} strokeWidth="1" />
          <circle cx="10" cy="7" r="1.2" fill={ACCENT} />
        </pattern>
      </defs>
      <rect width="200" height="14" fill="url(#textile-edge)" />
    </svg>
  );
}

export function LandingPage() {
  return (
    <div style={{ background: BG, color: INK, fontFamily: sansFont }} className="min-h-screen">
      {/* Top nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 56px",
          borderBottom: `1px solid ${BORDER}`,
          fontFamily: sansFont,
        }}
      >
        <Wordmark />
        <div style={{ display: "flex", gap: 32, fontSize: 14, color: MUTED }}>
          <Link href="#templates" style={{ color: MUTED, textDecoration: "none" }}>
            Templates
          </Link>
          <Link href="#how-it-works" style={{ color: MUTED, textDecoration: "none" }}>
            How it works
          </Link>
          <Link href="#pricing" style={{ color: MUTED, textDecoration: "none" }}>
            Pricing
          </Link>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/sign-in" style={{ fontSize: 14, color: INK, textDecoration: "none" }}>
            Sign in
          </Link>
          <Link
            href="/sign-up"
            style={{
              fontSize: 14,
              fontWeight: 600,
              padding: "9px 16px",
              background: ACCENT,
              color: "#fff",
              borderRadius: 10,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Create your site
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "120px 56px 80px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 80,
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: ACCENT,
                marginBottom: 24,
              }}
            >
              · Issue 01 · Hospitality on the web
            </div>
            <h1
              style={{
                fontFamily: serifFont,
                fontSize: 96,
                lineHeight: 0.98,
                fontWeight: 400,
                letterSpacing: "-0.025em",
                color: INK,
                marginBottom: 32,
                textWrap: "balance",
              }}
            >
              Your business deserves a{" "}
              <em
                style={{
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: ACCENT,
                }}
              >
                beautiful
              </em>{" "}
              website.
            </h1>
            <p
              style={{
                fontSize: 19,
                lineHeight: 1.6,
                color: MUTED,
                maxWidth: 540,
                marginBottom: 40,
              }}
            >
              Beautiful websites for Ethiopian restaurants, cafés, and hotels — no code, ready in minutes.
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Link
                href="/sign-up"
                style={{
                  padding: "16px 28px",
                  background: ACCENT,
                  color: "#fff",
                  borderRadius: 4,
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                }}
              >
                Create your site
              </Link>
              <Link
                href="#templates"
                style={{
                  fontSize: 15,
                  color: INK,
                  textDecoration: "none",
                  fontWeight: 500,
                  borderBottom: `1px solid ${INK}`,
                  paddingBottom: 2,
                }}
              >
                See templates →
              </Link>
            </div>
          </div>

          {/* Editorial side-card */}
          <aside
            style={{
              border: `1px solid ${BORDER}`,
              background: "#ffffff",
              padding: 32,
            }}
          >
            <TextileEdge />
            <div
              style={{
                marginTop: 24,
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: MUTED,
                marginBottom: 16,
              }}
            >
              In this template set
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontFamily: serifFont,
                fontSize: 22,
                lineHeight: 1.6,
                color: INK,
              }}
            >
              {TEMPLATE_HIGHLIGHTS.map(([name, n]) => (
                <li
                  key={n}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    padding: "6px 0",
                    borderBottom: `1px dashed ${BORDER}`,
                  }}
                >
                  <span>{name}</span>
                  <span
                    style={{
                      fontFamily: sansFont,
                      fontSize: 12,
                      color: MUTED,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {n}
                  </span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 16, fontFamily: sansFont, fontSize: 13, color: MUTED }}>
              + 5 more
            </div>
          </aside>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        style={{
          padding: "96px 56px",
          background: "#ffffff",
          fontFamily: sansFont,
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: ACCENT,
              marginBottom: 16,
            }}
          >
            The method
          </div>
          <h2
            style={{
              fontFamily: serifFont,
              fontSize: 44,
              lineHeight: 1.1,
              color: INK,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              maxWidth: 720,
              marginBottom: 64,
            }}
          >
            From idea to live site in three steps.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 48,
            }}
          >
            {STEPS.map((s) => (
              <div key={s.n}>
                <div
                  style={{
                    fontFamily: serifFont,
                    fontSize: 88,
                    lineHeight: 1,
                    color: ACCENT,
                    fontWeight: 600,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {s.n}
                </div>
                <h3
                  style={{
                    fontFamily: serifFont,
                    fontSize: 22,
                    fontWeight: 600,
                    color: INK,
                    marginTop: 24,
                    marginBottom: 10,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.t}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: MUTED, maxWidth: 320 }}>
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "32px 56px",
          borderTop: `1px solid ${BORDER}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: sansFont,
          fontSize: 13,
          color: MUTED,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Wordmark size={16} />
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <Link href="#privacy" style={{ color: MUTED, textDecoration: "none" }}>
            Privacy
          </Link>
          <Link href="#terms" style={{ color: MUTED, textDecoration: "none" }}>
            Terms
          </Link>
          <Link href="#contact" style={{ color: MUTED, textDecoration: "none" }}>
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}
