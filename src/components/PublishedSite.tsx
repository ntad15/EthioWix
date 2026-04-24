"use client";

import { SiteConfig } from "@/types/site-config";
import { SectionRenderer } from "./blocks/SectionRenderer";
import { ScrollReveal } from "./blocks/ScrollReveal";

interface PublishedSiteProps {
  config: SiteConfig;
}

export function PublishedSite({ config }: PublishedSiteProps) {
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
