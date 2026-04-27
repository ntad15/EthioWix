"use client";

import { HoverLift, Marquee, Reveal } from "./motion";
import { HsRitualData } from "./types";

const earth = "#5a3a2e";
const cream = "#f6efe4";
const sand = "#e8c9a0";
const clay = "#b5643c";
const ink = "#2b1f18";
const muted = "#7a6555";
const serif = "'Cormorant Garamond', 'Times New Roman', serif";
const sans = "'Nunito Sans', system-ui, sans-serif";

export function HsRitual({ data }: { data: HsRitualData }) {
  return (
    <div className="hs-root" style={{ background: cream, color: ink, fontFamily: sans, overflowX: "hidden" }}>
      <style>{`
        @media (max-width: 768px) {
          .hs-root .hs-nav { padding: 14px 18px !important; }
          .hs-root .hs-nav-links { display: none !important; }
          .hs-root .hs-pad { padding-left: 18px !important; padding-right: 18px !important; padding-top: 56px !important; padding-bottom: 56px !important; }
          .hs-root .hs-grid-2 { grid-template-columns: 1fr !important; gap: 32px !important; }
          .hs-root .hs-grid-3 { grid-template-columns: 1fr !important; gap: 16px !important; }
          .hs-root .hs-h1 { font-size: 56px !important; line-height: 1 !important; }
          .hs-root .hs-h2 { font-size: 32px !important; }
          .hs-root .hs-h3 { font-size: 28px !important; }
          .hs-root .hs-step { grid-template-columns: 1fr !important; gap: 24px !important; margin-bottom: 40px !important; }
          .hs-root .hs-step > * { order: 0 !important; }
          .hs-root .hs-step-num { font-size: 64px !important; }
          .hs-root .hs-section-head { flex-direction: column !important; align-items: flex-start !important; gap: 6px !important; }
          .hs-root .hs-reserve-card { padding: 28px !important; }
          .hs-root .hs-footer { padding: 24px 18px !important; }
        }
      `}</style>
      <nav
        className="hs-nav"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 48px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(246,239,228,0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span
          style={{
            fontFamily: serif,
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          {data.brand}
        </span>
        <div className="hs-nav-links" style={{ display: "flex", gap: 32, fontSize: 13, color: muted }}>
          <a style={{ color: muted, textDecoration: "none" }}>The Ritual</a>
          <a style={{ color: muted, textDecoration: "none" }}>Treatments</a>
          <a style={{ color: muted, textDecoration: "none" }}>The Space</a>
          <a style={{ color: clay, textDecoration: "none", fontWeight: 700 }}>
            Reserve
          </a>
        </div>
      </nav>

      <section className="hs-pad" style={{ padding: "60px 48px 100px" }}>
        <div
          className="hs-grid-2"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          <Reveal>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: clay,
                marginBottom: 28,
              }}
            >
              · {data.brand} · {data.location}
            </div>
            <h1
              className="hs-h1"
              style={{
                fontFamily: serif,
                fontSize: 112,
                lineHeight: 0.95,
                fontWeight: 400,
                letterSpacing: "-0.02em",
                margin: 0,
                color: earth,
              }}
            >
              {data.heroLine1}
              <br />
              <em style={{ fontStyle: "italic", color: clay }}>
                {data.heroLine2Italic}
              </em>
              <br />
              {data.heroLine3}
            </h1>
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: muted,
                marginTop: 32,
                maxWidth: 440,
              }}
            >
              {data.heroBody}
            </p>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 40 }}>
              <a
                style={{
                  padding: "14px 28px",
                  background: earth,
                  color: cream,
                  borderRadius: 999,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                Book a treatment
              </a>
              <a
                style={{
                  fontSize: 14,
                  color: earth,
                  textDecoration: "none",
                  fontWeight: 600,
                  borderBottom: `1px solid ${earth}`,
                  paddingBottom: 2,
                }}
              >
                Read the ritual ↓
              </a>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div
              style={{
                position: "relative",
                aspectRatio: "4/5",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <style>{`@keyframes fs-kenburns2 { from { transform: scale(1.04); } to { transform: scale(1.12) translate(-1%, -2%); } }`}</style>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${data.heroImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  animation: "fs-kenburns2 22s ease-in-out infinite alternate",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 20,
                  bottom: 20,
                  padding: "12px 16px",
                  background: "rgba(246,239,228,0.92)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: earth,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {data.heroBadge}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Marquee
        items={data.marquee}
        color={earth}
        bg={sand}
        font={sans}
        separator="✦"
      />

      <section className="hs-pad" style={{ padding: "120px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: clay,
                marginBottom: 16,
              }}
            >
              {data.ritualEyebrow}
            </div>
            <h2
              className="hs-h2"
              style={{
                fontFamily: serif,
                fontSize: 56,
                fontWeight: 400,
                marginBottom: 80,
                color: earth,
                maxWidth: 700,
                lineHeight: 1.05,
              }}
            >
              {data.ritualHeading}
            </h2>
          </Reveal>
          {data.ritualSteps.map((s, i) => (
            <Reveal key={i} delay={i * 100}>
              <div
                className="hs-step"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 64,
                  alignItems: "center",
                  marginBottom: 64,
                }}
              >
                <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                  <div
                    className="hs-step-num"
                    style={{
                      fontFamily: serif,
                      fontSize: 96,
                      color: sand,
                      lineHeight: 1,
                      fontWeight: 400,
                      marginBottom: 12,
                    }}
                  >
                    {s.n}
                  </div>
                  <h3
                    className="hs-h3"
                    style={{
                      fontFamily: serif,
                      fontSize: 40,
                      fontWeight: 400,
                      color: earth,
                      marginBottom: 16,
                    }}
                  >
                    {s.t}
                  </h3>
                  <p style={{ fontSize: 17, lineHeight: 1.7, color: muted, maxWidth: 440 }}>
                    {s.d}
                  </p>
                </div>
                <div
                  style={{
                    aspectRatio: "5/4",
                    borderRadius: 12,
                    backgroundImage: `url(${s.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="hs-pad" style={{ padding: "100px 48px", background: "#efe2cf" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div
              className="hs-section-head"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 56,
              }}
            >
              <h2 className="hs-h2" style={{ fontFamily: serif, fontSize: 48, fontWeight: 400, color: earth }}>
                {data.treatmentsHeading}
              </h2>
              <span style={{ fontSize: 13, color: muted }}>{data.treatmentsNote}</span>
            </div>
          </Reveal>
          <div className="hs-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            {data.treatments.map((t, i) => (
              <Reveal key={i} delay={i * 100}>
                <HoverLift style={{ background: cream, borderRadius: 14, overflow: "hidden" }}>
                  <div
                    style={{
                      aspectRatio: "4/3",
                      backgroundImage: `url(${t.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div style={{ padding: 28 }}>
                    <h3
                      style={{
                        fontFamily: serif,
                        fontSize: 26,
                        fontWeight: 500,
                        color: earth,
                        marginBottom: 8,
                      }}
                    >
                      {t.n}
                    </h3>
                    <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, marginBottom: 20 }}>
                      {t.d}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontFamily: serif, fontSize: 24, color: clay }}>
                        {t.p}
                      </span>
                      <a
                        style={{
                          fontSize: 13,
                          color: earth,
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        Reserve →
                      </a>
                    </div>
                  </div>
                </HoverLift>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="hs-pad" style={{ padding: "100px 48px" }}>
        <div
          className="hs-grid-2"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
          }}
        >
          <Reveal>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: clay,
                marginBottom: 16,
              }}
            >
              Visit
            </div>
            <h3
              className="hs-h3"
              style={{
                fontFamily: serif,
                fontSize: 44,
                fontWeight: 400,
                color: earth,
                marginBottom: 16,
              }}
            >
              {data.visitAddress}
            </h3>
            {data.hours.map(({ day, hours }) => (
              <div
                key={day}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "14px 0",
                  borderBottom: `1px solid #e3d6c0`,
                  fontSize: 15,
                }}
              >
                <span style={{ color: muted }}>{day}</span>
                <span style={{ color: earth, fontWeight: 600 }}>{hours}</span>
              </div>
            ))}
          </Reveal>
          <Reveal delay={120}>
            <div className="hs-reserve-card" style={{ background: earth, color: cream, padding: 48, borderRadius: 16 }}>
              <h3 className="hs-h3" style={{ fontFamily: serif, fontSize: 36, fontWeight: 400, marginBottom: 24 }}>
                {data.reserveHeading}
              </h3>
              <p style={{ marginBottom: 8, color: sand }}>{data.phone}</p>
              <p style={{ marginBottom: 32, color: sand }}>{data.email}</p>
              <a
                style={{
                  display: "inline-block",
                  padding: "14px 28px",
                  background: cream,
                  color: earth,
                  borderRadius: 999,
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {data.bookingLabel}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer
        className="hs-footer"
        style={{
          padding: "32px 48px",
          fontSize: 12,
          color: muted,
          textAlign: "center",
        }}
      >
        {data.brand} · {data.location} · © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
