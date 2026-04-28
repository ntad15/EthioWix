import DomainSettingsClient from "./DomainSettingsClient";

export default function DomainSettingsPage() {
  return (
    <div className="min-h-screen bg-cream px-6 py-12 font-sans text-ink">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-[36px] font-semibold tracking-[-0.025em]">Domain</h1>
        <p className="mt-2 text-sm text-muted-ink">
          Buy a new domain through FetanSites, or point a domain you already own.
        </p>
        <DomainSettingsClient />
      </div>
    </div>
  );
}
