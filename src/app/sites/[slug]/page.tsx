import { getSiteBySlug } from "@/lib/db/site-store";
import { notFound } from "next/navigation";
import { PublishedSite } from "@/components/PublishedSite";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SitePage({ params }: PageProps) {
  const { slug } = await params;
  const site = getSiteBySlug(slug);

  if (!site || !site.published) {
    notFound();
  }

  return <PublishedSite config={site} />;
}
