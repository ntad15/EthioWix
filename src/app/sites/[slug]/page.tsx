import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublishedSite } from "@/components/PublishedSite";
import { SiteConfig } from "@/types/site-config";

const AUTH_DISABLED = process.env.NEXT_PUBLIC_AUTH_DISABLED === "true";

async function getSite(slug: string): Promise<SiteConfig | null> {
  if (AUTH_DISABLED) {
    const { getSiteBySlug } = await import("@/lib/db/local-store");
    return getSiteBySlug(slug);
  }
  const { getSiteBySlug } = await import("@/lib/db/site-store");
  return getSiteBySlug(slug);
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite(slug);

  if (!site || !site.published) {
    return { title: "Site Not Found" };
  }

  const heroSection = site.sections.find((s) => s.type === "hero");
  const aboutSection = site.sections.find((s) => s.type === "about");

  const title = heroSection?.data && "businessName" in heroSection.data
    ? heroSection.data.businessName
    : site.name;

  const description = aboutSection?.data && "description" in aboutSection.data
    ? (aboutSection.data.description as string).slice(0, 160)
    : `Welcome to ${site.name}`;

  const heroImage = heroSection?.data && "backgroundImage" in heroSection.data
    ? heroSection.data.backgroundImage
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(heroImage ? { images: [{ url: heroImage as string, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(heroImage ? { images: [heroImage as string] } : {}),
    },
  };
}

export default async function SitePage({ params }: PageProps) {
  const { slug } = await params;
  const site = await getSite(slug);

  if (!site || !site.published) {
    notFound();
  }

  return <PublishedSite config={site} />;
}
