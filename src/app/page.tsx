"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteConfig } from "@/types/site-config";
import { templates } from "@/lib/templates";
import { Plus, Globe, Edit, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function DashboardHome() {
  const [sites, setSites] = useState<SiteConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetch("/api/sites")
      .then((res) => res.json())
      .then((data) => {
        setSites(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCreateSite = async (templateId: string) => {
    const template = templates[templateId as keyof typeof templates];
    const now = new Date().toISOString();
    const newSite: SiteConfig = {
      id: uuidv4(),
      name: "My New Site",
      slug: `my-site-${Date.now()}`,
      templateId: template.config.templateId,
      theme: template.config.theme,
      sections: template.config.sections,
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
      setShowCreateModal(false);
      window.location.href = `/builder?siteId=${saved.id}`;
    }
  };

  const handleDeleteSite = async (id: string) => {
    const res = await fetch(`/api/sites?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setSites((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Ethio<span className="text-blue-600">Wix</span>
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={16} /> New Site
          </button>
        </div>
      </nav>

      {/* Sites Grid */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">Your Sites</h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : sites.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Plus size={32} className="text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No sites yet
            </h3>
            <p className="mb-6 text-gray-500">
              Create your first hospitality website in minutes
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Create Your First Site
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => (
              <div
                key={site.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
              >
                <div
                  className="flex h-40 items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: site.theme.primaryColor }}
                >
                  {site.name}
                </div>
                <div className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{site.name}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        site.published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {site.published ? "Live" : "Draft"}
                    </span>
                  </div>
                  <p className="mb-4 text-sm text-gray-500">/{site.slug}</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/builder?siteId=${site.id}`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Edit size={14} /> Edit
                    </Link>
                    {site.published && (
                      <Link
                        href={`/sites/${site.slug}`}
                        target="_blank"
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-6">
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Choose a Template
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Pick a starting point — you can customize everything later
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {Object.entries(templates).map(([id, template]) => (
                <button
                  key={id}
                  onClick={() => handleCreateSite(id)}
                  className="overflow-hidden rounded-xl border-2 border-gray-200 text-left transition-all hover:border-blue-500 hover:shadow-md"
                >
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="aspect-[3/2] w-full object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900">
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {template.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCreateModal(false)}
              className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
