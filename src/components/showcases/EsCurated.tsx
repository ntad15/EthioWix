"use client";

import { Reveal } from "./motion";
import { EsCuratedData } from "./types";

const ink = "#0f0f0f";
const paper = "#fafafa";
const muted = "#6b6b6b";
const accent = "#b8865a";
const serif = "'DM Serif Display', 'Playfair Display', serif";
const sans = "'Geist', 'Inter', system-ui, sans-serif";

export function EsCurated({ data }: { data: EsCuratedData }) {
  return (
    <div style={{ background: paper, color: ink, fontFamily: sans }}>
      <style>{`
        .fs-enat-tile:hover .fs-enat-img { transform: scale(1.05); }
        .fs-enat-tile:hover .fs-enat-cap { opacity: 1; }
        @keyframes fs-kenburns3 { from { transform: scale(1.0); } to { transform: scale(1.06); } }
      `}</style>

      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "28px 56px",
          borderBottom: `1px solid #e8e8e8`,
        }}
      >
        <span style={{ fontFamily: serif, fontSize: 22, letterSpacing: "-0.01em" }}>
          {data.brand}
        </span>
        <div style={{ display: "flex", gap: 32, fontSize: 13, color: muted }}>
          <a style={{ color: muted, textDecoration: "none" }}>Work</a>
          <a style={{ color: muted, textDecoration: "none" }}>About</a>
          <a style={{ color: muted, textDecoration: "none" }}>Packages</a>
          <a style={{ color: ink, textDecoration: "none", fontWeight: 600 }}>
            Inquire
          </a>
        </div>
      </nav>

      <section style={{ padding: "80px 56px 80px" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 80,
            alignItems: "end",
            minHeight: 540,
          }}
        >
          <Reveal>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: muted,
                marginBottom: 32,
              }}
            >
              {data.heroEyebrow}
            </div>
            <h1
              style={{
                fontFamily: serif,
                fontSize: 96,
                lineHeight: 0.95,
                fontWeight: 400,
                letterSpacing: "-0.025em",
                margin: 0,
              }}
            >
              {data.heroLine1}
              <br />
              {data.heroLine2}
              <br />
              {data.heroLine3}
            </h1>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.7,
                color: muted,
                marginTop: 32,
                maxWidth: 440,
              }}
            >
              {data.heroBody}
            </p>
            <div style={{ display: "flex", gap: 24, alignItems: "center", marginTop: 32 }}>
              <a
                style={{
                  fontSize: 13,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: ink,
                  textDecoration: "none",
                  fontWeight: 600,
                  borderBottom: `1px solid ${ink}`,
                  paddingBottom: 4,
                }}
              >
                See portfolio ↓
              </a>
              <span style={{ width: 1, height: 16, background: "#ddd" }} />
              <a
                style={{
                  fontSize: 13,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: muted,
                  textDecoration: "none",
                }}
              >
                Inquire
              </a>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div style={{ aspectRatio: "3/4", overflow: "hidden", maxHeight: 540 }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${data.heroImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  animation: "fs-kenburns3 24s ease-in-out infinite alternate",
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: "80px 56px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 48,
              }}
            >
              <h2
                style={{
                  fontFamily: serif,
                  fontSize: 48,
                  fontWeight: 400,
                  letterSpacing: "-0.015em",
                }}
              >
                {data.worksHeading}
              </h2>
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: muted,
                }}
              >
                {data.worksNote}
              </span>
            </div>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gridAutoRows: "auto",
              gap: 16,
            }}
          >
            {data.works.map((w, i) => (
              <Reveal key={i} delay={i * 60} style={{ gridArea: w.area }}>
                <div
                  className="fs-enat-tile"
                  style={{
                    position: "relative",
                    height: w.h,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <div
                    className="fs-enat-img"
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url(${w.src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transition: "transform 1200ms cubic-bezier(.2,.7,.2,1)",
                    }}
                  />
                  <div
                    className="fs-enat-cap"
                    style={{
                      position: "absolute",
                      left: 16,
                      bottom: 16,
                      padding: "8px 12px",
                      background: "rgba(255,255,255,0.92)",
                      color: ink,
                      fontSize: 12,
                      fontWeight: 500,
                      opacity: 0,
                      transition: "opacity 300ms",
                      fontFamily: sans,
                    }}
                  >
                    {w.caption}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "120px 56px", borderTop: `1px solid #e8e8e8` }}>
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: 80,
          }}
        >
          <Reveal>
            <h2
              style={{
                fontFamily: serif,
                fontSize: 48,
                fontWeight: 400,
                letterSpacing: "-0.015em",
              }}
            >
              {data.packagesHeading}
            </h2>
            <p style={{ color: muted, fontSize: 14, lineHeight: 1.6, marginTop: 12 }}>
              {data.packagesNote}
            </p>
          </Reveal>
          <div>
            {data.packages.map((m, i) => (
              <Reveal key={i} delay={i * 80}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 32,
                    padding: "28px 0",
                    borderBottom: i < data.packages.length - 1 ? `1px solid #e8e8e8` : "none",
                    alignItems: "baseline",
                  }}
                >
                  <div>
                    <h3 style={{ fontFamily: serif, fontSize: 28, fontWeight: 400, marginBottom: 6 }}>
                      {m.n}
                    </h3>
                    <p style={{ color: muted, fontSize: 14 }}>{m.d}</p>
                  </div>
                  <div style={{ fontFamily: serif, fontSize: 24, color: accent }}>
                    {m.p}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 56px", background: "#f1ede5" }}>
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
          }}
        >
          <Reveal>
            <h2 style={{ fontFamily: serif, fontSize: 40, fontWeight: 400, marginBottom: 16 }}>
              Studio
            </h2>
            <p
              style={{
                fontFamily: serif,
                fontSize: 22,
                fontStyle: "italic",
                color: ink,
                marginBottom: 32,
              }}
            >
              {data.studioAddress}
            </p>
            {data.studioMeta.map(({ k, v }) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: `1px solid #d8d2c4`,
                  fontSize: 14,
                }}
              >
                <span
                  style={{
                    color: muted,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontSize: 12,
                  }}
                >
                  {k}
                </span>
                <span>{v}</span>
              </div>
            ))}
          </Reveal>
          <Reveal delay={120}>
            <h2 style={{ fontFamily: serif, fontSize: 40, fontWeight: 400, marginBottom: 16 }}>
              Inquire
            </h2>
            <p style={{ color: muted, marginBottom: 32, fontSize: 15, lineHeight: 1.7 }}>
              {data.inquireBody}
            </p>
            <p style={{ fontSize: 18, marginBottom: 4 }}>{data.phone}</p>
            <p style={{ fontSize: 18, marginBottom: 32 }}>{data.email}</p>
            <a
              style={{
                display: "inline-block",
                padding: "14px 28px",
                background: ink,
                color: paper,
                textDecoration: "none",
                fontSize: 13,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {data.inquireLabel}
            </a>
          </Reveal>
        </div>
      </section>

      <footer
        style={{
          padding: "32px 56px",
          fontSize: 12,
          color: muted,
          textAlign: "center",
          borderTop: `1px solid #e8e8e8`,
        }}
      >
        {data.brand} · © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
