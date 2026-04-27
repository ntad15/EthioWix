"use client";

import { HoverLift, Marquee, ParallaxBg, Reveal } from "./motion";
import { FdCinematicData } from "./types";

const ink = "#0f0f1a";
const cream = "#f5f1e6";
const gold = "#c9a96e";
const text = "#f5f5f5";
const muted = "#a8a395";
const serif = "'Playfair Display', 'Times New Roman', serif";
const sans = "'Lato', system-ui, sans-serif";

export function FdCinematic({ data }: { data: FdCinematicData }) {
  const titleWords = data.brand.split(" ");
  const monogram = data.brand
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <div className="fd-root" style={{ background: ink, color: text, fontFamily: sans, overflowX: "hidden" }}>
      <style>{`
        @media (max-width: 768px) {
          .fd-root .fd-nav { padding: 14px 18px !important; gap: 12px !important; }
          .fd-root .fd-nav-links { display: none !important; }
          .fd-root .fd-nav-cta { padding: 8px 14px !important; font-size: 11px !important; letter-spacing: 0.12em !important; }
          .fd-root .fd-hero { height: 560px !important; }
          .fd-root .fd-hero-inner { padding: 0 18px 56px !important; }
          .fd-root .fd-hero-h1 { font-size: 56px !important; line-height: 0.98 !important; }
          .fd-root .fd-hero-tagline { font-size: 18px !important; margin-top: 20px !important; }
          .fd-root .fd-pad { padding-left: 18px !important; padding-right: 18px !important; padding-top: 64px !important; padding-bottom: 64px !important; }
          .fd-root .fd-grid-2 { grid-template-columns: 1fr !important; gap: 32px !important; }
          .fd-root .fd-h2 { font-size: 36px !important; }
          .fd-root .fd-h3 { font-size: 28px !important; }
          .fd-root .fd-menu-row { grid-template-columns: 1fr !important; gap: 14px !important; padding: 24px 0 !important; }
          .fd-root .fd-menu-text { text-align: left !important; }
          .fd-root .fd-menu-img { aspect-ratio: 16/10 !important; width: 100% !important; }
          .fd-root .fd-menu-row-odd > .fd-menu-text { order: 2 !important; }
          .fd-root .fd-menu-row-odd > .fd-menu-img { order: 1 !important; }
          .fd-root .fd-menu-row-odd > .fd-price { order: 3 !important; }
          .fd-root .fd-gallery { grid-template-columns: 1fr 1fr !important; grid-template-rows: auto !important; gap: 8px !important; }
          .fd-root .fd-gallery > * { grid-area: auto !important; aspect-ratio: 4/3 !important; }
          .fd-root .fd-footer { padding: 24px 18px !important; }
        }
      `}</style>
      <div
        className="fd-nav"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 56px",
          background:
            "linear-gradient(180deg, rgba(15,15,26,0.95) 0%, rgba(15,15,26,0) 100%)",
        }}
      >
        <span style={{ fontFamily: serif, fontSize: 20, letterSpacing: "0.04em" }}>
          {monogram}
        </span>
        <div
          className="fd-nav-links"
          style={{
            display: "flex",
            gap: 32,
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: muted,
          }}
        >
          <a style={{ color: muted, textDecoration: "none" }}>Menu</a>
          <a style={{ color: muted, textDecoration: "none" }}>Story</a>
          <a style={{ color: muted, textDecoration: "none" }}>Visit</a>
        </div>
        <a
          href={data.bookingUrl}
          className="fd-nav-cta"
          style={{
            padding: "10px 20px",
            border: `1px solid ${gold}`,
            color: gold,
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Reserve
        </a>
      </div>

      <ParallaxBg src={data.heroImage} strength={0.16} style={{ height: 720, marginTop: -68 }} className="fd-hero">
        <div
          className="fd-hero-inner"
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 56px 80px",
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: gold,
              marginBottom: 24,
            }}
          >
            <Reveal y={12}>{data.heroEyebrow}</Reveal>
          </div>
          <h1
            className="fd-hero-h1"
            style={{
              fontFamily: serif,
              fontSize: 112,
              lineHeight: 0.96,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              margin: 0,
              maxWidth: 900,
            }}
          >
            {titleWords.map((w, i) => (
              <Reveal
                key={i}
                delay={150 + i * 120}
                y={28}
                style={{ display: "inline-block", marginRight: 18 }}
              >
                {w}
              </Reveal>
            ))}
          </h1>
          <Reveal delay={600} y={16}>
            <p
              className="fd-hero-tagline"
              style={{
                fontFamily: serif,
                fontStyle: "italic",
                fontSize: 22,
                color: cream,
                marginTop: 32,
                maxWidth: 540,
                lineHeight: 1.4,
              }}
            >
              {data.heroTagline}
            </p>
          </Reveal>
        </div>
      </ParallaxBg>

      <Marquee items={data.marquee} color={gold} bg={ink} font={sans} />

      <section className="fd-pad" style={{ padding: "120px 56px", borderTop: `1px solid #1f1f2e` }}>
        <div
          className="fd-grid-2"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <Reveal>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: gold,
                marginBottom: 20,
              }}
            >
              {data.storyEyebrow}
            </div>
            <h2
              className="fd-h2"
              style={{
                fontFamily: serif,
                fontSize: 56,
                lineHeight: 1.05,
                fontWeight: 400,
                letterSpacing: "-0.015em",
                marginBottom: 24,
              }}
            >
              {data.storyHeading}
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: muted, maxWidth: 480 }}>
              {data.storyBody}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ position: "relative", aspectRatio: "4/5" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 16,
                  border: `1px solid ${gold}`,
                  zIndex: 0,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  marginLeft: -16,
                  marginTop: -16,
                  backgroundImage: `url(${data.storyImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="fd-pad" style={{ background: cream, color: ink, padding: "120px 56px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#9c7c3c",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              {data.menuEyebrow}
            </div>
            <h2
              className="fd-h2"
              style={{
                fontFamily: serif,
                fontSize: 56,
                fontWeight: 400,
                textAlign: "center",
                marginBottom: 64,
                letterSpacing: "-0.015em",
              }}
            >
              {data.menuHeading}
            </h2>
          </Reveal>
          {data.menuItems.map((m, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                className={`fd-menu-row ${i % 2 === 0 ? "" : "fd-menu-row-odd"}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: i % 2 === 0 ? "200px 1fr auto" : "1fr 200px auto",
                  gap: 32,
                  alignItems: "center",
                  padding: "32px 0",
                  borderBottom: `1px solid #d8cdb0`,
                }}
              >
                {i % 2 === 0 ? (
                  <>
                    <div
                      className="fd-menu-img"
                      style={{
                        aspectRatio: "1",
                        backgroundImage: `url(${m.img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="fd-menu-text">
                      <h3 className="fd-h3" style={{ fontFamily: serif, fontSize: 30, fontWeight: 400, marginBottom: 8 }}>
                        {m.name}
                      </h3>
                      <p style={{ color: "#6b6151", fontSize: 16, fontStyle: "italic" }}>
                        {m.desc}
                      </p>
                    </div>
                    <div className="fd-price" style={{ fontFamily: serif, fontSize: 28, color: "#9c7c3c" }}>
                      {m.price}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="fd-menu-text" style={{ textAlign: "right" }}>
                      <h3 className="fd-h3" style={{ fontFamily: serif, fontSize: 30, fontWeight: 400, marginBottom: 8 }}>
                        {m.name}
                      </h3>
                      <p style={{ color: "#6b6151", fontSize: 16, fontStyle: "italic" }}>
                        {m.desc}
                      </p>
                    </div>
                    <div
                      className="fd-menu-img"
                      style={{
                        aspectRatio: "1",
                        backgroundImage: `url(${m.img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="fd-price" style={{ fontFamily: serif, fontSize: 28, color: "#9c7c3c" }}>
                      {m.price}
                    </div>
                  </>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="fd-pad" style={{ padding: "120px 56px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <h2
              className="fd-h2"
              style={{
                fontFamily: serif,
                fontSize: 56,
                fontWeight: 400,
                marginBottom: 48,
                letterSpacing: "-0.015em",
              }}
            >
              {data.galleryHeading}
            </h2>
          </Reveal>
          <div
            className="fd-gallery"
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1fr",
              gridTemplateRows: "260px 200px",
              gap: 16,
            }}
          >
            {data.galleryImages.slice(0, 5).map((src, i) => {
              const areas = [
                "1 / 1 / 3 / 2",
                "1 / 2 / 2 / 3",
                "1 / 3 / 2 / 4",
                "2 / 2 / 3 / 3",
                "2 / 3 / 3 / 4",
              ];
              return (
                <Reveal key={i} delay={i * 70} style={{ gridArea: areas[i] }}>
                  <HoverLift
                    lift={4}
                    style={{
                      height: "100%",
                      backgroundImage: `url(${src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div style={{ width: "100%", height: "100%" }} />
                  </HoverLift>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="fd-pad" style={{ padding: "100px 56px", borderTop: `1px solid #1f1f2e` }}>
        <div
          className="fd-grid-2"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
          }}
        >
          <Reveal>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: gold,
                marginBottom: 20,
              }}
            >
              Visit
            </div>
            <h3 className="fd-h3" style={{ fontFamily: serif, fontSize: 36, fontWeight: 400, marginBottom: 20 }}>
              {data.visitHeading}
            </h3>
            <p style={{ color: muted, marginBottom: 24 }}>{data.visitArea}</p>
            {data.hours.map(({ day, hours }) => (
              <div
                key={day}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: `1px solid #1f1f2e`,
                  fontSize: 15,
                }}
              >
                <span style={{ color: muted }}>{day}</span>
                <span>{hours}</span>
              </div>
            ))}
          </Reveal>
          <Reveal delay={120}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: gold,
                marginBottom: 20,
              }}
            >
              Reservations
            </div>
            <h3 className="fd-h3" style={{ fontFamily: serif, fontSize: 36, fontWeight: 400, marginBottom: 32 }}>
              {data.reservationsHeading}
            </h3>
            <p style={{ color: muted, marginBottom: 8 }}>{data.phone}</p>
            <p style={{ color: muted, marginBottom: 32 }}>{data.email}</p>
            <a
              href={data.bookingUrl}
              style={{
                display: "inline-block",
                padding: "16px 28px",
                background: gold,
                color: ink,
                textDecoration: "none",
                fontSize: 13,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {data.bookingLabel}
            </a>
          </Reveal>
        </div>
      </section>

      <footer
        className="fd-footer"
        style={{
          padding: "32px 56px",
          borderTop: `1px solid #1f1f2e`,
          fontSize: 12,
          color: muted,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {data.brand} · © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
