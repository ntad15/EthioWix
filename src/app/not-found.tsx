import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 font-sans text-ink">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">404</p>
        <h1 className="mt-2 font-serif text-[40px] font-semibold tracking-[-0.025em] text-ink sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-muted-ink">
          We couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-soft"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
