import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-cream px-6 py-12 font-sans text-ink">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-[36px] font-semibold tracking-[-0.025em]">Settings</h1>
        <p className="mt-2 text-sm text-muted-ink">Manage your sites, domains, and account.</p>

        <div className="mt-8 grid gap-4">
          <Link
            href="/settings/domain"
            className="rounded-lg border border-ink/10 bg-white p-5 transition hover:border-brand"
          >
            <div className="font-serif text-lg font-semibold">Domain</div>
            <div className="mt-1 text-sm text-muted-ink">
              Connect a custom domain or buy one through FetanSites.
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
