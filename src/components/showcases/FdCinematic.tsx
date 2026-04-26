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
    <div style={{ background: ink, color: text, fontFamily: sans }}>
      <div
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

      <ParallaxBg src={data.heroImage} strength={0.16} style={{ height: 720, marginTop: -68 }}>
        <div
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

      <section style={{ padding: "120px 56px", borderTop: `1px solid #1f1f2e` }}>
        <div
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

      <section style={{ background: cream, color: ink, padding: "120px 56px" }}>
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
                      style={{
                        aspectRatio: "1",
                        backgroundImage: `url(${m.img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div>
                      <h3 style={{ fontFamily: serif, fontSize: 30, fontWeight: 400, marginBottom: 8 }}>
                        {m.name}
                      </h3>
                      <p style={{ color: "#6b6151", fontSize: 16, fontStyle: "italic" }}>
                        {m.desc}
                      </p>
                    </div>
                    <div style={{ fontFamily: serif, fontSize: 28, color: "#9c7c3c" }}>
                      {m.price}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ textAlign: "right" }}>
                      <h3 style={{ fontFamily: serif, fontSize: 30, fontWeight: 400, marginBottom: 8 }}>
                        {m.name}
                      </h3>
                      <p style={{ color: "#6b6151", fontSize: 16, fontStyle: "italic" }}>
                        {m.desc}
                      </p>
                    </div>
                    <div
                      style={{
                        aspectRatio: "1",
                        backgroundImage: `url(${m.img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div style={{ fontFamily: serif, fontSize: 28, color: "#9c7c3c" }}>
                      {m.price}
                    </div>
                  </>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ padding: "120px 56px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <h2
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

      <section style={{ padding: "100px 56px", borderTop: `1px solid #1f1f2e` }}>
        <div
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
            <h3 style={{ fontFamily: serif, fontSize: 36, fontWeight: 400, marginBottom: 20 }}>
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
            <h3 style={{ fontFamily: serif, fontSize: 36, fontWeight: 400, marginBottom: 32 }}>
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
