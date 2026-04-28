"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteConfig } from "@/types/site-config";
import { templates, CATEGORIES, type CategoryId } from "@/lib/templates";
import { Plus, Globe, Edit, Trash2, LogOut, ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Toast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { addDefaultNav } from "@/components/builder/BuilderContext";
import { isShowcaseTemplate, SHOWCASE_DEFAULTS } from "@/components/showcases";

const AUTH_DISABLED = process.env.NEXT_PUBLIC_AUTH_DISABLED === "true";
const SITE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "fetansites.com";
const SITE_PROTOCOL = SITE_DOMAIN.startsWith("localhost") ? "http" : "https";

function siteUrl(slug: string) {
  return `${SITE_PROTOCOL}://${slug}.${SITE_DOMAIN}`;
}
function siteHost(slug: string) {
  return `${slug}.${SITE_DOMAIN}`;
}

function describeSites(count: number, drafts: number) {
  if (count === 0) {
    return "Nothing in progress yet — pick a template and we'll spin up your first site in a minute.";
  }
  const noun = count === 1 ? "site" : "sites";
  if (drafts === 0) {
    return `All ${count} of your ${noun} are live. Tweak something, or start something new.`;
  }
  const draftNoun = drafts === 1 ? "draft" : "drafts";
  return `You have ${drafts} ${draftNoun} in progress. Pick up where you left off, or start something new.`;
}

export function DashboardHome() {
  const [sites, setSites] = useState<SiteConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!AUTH_DISABLED) {
      import("@/lib/supabase/client").then(({ createClient }) => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
          setUserEmail(user?.email ?? null);
          const meta = user?.user_metadata as { first_name?: string } | undefined;
          setFirstName(meta?.first_name?.trim() || null);
        });
      });
    }

    fetch("/api/sites")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load sites");
        return res.json();
      })
      .then((data) => {
        setSites(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSignOut = async () => {
    if (AUTH_DISABLED) return;
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleCreateSite = async (templateId: string) => {
    const template = templates[templateId as keyof typeof templates];
    const now = new Date().toISOString();
    const tplId = template.config.templateId;
    const isShowcase = isShowcaseTemplate(tplId);
    const newSite: SiteConfig = {
      id: uuidv4(),
      userId: "",
      name: "My New Site",
      slug: `my-site-${Date.now()}`,
      animation: "none",
      templateId: template.config.templateId,
      theme: template.config.theme,
      sections: isShowcase
        ? (template.config.sections as SiteConfig["sections"])
        : addDefaultNav(template.config.sections as SiteConfig["sections"], "My New Site"),
      showcaseData: isShowcase
        ? { ...SHOWCASE_DEFAULTS[tplId], brand: "My New Site" }
        : undefined,
      published: false,
      createdAt: now,
      updatedAt: now,
    };

    const res = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSite),
    });

    if (res.ok) {
      const saved = await res.json();
      setSites((prev) => [...prev, saved]);
      closeCreateModal();
      window.location.href = `/builder?siteId=${saved.id}`;
    } else {
      const data = await res.json().catch(() => ({}));
      setToast({ message: data.error || "Failed to create site", type: "error" });
    }
  };

  const openCreateModal = () => {
    setSelectedCategory(null);
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setSelectedCategory(null);
  };

  const handleDeleteSite = async (id: string) => {
    const res = await fetch(`/api/sites?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setSites((prev) => prev.filter((s) => s.id !== id));
      setToast({ message: "Site deleted", type: "success" });
    } else {
      setToast({ message: "Failed to delete site", type: "error" });
    }
  };

  const greetingName = firstName ?? "friend";
  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const draftCount = sites.filter((s) => !s.published).length;
  const avatarLetter = (firstName ?? userEmail ?? "F").trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-cream font-sans text-ink">
      {/* Top nav */}
      <nav className="flex items-center justify-between border-b border-soft-border bg-white px-8 py-4">
        <Link href="/" className="text-[20px] font-bold tracking-[-0.01em] text-ink no-underline">
          Fetan<span className="text-brand">Sites</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-sm text-muted-ink no-underline">
            Templates
          </Link>
          <Link href="#" className="text-sm text-muted-ink no-underline">
            Help
          </Link>
          {!AUTH_DISABLED && userEmail && (
            <span className="text-[13px] text-muted-ink">{userEmail}</span>
          )}
          {!AUTH_DISABLED ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-[13px] font-semibold text-white">
                {avatarLetter}
              </div>
              <button
                onClick={handleSignOut}
                className="rounded-lg p-2 text-muted-ink hover:bg-soft-border/40 hover:text-ink"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-[13px] font-semibold text-white">
              {avatarLetter}
            </div>
          )}
        </div>
      </nav>

      {/* Welcome strip */}
      <section className="mx-auto max-w-[1100px] px-8 pb-6 pt-14">
        <div className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
          {dateLabel}
        </div>
        <h1 className="mb-3 font-serif text-[48px] font-semibold leading-[1.1] tracking-[-0.025em] text-ink">
          Selam {greetingName}{" "}
          <span className="font-normal text-muted-ink">— ready to build?</span>
        </h1>
        <p className="mb-8 max-w-[540px] text-[17px] leading-[1.5] text-muted-ink">
          {describeSites(sites.length, draftCount)}
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-[10px] bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-soft"
          >
            <Plus size={16} /> New site
          </button>
          <button
            onClick={openCreateModal}
            className="rounded-[10px] border border-soft-border bg-white px-5 py-3 text-sm font-medium text-ink hover:border-ink/20"
          >
            Browse templates
          </button>
          <Link
            href="/analytics"
            className="rounded-[10px] px-5 py-3 text-sm font-medium text-muted-ink no-underline hover:text-ink"
          >
            View analytics →
          </Link>
        </div>
      </section>

      {/* Sites grid */}
      <section className="mx-auto max-w-[1100px] px-8 pb-20 pt-8">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-[18px] font-semibold text-ink">Your sites</h2>
          <span className="text-[13px] text-muted-ink">
            {sites.length} {sites.length === 1 ? "site" : "sites"} · sorted by recent
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => (
              <div
                key={site.id}
                className="overflow-hidden rounded-[14px] border border-soft-border bg-white transition-shadow hover:shadow-lg"
              >
                <div
                  className="flex h-[140px] items-center justify-center text-[22px] font-bold tracking-[-0.01em] text-white"
                  style={{ backgroundColor: site.theme.primaryColor }}
                >
                  {site.name}
                </div>
                <div className="p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-[15px] font-semibold text-ink">{site.name}</h3>
                    <span
                      className={`rounded-full px-2 py-[3px] text-[11px] font-semibold ${
                        site.published
                          ? "bg-brand-tint text-brand"
                          : "bg-soft-border/60 text-muted-ink"
                      }`}
                    >
                      {site.published ? "Live" : "Draft"}
                    </span>
                  </div>
                  <p className="mb-3.5 text-[13px] text-muted-ink">{siteHost(site.slug)}</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/builder?siteId=${site.id}`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-soft-border py-2 text-[13px] font-medium text-ink no-underline hover:bg-cream"
                    >
                      <Edit size={14} /> Edit
                    </Link>
                    <Link
                      href={`/settings/domain?siteId=${site.id}`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-soft-border py-2 text-[13px] font-medium text-ink no-underline hover:bg-cream"
                      title="Connect a domain"
                    >
                      <Globe size={14} /> Domain
                    </Link>
                    {site.published && (
                      <Link
                        href={siteUrl(site.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-soft-border py-2 text-[13px] font-medium text-ink no-underline hover:bg-cream"
                      >
                        <Globe size={14} /> View
                      </Link>
                    )}
                    <button
                      onClick={() => handleDeleteSite(site.id)}
                      className="flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={openCreateModal}
              className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-[14px] border-[1.5px] border-dashed border-soft-border p-8 font-sans text-sm text-muted-ink transition-colors hover:border-brand hover:text-ink"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-tint text-[22px] font-semibold text-brand">
                +
              </div>
              <div className="font-semibold text-ink">Start a new site</div>
              <div className="max-w-[200px] text-center text-xs text-muted-ink">
                Pick a template designed for your business type
              </div>
            </button>
          </div>
        )}
      </section>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={closeCreateModal}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 border-b border-soft-border p-6">
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="mt-0.5 rounded-md p-1 text-muted-ink hover:bg-cream"
                  aria-label="Back to categories"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div className="flex-1">
                <h2 className="font-serif text-xl font-semibold tracking-[-0.01em] text-ink">
                  {selectedCategory
                    ? `Choose a ${CATEGORIES.find((c) => c.id === selectedCategory)?.label} template`
                    : "What kind of business is this for?"}
                </h2>
                <p className="mt-1 text-sm text-muted-ink">
                  {selectedCategory
                    ? "Pick a starting point — you can customize everything later"
                    : "We'll show you templates designed for that industry"}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {!selectedCategory ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {CATEGORIES.map((cat) => {
                    const count = Object.values(templates).filter(
                      (t) => t.category === cat.id,
                    ).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className="flex items-center gap-3 rounded-xl border-2 border-soft-border p-4 text-left transition-all hover:border-brand hover:shadow-md"
                      >
                        <span className="text-2xl">{cat.emoji}</span>
                        <span className="flex-1">
                          <span className="block font-semibold text-ink">{cat.label}</span>
                          <span className="text-xs text-muted-ink">
                            {count} {count === 1 ? "template" : "templates"}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-3">
                  {Object.entries(templates)
                    .filter(([, t]) => t.category === selectedCategory)
                    .map(([id, template]) => (
                      <button
                        key={id}
                        onClick={() => handleCreateSite(id)}
                        className="overflow-hidden rounded-xl border-2 border-soft-border text-left transition-all hover:border-brand hover:shadow-md"
                      >
                        <img
                          src={template.preview}
                          alt={template.name}
                          className="aspect-[3/2] w-full object-cover"
                        />
                        <div className="p-3">
                          <h3 className="font-semibold text-ink">{template.name}</h3>
                          <p className="text-xs text-muted-ink">{template.description}</p>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className="border-t border-soft-border p-4">
              <button
                onClick={closeCreateModal}
                className="w-full rounded-lg border border-soft-border py-2 text-sm font-medium text-muted-ink hover:bg-cream"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
