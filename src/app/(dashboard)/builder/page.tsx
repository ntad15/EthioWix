"use client";

import { BuilderProvider } from "@/components/builder/BuilderContext";
import { BuilderSidebar } from "@/components/builder/BuilderSidebar";
import { BuilderCanvas } from "@/components/builder/BuilderCanvas";
import { SiteConfig } from "@/types/site-config";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function BuilderContent() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get("siteId");
  const [initialConfig, setInitialConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(!!siteId);

  useEffect(() => {
    if (siteId) {
      fetch(`/api/sites?id=${siteId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setInitialConfig(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [siteId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <BuilderProvider initialConfig={initialConfig ?? undefined}>
      <div className="flex h-screen">
        <BuilderSidebar />
        <div className="flex-1 overflow-y-auto bg-gray-100">
          {/* Back button */}
          <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 px-4 py-2 backdrop-blur">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>
          <div className="mx-auto max-w-5xl">
            <BuilderCanvas />
          </div>
        </div>
      </div>
    </BuilderProvider>
  );
}

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}
