"use client";

import { SiteConfig } from "@/types/site-config";
import { SectionRenderer } from "./blocks/SectionRenderer";

interface PublishedSiteProps {
  config: SiteConfig;
}

export function PublishedSite({ config }: PublishedSiteProps) {
  return (
    <main style={{ fontFamily: config.theme.fontBody }}>
      {config.sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          theme={config.theme}
          mode="view"
        />
      ))}

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
    </main>
  );
}
