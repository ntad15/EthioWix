"use client";

import { SiteConfig } from "@/types/site-config";
import { SectionRenderer } from "./blocks/SectionRenderer";
import { ScrollReveal } from "./blocks/ScrollReveal";
import {
  ShowcaseRenderer,
  SHOWCASE_FONTS_HREF,
  isShowcaseTemplate,
} from "./showcases";

interface PublishedSiteProps {
  config: SiteConfig;
}

function PoweredByFooter() {
  const domain = process.env.NEXT_PUBLIC_DOMAIN ?? "fetansites.com";
  const protocol = domain.startsWith("localhost") ? "http" : "https";
  return (
    <div className="bg-black px-4 py-3 text-center text-xs text-white/70">
      Site powered by{" "}
      <a
        href={`${protocol}://${domain}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-white underline-offset-2 hover:underline"
      >
        {domain}
      </a>
    </div>
  );
}

export function PublishedSite({ config }: PublishedSiteProps) {
  if (isShowcaseTemplate(config.templateId)) {
    return (
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={SHOWCASE_FONTS_HREF} />
        <ShowcaseRenderer
          templateId={config.templateId}
          raw={config.showcaseData}
        />
        <PoweredByFooter />
      </>
    );
  }

  const animation = config.animation ?? "none";

  return (
    <main
      style={{
        fontFamily: config.theme.fontBody,
        fontSize: config.theme.fontSizeBase ?? "16px",
      }}
    >
      {config.sections.map((section, index) => {
        const block = (
          <SectionRenderer
            key={section.id}
            section={section}
            theme={config.theme}
            mode="view"
          />
        );

        if (animation === "scroll-reveal") {
          return (
            <ScrollReveal key={section.id} delay={index * 100}>
              {block}
            </ScrollReveal>
          );
        }

        if (animation === "fade-in") {
          return (
            <div
              key={section.id}
              style={{
                animation: `fadeIn 0.8s ease ${index * 150}ms both`,
              }}
            >
              {block}
            </div>
          );
        }

        return block;
      })}

      {/* Footer */}
      <footer
        className="px-4 py-6 text-center text-sm opacity-60"
        style={{
          backgroundColor: config.theme.primaryColor,
          color: config.theme.backgroundColor,
        }}
      >
        &copy; {new Date().getFullYear()} {config.name}. All rights reserved.
      </footer>

      <PoweredByFooter />

      {animation === "fade-in" && (
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      )}
    </main>
  );
}
